import React, { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react-native';
import { usePomodoro } from '../../src/hooks/usePomodoro';
import { useTasks } from '../../src/hooks/useTasks';
import { PomodoroProvider } from '../../src/state/PomodoroProvider';
import { SettingsProvider } from '../../src/state/SettingsProvider';
import { TasksProvider } from '../../src/state/TasksProvider';
import { STORAGE_KEYS } from '../../src/storage/storageKeys';

function wrapper({ children }: { children: ReactNode }) {
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

async function storeSettings(settings: {
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
}) {
  await AsyncStorage.setItem(
    STORAGE_KEYS.settings,
    JSON.stringify({
      focusDurationMinutes: settings.focusDurationMinutes,
      shortBreakDurationMinutes: settings.shortBreakDurationMinutes,
      longBreakDurationMinutes: 15,
      longBreakInterval: 4,
      reducedMotion: false,
      theme: 'system',
    })
  );
}

describe('PomodoroProvider settings integration', () => {
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

  it('focusDurationMinutes affects startTomato remainingSeconds', async () => {
    await storeSettings({
      focusDurationMinutes: 45,
      shortBreakDurationMinutes: 5,
    });

    const { result } = renderHook(() => useProviderState(), { wrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    act(() => {
      result.current.pomodoro.startTomato(result.current.tasks.currentTask!);
    });

    expect(result.current.pomodoro.remainingSeconds).toBe(45 * 60);
    expect(result.current.pomodoro.activeSession?.plannedDuration).toBe(45 * 60);
  });

  it('shortBreakDurationMinutes affects break remainingSeconds', async () => {
    await storeSettings({
      focusDurationMinutes: 25,
      shortBreakDurationMinutes: 12,
    });

    const { result } = renderHook(() => useProviderState(), { wrapper });

    await waitFor(() => expect(result.current.pomodoro.isHydrated).toBe(true));

    act(() => {
      result.current.pomodoro.startTomato(result.current.tasks.currentTask!);
    });

    act(() => {
      result.current.pomodoro.completeFocus();
    });

    expect(result.current.pomodoro.currentMode).toBe('short_break');
    expect(result.current.pomodoro.remainingSeconds).toBe(12 * 60);
    expect(result.current.pomodoro.activeSession?.plannedDuration).toBe(12 * 60);
  });
});
