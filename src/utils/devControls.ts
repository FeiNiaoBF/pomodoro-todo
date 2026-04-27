export function shouldShowDevTimerControls(
  value = process.env.EXPO_PUBLIC_SHOW_DEV_TIMER_CONTROLS
) {
  return value === 'true';
}
