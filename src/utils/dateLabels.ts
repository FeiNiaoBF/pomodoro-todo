import { AppLanguage, translate } from '../i18n/translations';

export function getTimeOfDayGreeting(date = new Date(), language: AppLanguage = 'en') {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return translate(language, 'greeting.morning');
  }

  if (hour >= 12 && hour < 18) {
    return translate(language, 'greeting.afternoon');
  }

  return translate(language, 'greeting.evening');
}

function getResolvedLocale() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return 'en';
  }
}

export function getWeekdayLabel(date: Date, locale = getResolvedLocale()) {
  const dayIndex = date.getDay();

  if (locale.toLowerCase().startsWith('zh')) {
    return ['日', '一', '二', '三', '四', '五', '六'][dayIndex];
  }

  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayIndex];
}
