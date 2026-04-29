import React, { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react-native';
import { usePomodoro } from '../../src/hooks/usePomodoro';
import { useTasks } from '../../src/hooks/useTasks';
import { PomodoroProvider } from '../../src/state/PomodoroProvider';
import { SettingsProvider } from '../../src/state/SettingsProvider';
import { TasksProvider } from '../../src/state/TasksProvider';
import { STORAGE_KEYS } from '../../src/storage/storageKeys';
import { ActiveTimerSnapshot } from '../../src/types/activeTimer';
import { PomodoroSession } from '../../src/types/pomodoro';

const NOW = Date.UTC(2026, 0, 1, 9, 0, 0);
const FOCUS_DURATION_SECONDS = 25 * 60;
const SHORT_BREAK_DURATION_SECONDS = 5 * 60;

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

async function readActiveTimer() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.activeTimer);

  return raw ? (JSON.parse(raw) as ActiveTimerSnapshot) : null;
}

async function readSessions() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.sessions);

  return raw ? (JSON.parse(raw) as PomodoroSession[]) : [];
}

function createRunningFocusSnapshot(
  overrides: Partial<ActiveTimerSnapshot> = {}
): ActiveTimerSnapshot {
  return {
    sessionId: 'recover-focus-session',
    taskId: 'task-current',
    mode: 'focus',
    status: 'running',
    plannedDuration: FOCUS_DURATION_SECONDS,
    remainingSeconds: FOCUS_DURATION_SECONDS,
    startedAt: NOW,
    expectedEndAt: NOW + FOCUS_DURATION_SECONDS * 1000,
    focusSessionIndex: 2,
    ...overrides,
  };
}

