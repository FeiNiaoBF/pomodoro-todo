import { Task, TaskState } from '../types/task';
import { readJson, writeJson } from './storageClient';
import { STORAGE_KEYS } from './storageKeys';

const TASK_STATES: TaskState[] = [
  'backlog',
  'today',
  'active',
  'paused',
  'completed',
  'archived',
];

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const task = value as Partial<Task>;

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.estimatedTomatoes === 'number' &&
    typeof task.completedTomatoes === 'number' &&
    typeof task.state === 'string' &&
    TASK_STATES.includes(task.state as TaskState) &&
    typeof task.createdAt === 'number' &&
    typeof task.updatedAt === 'number'
  );
}

function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

export const tasksStorage = {
  async loadTasks(): Promise<Task[] | null> {
    return readJson(STORAGE_KEYS.tasks, isTaskArray);
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    await writeJson(STORAGE_KEYS.tasks, tasks);
  },
};
