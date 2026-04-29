export function getVisibleBarPercent(
  value: number,
  maxValue: number,
  minimumVisiblePercent = 8
) {
  const safeValue = Math.max(0, Number.isFinite(value) ? value : 0);
  const safeMax = Math.max(0, Number.isFinite(maxValue) ? maxValue : 0);

  if (safeValue === 0 || safeMax === 0) {
    return 0;
  }

  return Math.max(minimumVisiblePercent, (safeValue / safeMax) * 100);
}
