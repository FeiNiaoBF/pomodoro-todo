export type TaskState =
  | 'backlog'
  | 'today'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  project?: string;
  estimatedTomatoes: number;
  completedTomatoes: number;
  state: TaskState;
  dueDate?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}
