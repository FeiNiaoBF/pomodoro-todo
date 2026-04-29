import { ActiveTimerSnapshot } from '../types/activeTimer';
import { PomodoroSession } from '../types/pomodoro';

export type ActiveTimerRecovery =
  | {
      kind: 'running';
      snapshot: ActiveTimerSnapshot;
      session: PomodoroSession;
      remainingSeconds: number;
    }
  | {
      kind: 'paused';
      snapshot: ActiveTimerSnapshot;
      session: PomodoroSession;
    }
  | {
      kind: 'expired_focus';
      completedSession: PomodoroSession;
      alreadyCompleted: boolean;
    }
  | {
      kind: 'expired_break';
      completedSession: PomodoroSession;
      alreadyCompleted: boolean;
    }
  | {
      kind: 'clear';
    };

export function getRecoveredRemainingSeconds(expectedEndAt: number, now = Date.now()) {
  return Math.max(0, Math.ceil((expectedEndAt - now) / 1000));
}

export function isExpiredSnapshot(snapshot: ActiveTimerSnapshot, now = Date.now()) {
  return Boolean(
    snapshot.status === 'running' &&
      snapshot.expectedEndAt &&
      getRecoveredRemainingSeconds(snapshot.expectedEndAt, now) === 0
  );
}

export function isSessionAlreadyCompleted(
  completedSessions: PomodoroSession[],
  sessionId: string
) {
  return completedSessions.some(session => session.id === sessionId);
}

export function createActiveTimerSnapshot(
  session: PomodoroSession,
  status: ActiveTimerSnapshot['status'],
  remainingSeconds: number,
  focusSessionIndex: number,
  now = Date.now()
): ActiveTimerSnapshot {
  return {
    sessionId: session.id,
    taskId: session.taskId,
    mode: session.mode,
    status,
    plannedDuration: session.plannedDuration,
    remainingSeconds,
    startedAt: session.startedAt,
    expectedEndAt: status === 'running' ? now + remainingSeconds * 1000 : undefined,
    pausedAt: status === 'paused' || status === 'interrupted' || status === 'saved_for_later' ? now : undefined,
    focusSessionIndex,
  };
}

export function createSessionFromSnapshot(snapshot: ActiveTimerSnapshot): PomodoroSession {
  return {
    id: snapshot.sessionId,
    taskId: snapshot.taskId ?? 'recovered-session',
    mode: snapshot.mode,
    plannedDuration: snapshot.plannedDuration,
    actualDuration: Math.max(0, snapshot.plannedDuration - snapshot.remainingSeconds),
    status: snapshot.status,
    startedAt: snapshot.startedAt,
  };
}

export function finalizeSession(
  session: PomodoroSession,
  status: PomodoroSession['status'],
  remainingSeconds: number,
  endedAt = Date.now()
): PomodoroSession {
  return {
    ...session,
    status,
    actualDuration: Math.max(0, session.plannedDuration - remainingSeconds),
    endedAt,
  };
}

export function finalizeSnapshot(
  snapshot: ActiveTimerSnapshot,
  endedAt = Date.now()
): PomodoroSession {
  return {
    id: snapshot.sessionId,
    taskId: snapshot.taskId ?? 'recovered-session',
    mode: snapshot.mode,
    plannedDuration: snapshot.plannedDuration,
    actualDuration: snapshot.plannedDuration,
    status: 'completed',
    startedAt: snapshot.startedAt,
    endedAt,
  };
}

export function recoverActiveTimerSnapshot(
  snapshot: ActiveTimerSnapshot,
  completedSessions: PomodoroSession[],
  now = Date.now()
): ActiveTimerRecovery {
  if (snapshot.status === 'running' && snapshot.expectedEndAt) {
    const recoveredRemainingSeconds = getRecoveredRemainingSeconds(
      snapshot.expectedEndAt,
      now
    );

    if (recoveredRemainingSeconds > 0) {
      const recoveredSnapshot = {
        ...snapshot,
        remainingSeconds: recoveredRemainingSeconds,
      };

      return {
        kind: 'running',
        snapshot: recoveredSnapshot,
        session: createSessionFromSnapshot(recoveredSnapshot),
        remainingSeconds: recoveredRemainingSeconds,
      };
    }

    const completedSession = finalizeSnapshot(snapshot, snapshot.expectedEndAt);
    const alreadyCompleted = isSessionAlreadyCompleted(
      completedSessions,
      snapshot.sessionId
    );

    return snapshot.mode === 'focus'
      ? { kind: 'expired_focus', completedSession, alreadyCompleted }
      : { kind: 'expired_break', completedSession, alreadyCompleted };
  }

  if (
    snapshot.status === 'paused' ||
    snapshot.status === 'interrupted' ||
    snapshot.status === 'saved_for_later'
  ) {
    return {
      kind: 'paused',
      snapshot,
      session: createSessionFromSnapshot(snapshot),
    };
  }

  return { kind: 'clear' };
}
