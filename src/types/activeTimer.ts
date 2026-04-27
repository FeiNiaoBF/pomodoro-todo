import { PomodoroMode } from './pomodoro';

export interface ActiveTimerSnapshot {
  sessionId: string;
  taskId?: string;
  mode: Exclude<PomodoroMode, 'idle'>;
  status: 'running' | 'paused' | 'interrupted' | 'saved_for_later';
  plannedDuration: number;
  remainingSeconds: number;
  startedAt: number;
  expectedEndAt?: number;
  pausedAt?: number;
  focusSessionIndex: number;
}
