import { usePomodoroContext } from '../state/PomodoroProvider';

export function usePomodoro() {
  return usePomodoroContext();
}