describe('active timer recovery', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('startTomato persists active timer snapshot', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));
    jest.setSystemTime(NOW);

    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    await waitFor(async () =>
      expect(await readActiveTimer()).toMatchObject({
        taskId: task.id,
        mode: 'focus',
        status: 'running',
        plannedDuration: FOCUS_DURATION_SECONDS,
        remainingSeconds: FOCUS_DURATION_SECONDS,
        startedAt: NOW,
        expectedEndAt: NOW + FOCUS_DURATION_SECONDS * 1000,
      })
    );
  });

  it('pause persists paused snapshot with remainingSeconds', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));
    jest.setSystemTime(NOW);

    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    jest.setSystemTime(NOW + 5 * 60 * 1000);

    act(() => {
      result.current.pomodoro.pause();
    });

    await waitFor(async () =>
      expect(await readActiveTimer()).toMatchObject({
        mode: 'focus',
        status: 'paused',
        remainingSeconds: 20 * 60,
        pausedAt: NOW + 5 * 60 * 1000,
      })
    );

    expect((await readActiveTimer())?.expectedEndAt).toBeUndefined();
  });

  it('resume updates expectedEndAt', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));
    jest.setSystemTime(NOW);

    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    jest.setSystemTime(NOW + 5 * 60 * 1000);

    act(() => {
      result.current.pomodoro.pause();
    });

    jest.setSystemTime(NOW + 10 * 60 * 1000);

    act(() => {
      result.current.pomodoro.resume();
    });

    await waitFor(async () =>
      expect(await readActiveTimer()).toMatchObject({
        mode: 'focus',
        status: 'running',
        remainingSeconds: 20 * 60,
        expectedEndAt: NOW + 30 * 60 * 1000,
      })
    );
  });

  it('saveForLater persists saved timer snapshot with remainingSeconds', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));
    jest.setSystemTime(NOW);

    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    jest.setSystemTime(NOW + 5 * 60 * 1000);

    act(() => {
      result.current.pomodoro.saveForLater();
    });

    await waitFor(async () =>
      expect(await readActiveTimer()).toMatchObject({
        mode: 'focus',
        status: 'saved_for_later',
        remainingSeconds: 20 * 60,
        pausedAt: NOW + 5 * 60 * 1000,
      })
    );
  });

  it('completeFocus replaces active focus snapshot with break snapshot and persists completed session', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));
    jest.setSystemTime(NOW);

    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.completeFocus();
    });

    await waitFor(async () =>
      expect(await readActiveTimer()).toMatchObject({
        mode: 'short_break',
        status: 'running',
        remainingSeconds: SHORT_BREAK_DURATION_SECONDS,
        expectedEndAt: NOW + SHORT_BREAK_DURATION_SECONDS * 1000,
      })
    );

    await waitFor(async () =>
      expect((await readSessions()).at(-1)).toMatchObject({
        taskId: task.id,
        mode: 'focus',
        status: 'completed',
      })
    );
  });

  it('startBreak persists break snapshot', async () => {
    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));
    jest.setSystemTime(NOW);

    act(() => {
      result.current.pomodoro.startBreak();
    });

    await waitFor(async () =>
      expect(await readActiveTimer()).toMatchObject({
        mode: 'short_break',
        status: 'running',
        remainingSeconds: SHORT_BREAK_DURATION_SECONDS,
        expectedEndAt: NOW + SHORT_BREAK_DURATION_SECONDS * 1000,
      })
    );
  });

  it('hydration recovers running focus timer with correct remainingSeconds', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.activeTimer,
      JSON.stringify(createRunningFocusSnapshot({
        expectedEndAt: NOW + 10 * 60 * 1000,
      }))
    );

    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    expect(result.current.pomodoro.currentMode).toBe('focus');
    expect(result.current.pomodoro.status).toBe('running');
    expect(result.current.pomodoro.remainingSeconds).toBe(10 * 60);
    expect(result.current.pomodoro.activeSession?.id).toBe('recover-focus-session');
  });

  it('hydration recovers paused timer without changing remainingSeconds', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.activeTimer,
      JSON.stringify(createRunningFocusSnapshot({
        status: 'paused',
        remainingSeconds: 777,
        expectedEndAt: undefined,
        pausedAt: NOW - 60 * 1000,
      }))
    );

    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    expect(result.current.pomodoro.currentMode).toBe('focus');
    expect(result.current.pomodoro.status).toBe('paused');
    expect(result.current.pomodoro.remainingSeconds).toBe(777);
    expect(result.current.pomodoro.activeSession?.id).toBe('recover-focus-session');
  });

  it('hydration recovers saved-for-later timer without changing remainingSeconds', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.activeTimer,
      JSON.stringify(createRunningFocusSnapshot({
        status: 'saved_for_later',
        remainingSeconds: 612,
        expectedEndAt: undefined,
        pausedAt: NOW - 60 * 1000,
      }))
    );

    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    expect(result.current.pomodoro.currentMode).toBe('focus');
    expect(result.current.pomodoro.status).toBe('saved_for_later');
    expect(result.current.pomodoro.remainingSeconds).toBe(612);
    expect(result.current.pomodoro.activeSession?.id).toBe('recover-focus-session');
  });

  it('hydration handles expired focus timer without double-counting completed session', async () => {
    const snapshot = createRunningFocusSnapshot({
      expectedEndAt: NOW - 1000,
      remainingSeconds: 0,
    });
    const completedSession: PomodoroSession = {
      id: snapshot.sessionId,
      taskId: snapshot.taskId!,
      mode: 'focus',
      plannedDuration: snapshot.plannedDuration,
      actualDuration: snapshot.plannedDuration,
      status: 'completed',
      startedAt: snapshot.startedAt,
      endedAt: snapshot.expectedEndAt,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.activeTimer, JSON.stringify(snapshot));
    await AsyncStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify([completedSession]));

    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    expect(result.current.pomodoro.completedSessions).toHaveLength(1);
    expect(result.current.tasks.tasks.find(task => task.id === snapshot.taskId)?.completedTomatoes)
      .toBe(2);
    expect(result.current.pomodoro.currentMode).toBe('short_break');
    expect(result.current.pomodoro.status).toBe('running');
    expect((await readActiveTimer())?.mode).toBe('short_break');
  });

  it('hydration handles expired break timer by completing break and clearing active timer', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.activeTimer,
      JSON.stringify(createRunningFocusSnapshot({
        sessionId: 'expired-break-session',
        mode: 'short_break',
        plannedDuration: SHORT_BREAK_DURATION_SECONDS,
        remainingSeconds: 0,
        expectedEndAt: NOW - 1000,
      }))
    );

    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    expect(result.current.pomodoro.currentMode).toBe('short_break');
    expect(result.current.pomodoro.status).toBe('completed');
    expect(result.current.pomodoro.remainingSeconds).toBe(0);
    expect(result.current.pomodoro.completedSessions.at(-1)).toMatchObject({
      id: 'expired-break-session',
      mode: 'short_break',
      status: 'completed',
    });
    expect(await readActiveTimer()).toBeNull();
  });

  it('hydration handles invalid active timer data safely', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await AsyncStorage.setItem(STORAGE_KEYS.activeTimer, '{bad timer');

    const { result } = renderHook(() => useProviderState(), { wrapper: AppStateWrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    expect(result.current.pomodoro.currentMode).toBe('idle');
    expect(result.current.pomodoro.status).toBe('idle');
    expect(await readActiveTimer()).toBeNull();

    warnSpy.mockRestore();
  });
});
