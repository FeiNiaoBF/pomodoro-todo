import { Interruption, InterruptionReason, PomodoroSession } from '../types/pomodoro';
import { readJson, writeJson } from './storageClient';
import { STORAGE_KEYS } from './storageKeys';

const SESSION_MODES: PomodoroSession['mode'][] = ['focus', 'short_break', 'long_break'];
const SESSION_STATUSES: PomodoroSession['status'][] = [
  'completed',
  'paused',
  'interrupted',
  'saved_for_later',
  'running',
];
const INTERRUPTION_REASONS: InterruptionReason[] = [
  'phone',
  'message',
  'people',
  'self_distraction',
  'other',
];

function isPomodoroSession(value: unknown): value is PomodoroSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Partial<PomodoroSession>;

  return (
    typeof session.id === 'string' &&
    typeof session.taskId === 'string' &&
    typeof session.mode === 'string' &&
    SESSION_MODES.includes(session.mode as PomodoroSession['mode']) &&
    typeof session.plannedDuration === 'number' &&
    typeof session.actualDuration === 'number' &&
    typeof session.status === 'string' &&
    SESSION_STATUSES.includes(session.status as PomodoroSession['status']) &&
    typeof session.startedAt === 'number'
  );
}

function isInterruption(value: unknown): value is Interruption {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const interruption = value as Partial<Interruption>;

  return (
    typeof interruption.id === 'string' &&
    typeof interruption.sessionId === 'string' &&
    typeof interruption.reason === 'string' &&
    INTERRUPTION_REASONS.includes(interruption.reason as InterruptionReason) &&
    typeof interruption.createdAt === 'number'
  );
}

function isSessionArray(value: unknown): value is PomodoroSession[] {
  return Array.isArray(value) && value.every(isPomodoroSession);
}

function isInterruptionArray(value: unknown): value is Interruption[] {
  return Array.isArray(value) && value.every(isInterruption);
}

export const pomodoroStorage = {
  async loadCompletedSessions(): Promise<PomodoroSession[] | null> {
    return readJson(STORAGE_KEYS.sessions, isSessionArray);
  },

  async saveCompletedSessions(sessions: PomodoroSession[]): Promise<void> {
    await writeJson(STORAGE_KEYS.sessions, sessions);
  },

  async loadInterruptions(): Promise<Interruption[] | null> {
    return readJson(STORAGE_KEYS.interruptions, isInterruptionArray);
  },

  async saveInterruptions(interruptions: Interruption[]): Promise<void> {
    await writeJson(STORAGE_KEYS.interruptions, interruptions);
  },
};
