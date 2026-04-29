import {
  formatFocusTime,
  getBestFocusTimeBlock,
  getCompletedFocusSessions,
  getInterruptionBreakdown,
  getLocalizedInterruptionLabels,
  getLocalizedTimeBlockLabels,
  getLocalizedWeekdayLabels,
  getPlanningAccuracy,
  getTaskProgress,
  getTodaySummary,
  getWeeklyFocusTrend,
} from '../../src/utils/insightsData';
import { Interruption, PomodoroSession } from '../../src/types/pomodoro';
import { Task } from '../../src/types/task';

function makeSession(
  id: string,
  startedAt: Date,
  mode: PomodoroSession['mode'] = 'focus',
  status: PomodoroSession['status'] = 'completed',
  actualDuration = 1500
): PomodoroSession {
  return {
    id,
    taskId: 'task-1',
    mode,
    plannedDuration: 1500,
    actualDuration,
    status,
    startedAt: startedAt.getTime(),
    endedAt: startedAt.getTime() + actualDuration * 1000,
  };
}

function makeTask(id: string, patch: Partial<Task> = {}): Task {
  return {
    id,
    title: `Task ${id}`,
    estimatedTomatoes: 1,
    completedTomatoes: 0,
    state: 'today',
    createdAt: 1,
    updatedAt: 1,
    ...patch,
  };
}

function makeInterruption(
  id: string,
  reason: Interruption['reason'],
  createdAt: Date
): Interruption {
  return {
    id,
    sessionId: 'session-1',
    reason,
    createdAt: createdAt.getTime(),
  };
}

describe('insights data helpers', () => {
  const now = new Date(2026, 3, 29, 12);

  it('focus time excludes breaks', () => {
    const summary = getTodaySummary(
      [
        makeSession('focus-1', new Date(2026, 3, 29, 9), 'focus', 'completed', 1500),
        makeSession('break-1', new Date(2026, 3, 29, 10), 'short_break', 'completed', 300),
      ],
      [],
      [],
      now
    );

    expect(summary.focusSeconds).toBe(1500);
    expect(formatFocusTime(summary.focusSeconds)).toBe('25m');
  });

  it('completed tomatoes count completed focus sessions only', () => {
    const sessions = [
      makeSession('focus-1', new Date(2026, 3, 29, 9), 'focus', 'completed'),
      makeSession('focus-running', new Date(2026, 3, 29, 10), 'focus', 'running'),
      makeSession('break-1', new Date(2026, 3, 29, 11), 'short_break', 'completed'),
    ];

    expect(getCompletedFocusSessions(sessions)).toHaveLength(1);
    expect(getTodaySummary(sessions, [], [], now).completedTomatoes).toBe(1);
  });

  it('weekly trend groups sessions by local date', () => {
    const sessions = [
      makeSession('monday-1', new Date(2026, 3, 27, 9)),
      makeSession('monday-2', new Date(2026, 3, 27, 15)),
      makeSession('wednesday-1', new Date(2026, 3, 29, 10)),
    ];

    const trend = getWeeklyFocusTrend(sessions, 'en', now);

    expect(trend.map(day => day.count)).toEqual([0, 0, 0, 0, 2, 0, 1]);
  });

  it('Chinese weekday labels are distinct Monday through Sunday', () => {
    expect(getLocalizedWeekdayLabels('zh-CN')).toEqual(['一', '二', '三', '四', '五', '六', '日']);
  });

  it('English weekday labels do not collapse', () => {
    expect(new Set(getLocalizedWeekdayLabels('en')).size).toBeGreaterThan(1);
  });

  it('task progress clamps to 0-100', () => {
    const completedAt = new Date(2026, 3, 29, 11).getTime();
    const progress = getTaskProgress(
      [makeTask('today-1')],
      [
        makeTask('done-1', { state: 'completed', completedAt }),
        makeTask('done-2', { state: 'completed', completedAt }),
      ],
      now
    );

    expect(progress.percentage).toBe(67);

    const emptyProgress = getTaskProgress([], [], now);

    expect(emptyProgress.percentage).toBe(0);
  });

  it('planning accuracy handles actual greater than planned', () => {
    const accuracy = getPlanningAccuracy(
      [makeTask('today-1', { estimatedTomatoes: 1 })],
      [],
      [
        makeSession('focus-1', new Date(2026, 3, 29, 9)),
        makeSession('focus-2', new Date(2026, 3, 29, 10)),
      ],
      now
    );

    expect(accuracy.status).toBe('over');
    expect(accuracy.difference).toBe(1);
  });

  it('planning accuracy handles actual less than planned', () => {
    const accuracy = getPlanningAccuracy(
      [makeTask('today-1', { estimatedTomatoes: 3 })],
      [],
      [makeSession('focus-1', new Date(2026, 3, 29, 9))],
      now
    );

    expect(accuracy.status).toBe('under');
    expect(accuracy.difference).toBe(-2);
  });

  it('planning accuracy handles exact matches', () => {
    const accuracy = getPlanningAccuracy(
      [makeTask('today-1', { estimatedTomatoes: 2 })],
      [],
      [
        makeSession('focus-1', new Date(2026, 3, 29, 9)),
        makeSession('focus-2', new Date(2026, 3, 29, 10)),
      ],
      now
    );

    expect(accuracy.status).toBe('matched');
    expect(accuracy.difference).toBe(0);
  });

  it('planning accuracy handles insufficient data', () => {
    expect(getPlanningAccuracy([], [], [], now).status).toBe('insufficient');
  });

  it('interruption breakdown groups by reason', () => {
    const breakdown = getInterruptionBreakdown(
      [
        makeInterruption('phone-1', 'phone', new Date(2026, 3, 29, 9)),
        makeInterruption('phone-2', 'phone', new Date(2026, 3, 29, 10)),
        makeInterruption('self-1', 'self_distraction', new Date(2026, 3, 29, 11)),
      ],
      now
    );

    expect(breakdown.find(item => item.reason === 'phone')?.count).toBe(2);
    expect(breakdown.find(item => item.reason === 'self_distraction')?.count).toBe(1);
    expect(breakdown.find(item => item.reason === 'message')?.count).toBe(0);
  });

  it('best focus time returns empty state when not enough data', () => {
    const result = getBestFocusTimeBlock([
      makeSession('morning-1', new Date(2026, 3, 29, 9)),
      makeSession('afternoon-1', new Date(2026, 3, 29, 14)),
    ]);

    expect(result.hasEnoughData).toBe(false);
    expect(result.strongestBlock).toBeNull();
  });

  it('best focus time returns strongest time block when enough data exists', () => {
    const result = getBestFocusTimeBlock([
      makeSession('morning-1', new Date(2026, 3, 29, 7)),
      makeSession('morning-2', new Date(2026, 3, 29, 11)),
      makeSession('evening-1', new Date(2026, 3, 29, 19)),
    ]);

    expect(result.hasEnoughData).toBe(true);
    expect(result.strongestBlock).toEqual({ block: 'morning', count: 2 });
  });

  it('localization labels exist for English and Simplified Chinese', () => {
    expect(getLocalizedInterruptionLabels('en').phone).toBe('Phone');
    expect(getLocalizedInterruptionLabels('zh-CN').self_distraction).toBe('自己分心');
    expect(getLocalizedTimeBlockLabels('en').morning).toBe('Morning');
    expect(getLocalizedTimeBlockLabels('zh-CN').night).toBe('深夜');
  });
});
