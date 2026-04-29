import { Task } from '../types/task';

const now = Date.now();

export const currentFocusTask: Task = {
  id: 'task-current',
  title: 'Start your first tomato',
  description: 'Tap Start Tomato and complete one focus session.',
  project: 'Tutorial',
  estimatedTomatoes: 1,
  completedTomatoes: 0,
  state: 'today',
  createdAt: now - 1000 * 60 * 60 * 5,
  updatedAt: now - 1000 * 60 * 20,
};

export const upNextTasks: Task[] = [
  {
    id: 'task-emails',
    title: 'Add your own task',
    description: 'Use Tasks to add something you want to finish today.',
    estimatedTomatoes: 1,
    completedTomatoes: 0,
    state: 'today',
    createdAt: now - 1000 * 60 * 50,
    updatedAt: now - 1000 * 60 * 25,
  },
];

export const backlogTasks: Task[] = [
  {
    id: 'task-retro',
    title: 'Read today in Insights',
    description: 'After a tomato, open Insights to review your focus time.',
    estimatedTomatoes: 1,
    completedTomatoes: 0,
    state: 'backlog',
    createdAt: now - 1000 * 60 * 90,
    updatedAt: now - 1000 * 60 * 40,
  },
];

export const initialTasks: Task[] = [
  currentFocusTask,
  ...upNextTasks,
  ...backlogTasks,
];

const tutorialTaskById = new Map(initialTasks.map(task => [task.id, task]));

const obsoleteSeedTaskIds = new Set([
  'task-pr42',
  'task-roadmap',
  'task-review',
]);

const legacySeedTitles: Record<string, string> = {
  'task-current': 'Draft Q3 Marketing Plan',
  'task-emails': 'Reply to client emails',
  'task-retro': 'Outline team retro notes',
};

export function normalizeSeedTasks(tasks: Task[]) {
  let changed = false;
  const normalizedTasks = tasks.flatMap(task => {
    if (obsoleteSeedTaskIds.has(task.id)) {
      changed = true;
      return [];
    }

    const tutorialTask = tutorialTaskById.get(task.id);

    if (tutorialTask && task.title === legacySeedTitles[task.id]) {
      changed = true;
      return [{
        ...tutorialTask,
        createdAt: task.createdAt,
        updatedAt: Date.now(),
      }];
    }

    return [task];
  });

  return { tasks: normalizedTasks, changed };
}
