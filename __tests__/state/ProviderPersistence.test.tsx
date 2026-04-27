import React, { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react-native';
import { usePomodoro } from '../../src/hooks/usePomodoro';
import { useTasks } from '../../src/hooks/useTasks';
import { PomodoroProvider } from '../../src/state/PomodoroProvider';
import { SettingsProvider } from '../../src/state/SettingsProvider';
import { TasksProvider } from '../../src/state/TasksProvider';
import { STORAGE_KEYS } from '../../src/storage/storageKeys';
import { Task } from '../../src/types/task';

function TasksWrapper({ children }: { children: ReactNode }) {
  return <TasksProvider>{children}</TasksProvider>;
}

function AppStateWrapper({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <TasksProvider>
        <PomodoroProvider>{children}</PomodoroProvider>
      </TasksProvider>
    </SettingsProvider>
  );
}

function useProviderState() {
  return {
    pomodoro: usePomodoro(),
    tasks: useTasks(),
  };
}

const storedTask: Task = {
  id: 'stored-task',
  title: 'Stored task',
  estimatedTomatoes: 2,
  completedTomatoes: 1,
  state: 'today',
  createdAt: 100,
  updatedAt: 200,
};

describe('provider persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('TasksProvider loads stored tasks instead of seed tasks', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify([storedTask]));

    const { result } = renderHook(() => useTasks(), { wrapper: TasksWrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.tasks).toEqual([storedTask]);
    expect(result.current.currentTask?.id).toBe(storedTask.id);
  });

  it('TasksProvider falls back to seed tasks when storage is empty', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksWrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.tasks).toHaveLength(6);
    expect(result.current.currentTask?.id).toBe('task-current');
    expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(
      STORAGE_KEYS.tasks,
      expect.any(String)
    );
  });

  it('TasksProvider handles a stored empty task list without crashing', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify([]));

    const { result } = renderHook(() => useTasks(), { wrapper: TasksWrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.tasks).toEqual([]);
    expect(result.current.todayTasks).toEqual([]);
    expect(result.current.currentTask).toBeNull();
  });

  it('adding a task persists tasks after hydration', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksWrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.addTask({ title: 'Persist me', state: 'today' });
    });

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.tasks,
        expect.any(String)
      )
    );

    const persisted = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.tasks)) ?? '[]') as Task[];

    expect(persisted.some(task => task.title === 'Persist me' && task.state === 'today')).toBe(true);
  });

  it('updating task state persists tasks after hydration', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TasksWrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.moveTaskToToday('task-retro');
    });

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.tasks,
        expect.any(String)
      )
    );

    const persisted = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.tasks)) ?? '[]') as Task[];

    expect(persisted.find(task => task.id === 'task-retro')?.state).toBe('today');
  });

  it('completing focus persists completed sessions', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.completeFocus();
    });

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.sessions,
        expect.any(String)
      )
    );

    const persisted = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.sessions)) ?? '[]'
    );

    expect(persisted.at(-1)).toMatchObject({
      taskId: task.id,
      mode: 'focus',
      status: 'completed',
    });
  });

  it('logging an interruption persists interruptions', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.logInterruption('message');
    });

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.interruptions,
        expect.any(String)
      )
    );

    const persisted = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.interruptions)) ?? '[]'
    );

    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({
      reason: 'message',
      sessionId: result.current.pomodoro.activeSession?.id,
    });
  });

  it('invalid JSON does not crash hydration and falls back safely', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await AsyncStorage.setItem(STORAGE_KEYS.tasks, '{not valid json');

    const { result } = renderHook(() => useTasks(), { wrapper: TasksWrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.tasks).toHaveLength(6);
    expect(result.current.currentTask?.id).toBe('task-current');

    warnSpy.mockRestore();
  });
});
