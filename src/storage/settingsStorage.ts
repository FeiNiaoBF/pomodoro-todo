import { readJson, writeJson } from './storageClient';
import { STORAGE_KEYS } from './storageKeys';

export type OneTomatoTheme = 'system' | 'light' | 'dark';
export type OneTomatoLanguage = 'system' | 'en' | 'zh-Hans';

export interface OneTomatoSettings {
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakInterval: number;
  reducedMotion: boolean;
  theme: OneTomatoTheme;
  language: OneTomatoLanguage;
}

export const defaultSettings: OneTomatoSettings = {
  focusDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  longBreakInterval: 4,
  reducedMotion: false,
  theme: 'system',
  language: 'system',
};

export const settingsLimits = {
  focusDurationMinutes: { min: 5, max: 90 },
  shortBreakDurationMinutes: { min: 1, max: 30 },
  longBreakDurationMinutes: { min: 5, max: 60 },
  longBreakInterval: { min: 2, max: 8 },
} as const;

export function clampSettingValue<Key extends keyof typeof settingsLimits>(
  key: Key,
  value: number
) {
  const limit = settingsLimits[key];

  return Math.min(limit.max, Math.max(limit.min, value));
}

function isSettings(value: unknown): value is OneTomatoSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const settings = value as Partial<OneTomatoSettings>;

  return (
    typeof settings.focusDurationMinutes === 'number' &&
    settings.focusDurationMinutes >= settingsLimits.focusDurationMinutes.min &&
    settings.focusDurationMinutes <= settingsLimits.focusDurationMinutes.max &&
    typeof settings.shortBreakDurationMinutes === 'number' &&
    settings.shortBreakDurationMinutes >= settingsLimits.shortBreakDurationMinutes.min &&
    settings.shortBreakDurationMinutes <= settingsLimits.shortBreakDurationMinutes.max &&
    typeof settings.longBreakDurationMinutes === 'number' &&
    settings.longBreakDurationMinutes >= settingsLimits.longBreakDurationMinutes.min &&
    settings.longBreakDurationMinutes <= settingsLimits.longBreakDurationMinutes.max &&
    typeof settings.longBreakInterval === 'number' &&
    settings.longBreakInterval >= settingsLimits.longBreakInterval.min &&
    settings.longBreakInterval <= settingsLimits.longBreakInterval.max &&
    typeof settings.reducedMotion === 'boolean' &&
    (settings.theme === 'system' || settings.theme === 'light' || settings.theme === 'dark') &&
    (
      settings.language === undefined ||
      settings.language === 'system' ||
      settings.language === 'en' ||
      settings.language === 'zh-Hans'
    )
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
