import { PomodoroSession } from '../types/pomodoro';
import { Task } from '../types/task';

const now = Date.now();

export const currentFocusTask: Task = {
  id: 'task-current',
  title: 'Draft Q3 Marketing Plan',
  description: 'Focus on the main story and campaign direction.',
  project: 'Marketing',
  estimatedTomatoes: 3,
  completedTomatoes: 2,
  state: 'today',
  createdAt: now - 1000 * 60 * 60 * 5,
  updatedAt: now - 1000 * 60 * 20,
};

export const upNextTasks: Task[] = [
  {
    id: 'task-emails',
    title: 'Reply to client emails',
    estimatedTomatoes: 1,
    completedTomatoes: 0,
    state: 'today',
    createdAt: now - 1000 * 60 * 50,
    updatedAt: now - 1000 * 60 * 25,
  },
  {
    id: 'task-pr42',
    title: 'Review PR #42',
    estimatedTomatoes: 2,
    completedTomatoes: 0,
    state: 'today',
    createdAt: now - 1000 * 60 * 45,
    updatedAt: now - 1000 * 60 * 18,
  },
];

export const sampleCompletedSessions: PomodoroSession[] = [
  {
    id: 'session-1',
    taskId: 'task-deep-work',
    mode: 'focus',
    plannedDuration: 25 * 60,
    actualDuration: 25 * 60,
    status: 'completed',
    startedAt: now - 1000 * 60 * 180,
    endedAt: now - 1000 * 60 * 155,
  },
  {
    id: 'session-2',
    taskId: 'task-writing',
    mode: 'focus',
    plannedDuration: 25 * 60,
    actualDuration: 25 * 60,
    status: 'completed',
    startedAt: now - 1000 * 60 * 125,
    endedAt: now - 1000 * 60 * 100,
  },
  {
    id: 'session-3',
    taskId: currentFocusTask.id,
    mode: 'focus',
    plannedDuration: 25 * 60,
    actualDuration: 25 * 60,
    status: 'completed',
    startedAt: now - 1000 * 60 * 75,
    endedAt: now - 1000 * 60 * 50,
  },
];
