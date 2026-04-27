import { readJson, writeJson } from './storageClient';
import { STORAGE_KEYS } from './storageKeys';

export type OneTomatoTheme = 'system' | 'light' | 'dark';

export interface OneTomatoSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  reducedMotion: boolean;
  theme: OneTomatoTheme;
}

export const defaultSettings: OneTomatoSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  reducedMotion: false,
  theme: 'system',
};

function isSettings(value: unknown): value is OneTomatoSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const settings = value as Partial<OneTomatoSettings>;

  return (
    typeof settings.focusDuration === 'number' &&
    typeof settings.shortBreakDuration === 'number' &&
    typeof settings.longBreakDuration === 'number' &&
    typeof settings.longBreakInterval === 'number' &&
    typeof settings.reducedMotion === 'boolean' &&
    (settings.theme === 'system' || settings.theme === 'light' || settings.theme === 'dark')
  );
}

export const settingsStorage = {
  async loadSettings(): Promise<OneTomatoSettings> {
    return (await readJson(STORAGE_KEYS.settings, isSettings)) ?? defaultSettings;
  },

  async saveSettings(settings: OneTomatoSettings): Promise<void> {
    await writeJson(STORAGE_KEYS.settings, settings);
  },
};
