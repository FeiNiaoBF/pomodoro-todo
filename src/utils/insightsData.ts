import { AppLanguage, translate } from '../i18n/translations';
import { Interruption, InterruptionReason, PomodoroSession } from '../types/pomodoro';
import { Task } from '../types/task';

export type TimeBlockId = 'morning' | 'afternoon' | 'evening' | 'night';

export const INSIGHTS_INTERRUPTION_REASONS: InterruptionReason[] = [
  'phone',
  'message',
  'people',
  'self_distraction',
  'other',
];

export const INSIGHTS_TIME_BLOCKS: TimeBlockId[] = [
  'morning',
  'afternoon',
  'evening',
  'night',
];

export interface TodaySummary {
  focusSeconds: number;
  completedTomatoes: number;
  completedTasks: number;
  interruptions: number;
}

export interface WeeklyFocusDay {
  key: string;
  date: Date;
  label: string;
  count: number;
}

export interface TaskProgress {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  exceededPlan: boolean;
}

export type PlanningAccuracyStatus =
  | 'over'
  | 'under'
  | 'matched'
  | 'insufficient';

export interface PlanningAccuracy {
  plannedTomatoes: number;
  actualTomatoes: number;
  difference: number;
  status: PlanningAccuracyStatus;
}

export interface InterruptionBreakdownItem {
  reason: InterruptionReason;
  count: number;
}

export interface TimeBlockResult {
  block: TimeBlockId;
  count: number;
}

