import { OneTomatoLanguage } from '../storage/settingsStorage';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

export type AppLanguage = 'en' | 'zh-CN';

export type TranslationKey = keyof typeof en;

type LocaleKeyDifference =
  | Exclude<TranslationKey, keyof typeof zhCN>
  | Exclude<keyof typeof zhCN, TranslationKey>;

const localeKeyCheck: Record<LocaleKeyDifference, never> = {};
void localeKeyCheck;

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en,
  'zh-CN': zhCN,
};

function getDeviceLanguage(): AppLanguage {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;

    return locale.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
  } catch {
    return 'en';
  }
}

export function resolveLanguage(language: OneTomatoLanguage): AppLanguage {
  return language === 'system' ? getDeviceLanguage() : language;
}

export function translate(
  language: AppLanguage,
  key: TranslationKey,
  replacements: Record<string, string | number> = {}
) {
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    translations[language][key]
  );
}
