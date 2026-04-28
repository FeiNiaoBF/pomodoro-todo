import { AppLanguage, translate } from '../i18n/translations';

function toSafeCount(value: number) {
  return Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
}

export function getTomatoDotCounts(completed: number, estimated: number) {
  const safeCompleted = toSafeCount(completed);
  const safeEstimated = toSafeCount(estimated);

  return {
    completed: Math.min(safeCompleted, safeEstimated),
    total: safeEstimated,
  };
}

export function formatTomatoProgress(
  completed: number,
  estimated: number,
  language: AppLanguage = 'en'
) {
  const safeCompleted = toSafeCount(completed);
  const safeEstimated = toSafeCount(estimated);

  if (safeEstimated === 0) {
    return safeCompleted > 0
      ? `${safeCompleted} ${translate(language, 'tomato.completed')}`
      : translate(language, 'tomato.noEstimate');
  }

  if (safeCompleted > safeEstimated) {
    return `${safeCompleted} ${translate(language, 'tomato.completed')} · ${translate(language, 'tomato.estimated')} ${safeEstimated}`;
  }

  return `${safeCompleted}/${safeEstimated} ${translate(language, 'tomato.tomatoes')}`;
}

export function formatDailyGoalProgress(
  completed: number,
  goal: number,
  language: AppLanguage = 'en'
) {
  const safeCompleted = toSafeCount(completed);
  const safeGoal = toSafeCount(goal);
  const clampedCompleted = Math.min(safeCompleted, safeGoal);

  if (safeGoal === 0) {
    return {
      primaryText: `${safeCompleted} ${translate(language, 'tomato.completed')}`,
      secondaryText: translate(language, 'tomato.noEstimate'),
      completed: 0,
      total: 0,
    };
  }

  if (safeCompleted > safeGoal) {
    const beyondGoal = safeCompleted - safeGoal;

    return {
      primaryText: `${safeCompleted} ${translate(language, 'tomato.completed')}`,
      secondaryText: `${translate(language, 'tomato.goal')} ${safeGoal} · ${beyondGoal} ${translate(language, 'tomato.beyondGoal')}`,
      completed: clampedCompleted,
      total: safeGoal,
    };
  }

  return {
    primaryText: `${safeCompleted}/${safeGoal}`,
    secondaryText: undefined,
    completed: clampedCompleted,
    total: safeGoal,
  };
}