export interface BestFocusTime {
  totalCompletedFocusSessions: number;
  blocks: TimeBlockResult[];
  strongestBlock: TimeBlockResult | null;
  hasEnoughData: boolean;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isSameLocalDay(timestamp: number, reference: Date) {
  return toLocalDateKey(new Date(timestamp)) === toLocalDateKey(reference);
}

export function getCompletedFocusSessions(sessions: PomodoroSession[]) {
  return sessions.filter(
    session => session.mode === 'focus' && session.status === 'completed'
  );
}

export function formatFocusTime(seconds: number, language: AppLanguage = 'en') {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (language === 'zh-CN') {
    return hours > 0 ? `${hours}小时 ${minutes}分钟` : `${minutes}分钟`;
  }

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function getLocalizedWeekdayLabels(language: AppLanguage) {
  return language === 'zh-CN'
    ? ['一', '二', '三', '四', '五', '六', '日']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
}

export function getLocalizedInterruptionLabels(language: AppLanguage) {
  return {
    phone: translate(language, 'insights.reason.phone'),
    message: translate(language, 'insights.reason.message'),
    people: translate(language, 'insights.reason.people'),
    self_distraction: translate(language, 'insights.reason.self'),
    other: translate(language, 'insights.reason.other'),
  } satisfies Record<InterruptionReason, string>;
}

export function getLocalizedTimeBlockLabels(language: AppLanguage) {
  return {
    morning: translate(language, 'insights.timeBlock.morning'),
    afternoon: translate(language, 'insights.timeBlock.afternoon'),
    evening: translate(language, 'insights.timeBlock.evening'),
    night: translate(language, 'insights.timeBlock.night'),
  } satisfies Record<TimeBlockId, string>;
}

export function getTodayPlanTasks(todayTasks: Task[], completedTasks: Task[], now = new Date()) {
  const todayTaskIds = new Set(todayTasks.map(task => task.id));
  const completedTodayTasks = completedTasks.filter(task =>
    task.completedAt ? isSameLocalDay(task.completedAt, now) : false
  );

  return [
    ...todayTasks,
    ...completedTodayTasks.filter(task => !todayTaskIds.has(task.id)),
  ];
}

export function getTodaySummary(
  sessions: PomodoroSession[],
  completedTasks: Task[],
  interruptions: Interruption[],
  now = new Date()
): TodaySummary {
  const completedFocusToday = getCompletedFocusSessions(sessions).filter(session =>
    isSameLocalDay(session.startedAt, now)
  );
  const completedTasksToday = completedTasks.filter(task =>
    task.completedAt ? isSameLocalDay(task.completedAt, now) : false
  );
  const interruptionsToday = interruptions.filter(interruption =>
    isSameLocalDay(interruption.createdAt, now)
  );

  return {
    focusSeconds: completedFocusToday.reduce(
      (total, session) => total + Math.max(0, session.actualDuration),
      0
    ),
    completedTomatoes: completedFocusToday.length,
    completedTasks: completedTasksToday.length,
    interruptions: interruptionsToday.length,
  };
}

export function getWeeklyFocusTrend(
  sessions: PomodoroSession[],
  language: AppLanguage,
  now = new Date()
): WeeklyFocusDay[] {
  const completedFocusSessions = getCompletedFocusSessions(sessions);
  const weekdayLabels = getLocalizedWeekdayLabels(language);

  return Array.from({ length: 7 }, (_, index) => {
    const date = startOfLocalDay(now);
    date.setDate(date.getDate() - (6 - index));

    const count = completedFocusSessions.filter(session =>
      isSameLocalDay(session.startedAt, date)
    ).length;
    const mondayIndex = (date.getDay() + 6) % 7;

    return {
      key: toLocalDateKey(date),
      date,
      label: weekdayLabels[mondayIndex],
      count,
    };
  });
}

export function getTaskProgress(todayTasks: Task[], completedTasks: Task[], now = new Date()): TaskProgress {
  const todayPlanTasks = getTodayPlanTasks(todayTasks, completedTasks, now);
  const completedTodayTasks = completedTasks.filter(task =>
    task.completedAt ? isSameLocalDay(task.completedAt, now) : false
  );
  const totalTasks = todayPlanTasks.length;
  const completedTaskCount = completedTodayTasks.length;
  const rawPercentage = totalTasks > 0 ? (completedTaskCount / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedTasks: completedTaskCount,
    percentage: Math.max(0, Math.min(100, Math.round(rawPercentage))),
    exceededPlan: totalTasks > 0 && completedTaskCount >= totalTasks,
  };
}

export function getPlanningAccuracy(
  todayTasks: Task[],
  completedTasks: Task[],
  sessions: PomodoroSession[],
  now = new Date()
): PlanningAccuracy {
  const todayPlanTasks = getTodayPlanTasks(todayTasks, completedTasks, now);
  const plannedTomatoes = todayPlanTasks.reduce(
    (total, task) => total + Math.max(0, task.estimatedTomatoes),
    0
  );
  const actualTomatoes = getCompletedFocusSessions(sessions).filter(session =>
    isSameLocalDay(session.startedAt, now)
  ).length;
  const difference = actualTomatoes - plannedTomatoes;

  if (plannedTomatoes === 0 && actualTomatoes === 0) {
    return {
      plannedTomatoes,
      actualTomatoes,
      difference,
      status: 'insufficient',
    };
  }

  if (difference > 0) {
    return {
      plannedTomatoes,
      actualTomatoes,
      difference,
      status: 'over',
    };
  }

  if (difference < 0) {
    return {
      plannedTomatoes,
      actualTomatoes,
      difference,
      status: 'under',
    };
  }

  return {
    plannedTomatoes,
    actualTomatoes,
    difference,
    status: 'matched',
  };
}

export function getInterruptionBreakdown(interruptions: Interruption[], now = new Date()) {
  const interruptionsToday = interruptions.filter(interruption =>
    isSameLocalDay(interruption.createdAt, now)
  );

  return INSIGHTS_INTERRUPTION_REASONS.map(reason => ({
    reason,
    count: interruptionsToday.filter(interruption => interruption.reason === reason).length,
  }));
}

function getTimeBlock(date: Date): TimeBlockId {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) {
    return 'morning';
  }

  if (hour >= 12 && hour < 18) {
    return 'afternoon';
  }

  if (hour >= 18) {
    return 'evening';
  }

  return 'night';
}

export function getBestFocusTimeBlock(sessions: PomodoroSession[]): BestFocusTime {
  const completedFocusSessions = getCompletedFocusSessions(sessions);
  const blocks = INSIGHTS_TIME_BLOCKS.map(block => ({
    block,
    count: completedFocusSessions.filter(session =>
      getTimeBlock(new Date(session.startedAt)) === block
    ).length,
  }));
  const totalCompletedFocusSessions = completedFocusSessions.length;
  const strongestBlock = blocks.reduce<TimeBlockResult | null>(
    (strongest, block) => {
      if (!strongest || block.count > strongest.count) {
        return block;
      }

      return strongest;
    },
    null
  );
  const hasEnoughData = totalCompletedFocusSessions >= 3 && Boolean(strongestBlock?.count);

  return {
    totalCompletedFocusSessions,
    blocks,
    strongestBlock: hasEnoughData ? strongestBlock : null,
    hasEnoughData,
  };
}
