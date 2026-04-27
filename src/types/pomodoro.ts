import { Task } from './task';

export type PomodoroMode =
  | 'idle'
  | 'focus'
  | 'short_break'
  | 'long_break';

export type PomodoroStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'interrupted'
  | 'saved_for_later';

export type InterruptionReason =
  | 'phone'
  | 'message'
  | 'people'
  | 'self_distraction'
  | 'other';

export interface PomodoroSession {
  id: string;
  taskId: string;
  mode: 'focus' | 'short_break' | 'long_break';
  plannedDuration: number;
  actualDuration: number;
  status: 'completed' | 'paused' | 'interrupted' | 'saved_for_later' | 'running';
  startedAt: number;
  endedAt?: number;
}

export interface Interruption {
  id: string;
  sessionId: string;
  reason: InterruptionReason;
  createdAt: number;
}

export interface PomodoroStateSnapshot {
  currentTask: Task | null;
  activeSession: PomodoroSession | null;
  currentMode: PomodoroMode;
  status: PomodoroStatus;
  remainingSeconds: number;
  completedSessions: PomodoroSession[];
  interruptions: Interruption[];
  focusSessionIndex: number;
  nextTaskPreview: Task | null;
  upNextTasks: Task[];
  dailyGoal: number;
}
