import { useMemo } from 'react';
import { useSettings } from './useSettings';
import { resolveLanguage, translate, TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const { settings } = useSettings();
  const language = resolveLanguage(settings.language);

  return useMemo(() => ({
    language,
    t: (key: TranslationKey, replacements?: Record<string, string | number>) =>
      translate(language, key, replacements),
  }), [language]);
}
