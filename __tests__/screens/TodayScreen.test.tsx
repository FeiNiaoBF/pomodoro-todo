import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodayScreen } from '../../src/screens/TodayScreen';
import { Task } from '../../src/types/task';

const mockNavigate = jest.fn();
const mockStartTomato = jest.fn();
const mockSetCurrentTask = jest.fn();
const mockMoveTaskToBacklog = jest.fn();
const mockReorderTodayTask = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../src/hooks/useAppTheme', () => ({
  useAppTheme: () => {
    const { getAppTheme } = require('../../src/theme/appTheme');
    return getAppTheme('light', 'light');
  },
}));

jest.mock('../../src/hooks/usePomodoro', () => ({
  usePomodoro: () => ({
    completedSessions: [],
    dailyGoal: 4,
    startTomato: mockStartTomato,
  }),
}));

jest.mock('../../src/hooks/useTranslation', () => ({
  useTranslation: () => ({
    language: 'en',
    t: (key: string, replacements?: Record<string, string | number>) => {
      const labels: Record<string, string> = {
        'common.settings': 'Settings',
        'today.title': "Today's Focus",
        'today.completed': 'Tomatoes completed today',
        'today.firstStepHint': 'Start with one task. The count appears after your first completed tomato.',
        'today.preparingTitle': 'Loading today...',
        'today.preparingCopy': 'Your tasks will appear here.',
        'today.currentTomato': 'Current Tomato',
        'today.startTomato': 'Start Tomato',
        'today.blankTitle': 'Your day is a blank slate.',
        'today.blankCopy': 'Add one small task to begin.',
        'today.addTask': 'Add a task',
        'today.upNext': 'Up Next',
        'today.keepLight': 'Keep it light',
        'today.arrange': 'Arrange',
        'today.doneArranging': 'Done',
        'today.removeFromToday': 'Remove today',
        'today.noNextTitle': 'No next task yet.',
        'today.noNextCopy': 'Keep one tomato in focus.',
        'tasks.moveUp': 'Move up',
        'tasks.moveDown': 'Move down',
        'task.readyNow': 'Ready now',
      };

      return Object.entries(replacements ?? {}).reduce(
        (text, [name, value]) => text.replace(`{${name}}`, String(value)),
        labels[key] ?? key
      );
    },
  }),
}));

const mockUseTasks = jest.fn();

jest.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
}));

const todayTask: Task = {
  id: 'today-task',
  title: 'Write one focused paragraph',
  estimatedTomatoes: 1,
  completedTomatoes: 0,
  state: 'today',
  createdAt: 100,
  updatedAt: 100,
};

const secondTask: Task = {
  id: 'second-task',
  title: 'Second task',
  estimatedTomatoes: 1,
  completedTomatoes: 0,
  state: 'today',
  createdAt: 200,
  updatedAt: 200,
};

function renderToday() {
  return render(<TodayScreen />);
}

describe('TodayScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTasks.mockReturnValue({
      currentTask: todayTask,
      todayTasks: [todayTask],
      upNextTasks: [],
      isHydrated: true,
      setCurrentTask: mockSetCurrentTask,
      moveTaskToBacklog: mockMoveTaskToBacklog,
      reorderTodayTask: mockReorderTodayTask,
    });
  });

  it('renders a loading state during task hydration', () => {
    mockUseTasks.mockReturnValue({
      currentTask: null,
      todayTasks: [],
      upNextTasks: [],
      isHydrated: false,
      setCurrentTask: mockSetCurrentTask,
      moveTaskToBacklog: mockMoveTaskToBacklog,
      reorderTodayTask: mockReorderTodayTask,
    });

    const screen = renderToday();

    expect(screen.getByText('Loading today...')).toBeTruthy();
  });

  it('renders an empty state when there is no current or today task', () => {
    mockUseTasks.mockReturnValue({
      currentTask: null,
      todayTasks: [],
      upNextTasks: [],
      isHydrated: true,
      setCurrentTask: mockSetCurrentTask,
      moveTaskToBacklog: mockMoveTaskToBacklog,
      reorderTodayTask: mockReorderTodayTask,
    });

    const screen = renderToday();

    expect(screen.getByText('Your day is a blank slate.')).toBeTruthy();
    expect(screen.getByText('Add one small task to begin.')).toBeTruthy();

    fireEvent.press(screen.getByText('Add a task'));

    expect(mockNavigate).toHaveBeenCalledWith('MainTabs', { screen: 'Tasks' });
  });

  it('uses the first today task as a focus candidate when no task is active', () => {
    mockUseTasks.mockReturnValue({
      currentTask: null,
      todayTasks: [todayTask],
      upNextTasks: [todayTask],
      isHydrated: true,
      setCurrentTask: mockSetCurrentTask,
      moveTaskToBacklog: mockMoveTaskToBacklog,
      reorderTodayTask: mockReorderTodayTask,
    });

    const screen = renderToday();

    expect(screen.getByText(todayTask.title)).toBeTruthy();

    fireEvent.press(screen.getByText('Start Tomato'));

    expect(mockSetCurrentTask).toHaveBeenCalledWith(todayTask.id);
    expect(mockStartTomato).toHaveBeenCalledWith(todayTask);
    expect(mockNavigate).toHaveBeenCalledWith('Focus');
  });

  it('reveals Today queue arrangement controls after long press', () => {
    mockUseTasks.mockReturnValue({
      currentTask: todayTask,
      todayTasks: [todayTask, secondTask],
      upNextTasks: [secondTask],
      isHydrated: true,
      setCurrentTask: mockSetCurrentTask,
      moveTaskToBacklog: mockMoveTaskToBacklog,
      reorderTodayTask: mockReorderTodayTask,
    });

    const screen = renderToday();

    fireEvent(screen.getByLabelText(secondTask.title), 'onLongPress');
    fireEvent.press(screen.getByLabelText('Move up'));

    expect(mockReorderTodayTask).toHaveBeenCalledWith(secondTask.id, 'up');

    fireEvent.press(screen.getByText('Remove today'));

    expect(mockMoveTaskToBacklog).toHaveBeenCalledWith(secondTask.id);
  });
});
