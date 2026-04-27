import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodayScreen } from '../../src/screens/TodayScreen';
import { Task } from '../../src/types/task';

const mockNavigate = jest.fn();
const mockStartTomato = jest.fn();
const mockSetCurrentTask = jest.fn();

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
    });
  });

  it('renders a loading state during task hydration', () => {
    mockUseTasks.mockReturnValue({
      currentTask: null,
      todayTasks: [],
      upNextTasks: [],
      isHydrated: false,
      setCurrentTask: mockSetCurrentTask,
    });

    const screen = renderToday();

    expect(screen.getByText('Preparing your focus rhythm...')).toBeTruthy();
  });

  it('renders an empty state when there is no current or today task', () => {
    mockUseTasks.mockReturnValue({
      currentTask: null,
      todayTasks: [],
      upNextTasks: [],
      isHydrated: true,
      setCurrentTask: mockSetCurrentTask,
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
    });

    const screen = renderToday();

    expect(screen.getByText(todayTask.title)).toBeTruthy();

    fireEvent.press(screen.getByText('Start Tomato'));

    expect(mockSetCurrentTask).toHaveBeenCalledWith(todayTask.id);
    expect(mockStartTomato).toHaveBeenCalledWith(todayTask);
    expect(mockNavigate).toHaveBeenCalledWith('Focus');
  });
});
