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

export function formatTomatoProgress(completed: number, estimated: number) {
  const safeCompleted = toSafeCount(completed);
  const safeEstimated = toSafeCount(estimated);

  if (safeEstimated === 0) {
    return safeCompleted > 0 ? `${safeCompleted} completed` : 'No estimate';
  }

  if (safeCompleted > safeEstimated) {
    return `${safeCompleted} completed · Estimated ${safeEstimated}`;
  }

  return `${safeCompleted}/${safeEstimated} tomatoes`;
}

export function formatDailyGoalProgress(completed: number, goal: number) {
  const safeCompleted = toSafeCount(completed);
  const safeGoal = toSafeCount(goal);
  const clampedCompleted = Math.min(safeCompleted, safeGoal);

  if (safeGoal === 0) {
    return {
      primaryText: `${safeCompleted} completed`,
      secondaryText: 'No daily goal',
      completed: 0,
      total: 0,
    };
  }

  if (safeCompleted > safeGoal) {
    const beyondGoal = safeCompleted - safeGoal;

    return {
      primaryText: `${safeCompleted} completed`,
      secondaryText: `Goal ${safeGoal} · ${beyondGoal} beyond goal`,
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
