export interface TodayFocusTask {
  label: string;
  title: string;
  description: string;
  completedTomatoes: number;
  totalTomatoes: number;
}

export const currentFocusTask: TodayFocusTask = {
  label: 'Current Tomato',
  title: 'Draft Q3 Marketing Plan',
  description: 'Focus on the main story and campaign direction.',
  completedTomatoes: 2,
  totalTomatoes: 3,
};

export const upNextTasks = [
  { id: 'emails', title: 'Reply to client emails', tomatoes: 1 },
  { id: 'pr', title: 'Review PR #42', tomatoes: 2 },
];
