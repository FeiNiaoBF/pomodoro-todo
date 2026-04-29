import { getTimeOfDayGreeting, getWeekdayLabel } from '../../src/utils/dateLabels';
import { shouldShowDevTimerControls } from '../../src/utils/devControls';
import { getVisibleBarPercent } from '../../src/utils/chartScales';
import { getTaskStateLabel } from '../../src/utils/taskLabels';
import {
  formatDailyGoalProgress,
  formatTomatoProgress,
  getTomatoDotCounts,
} from '../../src/utils/tomatoProgress';

describe('tomato progress display helpers', () => {
  it('formats normal progress', () => {
    expect(formatTomatoProgress(2, 3)).toBe('2/3 tomatoes');
  });

  it('handles zero estimate safely', () => {
    expect(formatTomatoProgress(0, 0)).toBe('No estimate');
    expect(getTomatoDotCounts(2, 0)).toEqual({ completed: 0, total: 0 });
  });

  it('formats completed less than estimate', () => {
    expect(formatTomatoProgress(1, 3)).toBe('1/3 tomatoes');
  });

  it('formats completed equal to estimate', () => {
    expect(formatTomatoProgress(3, 3)).toBe('3/3 tomatoes');
  });

  it('formats completed greater than estimate without invalid ratio', () => {
    expect(formatTomatoProgress(6, 1)).toBe('6 completed · Estimated 1');
    expect(getTomatoDotCounts(6, 1)).toEqual({ completed: 1, total: 1 });
  });

  it('formats daily goal over-completion without invalid ratio', () => {
    expect(formatDailyGoalProgress(9, 8)).toEqual({
      primaryText: '9 completed',
      secondaryText: 'Goal 8 · 1 beyond goal',
      completed: 8,
      total: 8,
    });
  });

  it('formats tomato progress in Chinese', () => {
    expect(formatTomatoProgress(2, 3, 'zh-Hans')).toBe('2/3 个番茄');
    expect(formatTomatoProgress(6, 1, 'zh-Hans')).toBe('6 已完成 · 预计 1');
  });
});

describe('date display helpers', () => {
  it('derives morning greeting', () => {
    expect(getTimeOfDayGreeting(new Date(2026, 3, 27, 8))).toBe('Good morning');
    expect(getTimeOfDayGreeting(new Date(2026, 3, 27, 8), 'zh-Hans')).toBe('早上好');
  });

  it('derives afternoon greeting', () => {
    expect(getTimeOfDayGreeting(new Date(2026, 3, 27, 15))).toBe('Good afternoon');
  });

  it('derives evening greeting', () => {
    expect(getTimeOfDayGreeting(new Date(2026, 3, 27, 22))).toBe('Good evening');
    expect(getTimeOfDayGreeting(new Date(2026, 3, 27, 4))).toBe('Good evening');
  });

  it('generates locale-safe weekday labels', () => {
    const monday = new Date(2026, 3, 27);

    expect(getWeekdayLabel(monday, 'zh-CN')).toBe('一');
    expect(getWeekdayLabel(monday, 'en-US')).toBe('M');
  });
});

describe('task and development display helpers', () => {
  it('maps task states to user-facing labels', () => {
    expect(getTaskStateLabel('active')).toBe('Current focus');
    expect(getTaskStateLabel('paused')).toBe('Saved for later');
    expect(getTaskStateLabel('completed')).toBe('Done');
    expect(getTaskStateLabel('active', 'zh-Hans')).toBe('当前专注');
  });

  it('hides dev timer controls by default', () => {
    expect(shouldShowDevTimerControls(undefined)).toBe(false);
    expect(shouldShowDevTimerControls('false')).toBe(false);
    expect(shouldShowDevTimerControls('true')).toBe(true);
  });
});

describe('chart display helpers', () => {
  it('keeps zero-value bars visually empty', () => {
    expect(getVisibleBarPercent(0, 10)).toBe(0);
    expect(getVisibleBarPercent(0, 0)).toBe(0);
  });

  it('keeps small non-zero values visible', () => {
    expect(getVisibleBarPercent(1, 100, 8)).toBe(8);
    expect(getVisibleBarPercent(50, 100, 8)).toBe(50);
  });
});
