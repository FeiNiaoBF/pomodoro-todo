import React, { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react-native';
import { useSettings } from '../../src/hooks/useSettings';
import { SettingsProvider } from '../../src/state/SettingsProvider';
import { defaultSettings } from '../../src/storage/settingsStorage';
import { STORAGE_KEYS } from '../../src/storage/storageKeys';

function wrapper({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}

describe('SettingsProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('loads defaults when storage is empty', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.settings).toEqual(defaultSettings);
  });

  it('loads stored settings', async () => {
    const storedSettings = {
      focusDurationMinutes: 45,
      shortBreakDurationMinutes: 8,
      longBreakDurationMinutes: 20,
      longBreakInterval: 3,
      reducedMotion: true,
      theme: 'dark',
    };

    await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(storedSettings));

    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.settings).toEqual(storedSettings);
  });

  it('updateSettings persists changes', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.updateSettings({
        focusDurationMinutes: 50,
        reducedMotion: true,
      });
    });

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.settings,
        expect.any(String)
      )
    );

    const persisted = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.settings)) ?? '{}'
    );

    expect(persisted).toMatchObject({
      focusDurationMinutes: 50,
      reducedMotion: true,
    });
  });

  it('resetSettings restores defaults', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.updateSettings({
        focusDurationMinutes: 60,
        theme: 'dark',
      });
    });

    act(() => {
      result.current.resetSettings();
    });

    await waitFor(() => expect(result.current.settings).toEqual(defaultSettings));

    const persisted = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.settings)) ?? '{}'
    );

    expect(persisted).toEqual(defaultSettings);
  });

  it('invalid stored settings falls back safely', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({
        focusDurationMinutes: 2,
        shortBreakDurationMinutes: 5,
        longBreakDurationMinutes: 20,
        longBreakInterval: 4,
        reducedMotion: false,
        theme: 'system',
      })
    );

    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.settings).toEqual(defaultSettings);
  });
});
