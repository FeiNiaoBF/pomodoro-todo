import { AppLanguage, translate, TranslationKey } from '../i18n/translations';
import { Task } from '../types/task';

const TUTORIAL_TASK_COPY: Partial<Record<string, {
  title: TranslationKey;
  description: TranslationKey;
}>> = {
  'task-current': {
    title: 'tutorial.firstTomato.title',
    description: 'tutorial.firstTomato.description',
  },
  'task-emails': {
    title: 'tutorial.addTask.title',
    description: 'tutorial.addTask.description',
  },
  'task-retro': {
    title: 'tutorial.insights.title',
    description: 'tutorial.insights.description',
  },
};

export function getTaskDisplayTitle(task: Task, language: AppLanguage) {
  const tutorialCopy = TUTORIAL_TASK_COPY[task.id];

  return tutorialCopy ? translate(language, tutorialCopy.title) : task.title;
}

export function getTaskDisplayDescription(task: Task, language: AppLanguage) {
  const tutorialCopy = TUTORIAL_TASK_COPY[task.id];

  if (tutorialCopy) {
    return translate(language, tutorialCopy.description);
  }

  return task.description ?? '';
}
