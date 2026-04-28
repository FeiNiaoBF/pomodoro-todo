import { TranslationKey, AppLanguage, translate } from '../i18n/translations';
import { TaskState } from '../types/task';

const TASK_STATE_LABEL_KEYS: Record<TaskState, TranslationKey> = {
  active: 'task.currentFocus',
  paused: 'task.savedForLater',
  today: 'task.today',
  backlog: 'task.savedForLater',
  completed: 'task.done',
  archived: 'task.savedForLater',
};

export function getTaskStateLabel(state: TaskState, language: AppLanguage = 'en') {
  return translate(language, TASK_STATE_LABEL_KEYS[state]);
}

export function isShortTaskTitle(title: string) {
  const trimmedTitle = title.trim();

  return trimmedTitle.length < 3 || /^\d+$/.test(trimmedTitle);
}
