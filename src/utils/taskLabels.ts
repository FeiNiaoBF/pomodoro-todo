import { TaskState } from '../types/task';

const TASK_STATE_LABELS: Record<TaskState, string> = {
  active: 'Current focus',
  paused: 'Saved for later',
  today: 'Today',
  backlog: 'Backlog',
  completed: 'Done',
  archived: 'Archived',
};

export function getTaskStateLabel(state: TaskState) {
  return TASK_STATE_LABELS[state];
}

export function isShortTaskTitle(title: string) {
  const trimmedTitle = title.trim();

  return trimmedTitle.length < 3 || /^\d+$/.test(trimmedTitle);
}
