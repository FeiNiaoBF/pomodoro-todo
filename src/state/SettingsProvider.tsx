import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  clampSettingValue,
  defaultSettings,
  OneTomatoSettings,
  StoredOneTomatoSettings,
  settingsStorage,
} from '../storage/settingsStorage';

interface SettingsContextValue {
  settings: OneTomatoSettings;
  isHydrated: boolean;
  updateSettings: (patch: Partial<OneTomatoSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function normalizeLanguage(language: StoredOneTomatoSettings['language']): OneTomatoSettings['language'] {
  if (language === 'zh-Hans') {
    return 'zh-CN';
  }

  return language ?? defaultSettings.language;
}

function normalizeSettings(settings: StoredOneTomatoSettings): OneTomatoSettings {
  return {
    ...settings,
    language: normalizeLanguage(settings.language),
    focusDurationMinutes: clampSettingValue(
      'focusDurationMinutes',
      settings.focusDurationMinutes
    ),
    shortBreakDurationMinutes: clampSettingValue(
      'shortBreakDurationMinutes',
      settings.shortBreakDurationMinutes
    ),
    longBreakDurationMinutes: clampSettingValue(
      'longBreakDurationMinutes',
      settings.longBreakDurationMinutes
    ),
    longBreakInterval: clampSettingValue(
      'longBreakInterval',
      settings.longBreakInterval
    ),
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<OneTomatoSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);
  const changedBeforeHydrationRef = useRef(false);
  const skippedInitialPersistRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSettings() {
      const storedSettings = await settingsStorage.loadSettings();

      if (!isMounted) {
        return;
      }

      if (!changedBeforeHydrationRef.current) {
        setSettings(normalizeSettings(storedSettings));
      }

      setIsHydrated(true);
    }

    hydrateSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!skippedInitialPersistRef.current) {
      skippedInitialPersistRef.current = true;

      if (!changedBeforeHydrationRef.current) {
        return;
      }
    }

    settingsStorage.saveSettings(settings);
  }, [isHydrated, settings]);

  const updateSettings = useCallback((patch: Partial<OneTomatoSettings>) => {
    if (!isHydrated) {
      changedBeforeHydrationRef.current = true;
    }

    setSettings(prev => normalizeSettings({ ...prev, ...patch }));
  }, [isHydrated]);

  const resetSettings = useCallback(() => {
    if (!isHydrated) {
      changedBeforeHydrationRef.current = true;
    }

    setSettings(defaultSettings);
  }, [isHydrated]);

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    isHydrated,
    updateSettings,
    resetSettings,
  }), [isHydrated, resetSettings, settings, updateSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
