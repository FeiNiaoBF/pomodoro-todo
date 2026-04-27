import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveTimerSnapshot } from '../types/activeTimer';
import { PomodoroMode } from '../types/pomodoro';
import { removeStorageItem, writeJson } from './storageClient';
import { STORAGE_KEYS } from './storageKeys';

const ACTIVE_TIMER_MODES: Array<Exclude<PomodoroMode, 'idle'>> = [
  'focus',
  'short_break',
  'long_break',
];
const ACTIVE_TIMER_STATUSES: ActiveTimerSnapshot['status'][] = [
  'running',
  'paused',
  'interrupted',
  'saved_for_later',
];

function isActiveTimerSnapshot(value: unknown): value is ActiveTimerSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Partial<ActiveTimerSnapshot>;

  return (
    typeof snapshot.sessionId === 'string' &&
    (typeof snapshot.taskId === 'undefined' || typeof snapshot.taskId === 'string') &&
    typeof snapshot.mode === 'string' &&
    ACTIVE_TIMER_MODES.includes(snapshot.mode as Exclude<PomodoroMode, 'idle'>) &&
    typeof snapshot.status === 'string' &&
    ACTIVE_TIMER_STATUSES.includes(snapshot.status as ActiveTimerSnapshot['status']) &&
    typeof snapshot.plannedDuration === 'number' &&
    typeof snapshot.remainingSeconds === 'number' &&
    typeof snapshot.startedAt === 'number' &&
    (typeof snapshot.expectedEndAt === 'undefined' || typeof snapshot.expectedEndAt === 'number') &&
    (typeof snapshot.pausedAt === 'undefined' || typeof snapshot.pausedAt === 'number') &&
    typeof snapshot.focusSessionIndex === 'number'
  );
}

export const activeTimerStorage = {
  async loadActiveTimer(): Promise<ActiveTimerSnapshot | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.activeTimer);

      if (raw === null) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);

      if (isActiveTimerSnapshot(parsed)) {
        return parsed;
      }

      await this.clearActiveTimer();
      return null;
    } catch (error) {
      console.warn(`Failed to read ${STORAGE_KEYS.activeTimer} from storage`, error);
      await this.clearActiveTimer();
      return null;
    }
  },

  async saveActiveTimer(snapshot: ActiveTimerSnapshot): Promise<void> {
    await writeJson(STORAGE_KEYS.activeTimer, snapshot);
  },

  async clearActiveTimer(): Promise<void> {
    await removeStorageItem(STORAGE_KEYS.activeTimer);
  },
};
