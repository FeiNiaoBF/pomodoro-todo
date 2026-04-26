// 🍅 番茄钟核心类型定义

/** 番茄钟时段类型 */
export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak';

/** 计时器运行状态 */
export type TimerStatus = 'idle' | 'running' | 'paused';

/** 计时器配置 */
export interface TimerConfig {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  dailyGoal: number;
}

/** 计时器状态快照 */
export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  elapsed: number;
  totalSeconds: number;
  completedPomodoros: number;
}

/** 任务优先级 */
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'active' | 'completed' | 'archived';

/** 任务 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  tags: string[];
  estimatedPomodoros: number;
  actualPomodoros: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** 番茄记录 */
export interface PomodoroSession {
  id: string;
  taskId?: string;
  phase: TimerPhase;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  completed: boolean;
}

/** 默认配置 */
export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  dailyGoal: 8,
};