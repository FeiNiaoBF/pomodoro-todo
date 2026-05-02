import React, { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { TasksProvider } from '../../src/state/TasksProvider';
import { useTasks } from '../../src/hooks/useTasks';

function wrapper({ children }: { children: ReactNode }) {
  return <TasksProvider>{children}</TasksProvider>;
}

describe('TasksProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with seed tasks and derived groups', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.tasks).toHaveLength(3);
    expect(result.current.todayTasks).toHaveLength(2);
    expect(result.current.backlogTasks).toHaveLength(1);
    expect(result.current.completedTasks).toHaveLength(0);
    expect(result.current.currentTask?.id).toBe('task-current');
  });

  it('exposes today, backlog, and completed task states', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.todayTasks.every(task =>
      task.state === 'today' || task.state === 'active' || task.state === 'paused'
    )).toBe(true);
    expect(result.current.backlogTasks.every(task => task.state === 'backlog')).toBe(true);
    expect(result.current.completedTasks.every(task => task.state === 'completed')).toBe(true);
  });

  it('addTask creates a task with correct defaults', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.addTask({ title: '  Write provider tests  ' });
    });

    const addedTask = result.current.tasks.find(task => task.title === 'Write provider tests');

    expect(addedTask).toMatchObject({
      estimatedTomatoes: 1,
      completedTomatoes: 0,
      state: 'backlog',
    });
    expect(addedTask?.createdAt).toEqual(expect.any(Number));
    expect(addedTask?.updatedAt).toEqual(expect.any(Number));
  });

  it('moveTaskToToday changes task state to today', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.moveTaskToToday('task-retro');
    });

    expect(result.current.tasks.find(task => task.id === 'task-retro')?.state).toBe('today');
    expect(result.current.todayTasks.some(task => task.id === 'task-retro')).toBe(true);
  });

  it('moveTaskToBacklog removes a task from today without deleting it', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.moveTaskToBacklog('task-emails');
    });

    expect(result.current.tasks.find(task => task.id === 'task-emails')?.state).toBe('backlog');
    expect(result.current.todayTasks.some(task => task.id === 'task-emails')).toBe(false);
    expect(result.current.backlogTasks.some(task => task.id === 'task-emails')).toBe(true);
  });

  it('reorderTodayTask moves today tasks up and down', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.todayTasks.map(task => task.id)).toEqual([
      'task-current',
      'task-emails',
    ]);

    act(() => {
      result.current.reorderTodayTask('task-emails', 'up');
    });

    expect(result.current.todayTasks.map(task => task.id)).toEqual([
      'task-emails',
      'task-current',
    ]);

    act(() => {
      result.current.reorderTodayTask('task-emails', 'down');
    });

    expect(result.current.todayTasks.map(task => task.id)).toEqual([
      'task-current',
      'task-emails',
    ]);
  });

  it('setCurrentTask sets one active task and demotes the previous active task', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.setCurrentTask('task-current');
    });

    act(() => {
      result.current.setCurrentTask('task-emails');
    });

    const activeTasks = result.current.tasks.filter(task => task.state === 'active');

    expect(activeTasks).toHaveLength(1);
    expect(activeTasks[0].id).toBe('task-emails');
    expect(result.current.tasks.find(task => task.id === 'task-current')?.state).toBe('today');
  });

  it('completeTask sets state to completed and completedAt', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.completeTask('task-emails');
    });

    const completedTask = result.current.tasks.find(task => task.id === 'task-emails');

    expect(completedTask?.state).toBe('completed');
    expect(completedTask?.completedAt).toEqual(expect.any(Number));
  });

  it('archiveTask sets state to archived', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.archiveTask('task-emails');
    });

    expect(result.current.tasks.find(task => task.id === 'task-emails')?.state).toBe('archived');
  });

  it('incrementCompletedTomatoes increments count without completing the task', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.incrementCompletedTomatoes('task-emails');
    });

    const task = result.current.tasks.find(item => item.id === 'task-emails');

    expect(task?.completedTomatoes).toBe(1);
    expect(task?.state).toBe('today');
  });
});
