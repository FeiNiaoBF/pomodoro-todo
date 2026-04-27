import {
  createActiveTimerSnapshot,
  getRecoveredRemainingSeconds,
  isExpiredSnapshot,
  recoverActiveTimerSnapshot,
} from '../../src/state/pomodoroRecovery';
import { ActiveTimerSnapshot } from '../../src/types/activeTimer';
import { PomodoroSession } from '../../src/types/pomodoro';

const NOW = Date.UTC(2026, 0, 1, 9, 0, 0);

const focusSession: PomodoroSession = {
  id: 'session-focus',
  taskId: 'task-current',
  mode: 'focus',
  plannedDuration: 1500,
  actualDuration: 0,
  status: 'running',
  startedAt: NOW,
};

function runningFocusSnapshot(
  overrides: Partial<ActiveTimerSnapshot> = {}
): ActiveTimerSnapshot {
  return {
    sessionId: focusSession.id,
    taskId: focusSession.taskId,
    mode: 'focus',
    status: 'running',
    plannedDuration: 1500,
    remainingSeconds: 1500,
    startedAt: NOW,
    expectedEndAt: NOW + 1500 * 1000,
    focusSessionIndex: 2,
    ...overrides,
  };
}

describe('pomodoroRecovery helpers', () => {
  it('calculates recovered remaining seconds with ceiling', () => {
    expect(getRecoveredRemainingSeconds(NOW + 1500, NOW)).toBe(2);
    expect(getRecoveredRemainingSeconds(NOW - 1, NOW)).toBe(0);
  });

  it('creates running and paused active timer snapshots', () => {
    expect(createActiveTimerSnapshot(focusSession, 'running', 1200, 3, NOW))
      .toMatchObject({
        sessionId: focusSession.id,
        mode: 'focus',
        status: 'running',
        remainingSeconds: 1200,
        expectedEndAt: NOW + 1200 * 1000,
        focusSessionIndex: 3,
      });

    const pausedSnapshot = createActiveTimerSnapshot(
      focusSession,
      'paused',
      900,
      3,
      NOW
    );

    expect(pausedSnapshot.expectedEndAt).toBeUndefined();
    expect(pausedSnapshot.pausedAt).toBe(NOW);
  });

  it('recovers a still-running focus snapshot', () => {
    const recovery = recoverActiveTimerSnapshot(
      runningFocusSnapshot({ expectedEndAt: NOW + 10 * 60 * 1000 }),
      [],
      NOW
    );

    expect(recovery).toMatchObject({
      kind: 'running',
      remainingSeconds: 600,
      session: {
        id: focusSession.id,
        mode: 'focus',
        status: 'running',
      },
    });
  });

  it('classifies expired focus snapshots and reports duplicate completion state', () => {
    const snapshot = runningFocusSnapshot({ expectedEndAt: NOW - 1000 });

    expect(isExpiredSnapshot(snapshot, NOW)).toBe(true);

    expect(recoverActiveTimerSnapshot(snapshot, [], NOW)).toMatchObject({
      kind: 'expired_focus',
      alreadyCompleted: false,
      completedSession: {
        id: snapshot.sessionId,
        mode: 'focus',
        status: 'completed',
      },
    });

    expect(recoverActiveTimerSnapshot(
      snapshot,
      [{ ...focusSession, status: 'completed' }],
      NOW
    )).toMatchObject({
      kind: 'expired_focus',
      alreadyCompleted: true,
    });
  });

  it('recovers paused and interrupted snapshots without recalculating remaining seconds', () => {
    expect(recoverActiveTimerSnapshot(
      runningFocusSnapshot({
        status: 'paused',
        remainingSeconds: 777,
        expectedEndAt: undefined,
      }),
      [],
      NOW
    )).toMatchObject({
      kind: 'paused',
      snapshot: {
        status: 'paused',
        remainingSeconds: 777,
      },
    });

    expect(recoverActiveTimerSnapshot(
      runningFocusSnapshot({
        status: 'interrupted',
        remainingSeconds: 444,
        expectedEndAt: undefined,
      }),
      [],
      NOW
    )).toMatchObject({
      kind: 'paused',
      snapshot: {
        status: 'interrupted',
        remainingSeconds: 444,
      },
    });
  });

  it('classifies expired break snapshots', () => {
    expect(recoverActiveTimerSnapshot(
      runningFocusSnapshot({
        sessionId: 'session-break',
        mode: 'short_break',
        plannedDuration: 300,
        remainingSeconds: 0,
        expectedEndAt: NOW - 1000,
      }),
      [],
      NOW
    )).toMatchObject({
      kind: 'expired_break',
      alreadyCompleted: false,
      completedSession: {
        id: 'session-break',
        mode: 'short_break',
        status: 'completed',
      },
    });
  });
});
