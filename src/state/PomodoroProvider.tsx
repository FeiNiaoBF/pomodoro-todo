import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Interruption,
  InterruptionReason,
  PomodoroSession,
  PomodoroStateSnapshot,
  PomodoroStatus,
} from '../types/pomodoro';
import { Task } from '../types/task';
import { currentFocusTask, sampleCompletedSessions } from '../data/todaySample';
import { useTasks } from '../hooks/useTasks';
import { activeTimerStorage } from '../storage/activeTimerStorage';
import { runStorageMigrations } from '../storage/migrations';
import { pomodoroStorage } from '../storage/pomodoroStorage';
import { ActiveTimerSnapshot } from '../types/activeTimer';
import {
  createActiveTimerSnapshot,
  finalizeSession,
  getRecoveredRemainingSeconds,
  recoverActiveTimerSnapshot,
} from './pomodoroRecovery';

const FOCUS_DURATION_SECONDS = 25 * 60;
const SHORT_BREAK_DURATION_SECONDS = 5 * 60;
const DAILY_GOAL = 8;

interface PomodoroContextValue extends PomodoroStateSnapshot {
  startTomato: (task: Task) => void;
  pause: () => void;
  resume: () => void;
  completeFocus: () => void;
  startBreak: () => void;
  completeBreak: () => void;
  startNextTomato: () => void;
  saveForLater: () => void;
  logInterruption: (reason: InterruptionReason) => void;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

function createSession(
  taskId: string,
  mode: 'focus' | 'short_break' | 'long_break',
  plannedDuration: number,
  startedAt = Date.now()
): PomodoroSession {
  return {
    id: `session-${startedAt}-${Math.random().toString(36).slice(2, 8)}`,
    taskId,
    mode,
    plannedDuration,
    actualDuration: 0,
    status: 'running',
    startedAt,
  };
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const {
    currentTask,
    upNextTasks,
    nextTaskPreview,
    setCurrentTask,
    incrementCompletedTomatoes,
    updateTask,
    isHydrated: tasksHydrated,
  } = useTasks();
  const [activeSession, setActiveSession] = useState<PomodoroSession | null>(null);
  const [currentMode, setCurrentMode] = useState<PomodoroStateSnapshot['currentMode']>('idle');
  const [status, setStatus] = useState<PomodoroStatus>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(FOCUS_DURATION_SECONDS);
  const [completedSessions, setCompletedSessions] = useState<PomodoroSession[]>(sampleCompletedSessions);
  const [interruptions, setInterruptions] = useState<Interruption[]>([]);
  const [focusSessionIndex, setFocusSessionIndex] = useState(2);
  const [isHydrated, setIsHydrated] = useState(false);
  const hydrationCompleteRef = useRef(false);
  const changedBeforeHydrationRef = useRef(false);
  const skippedInitialSessionPersistRef = useRef(false);
  const skippedInitialInterruptionPersistRef = useRef(false);
  const activeTimerSnapshotRef = useRef<ActiveTimerSnapshot | null>(null);

  const markPomodoroMutation = useCallback(() => {
    if (!hydrationCompleteRef.current) {
      changedBeforeHydrationRef.current = true;
    }
  }, []);

  const persistActiveTimer = useCallback((snapshot: ActiveTimerSnapshot) => {
    activeTimerSnapshotRef.current = snapshot;
    activeTimerStorage.saveActiveTimer(snapshot);
  }, []);

  const clearActiveTimer = useCallback(() => {
    activeTimerSnapshotRef.current = null;
    activeTimerStorage.clearActiveTimer();
  }, []);

  const getCurrentRemainingSeconds = useCallback(() => {
    const snapshot = activeTimerSnapshotRef.current;

    if (snapshot?.status === 'running' && snapshot.expectedEndAt) {
      return getRecoveredRemainingSeconds(snapshot.expectedEndAt);
    }

    return remainingSeconds;
  }, [remainingSeconds]);

  useEffect(() => {
    if (!tasksHydrated || hydrationCompleteRef.current) {
      return;
    }

    let isMounted = true;

    async function hydratePomodoro() {
      await runStorageMigrations();
      const [storedSessions, storedInterruptions, storedActiveTimer] = await Promise.all([
        pomodoroStorage.loadCompletedSessions(),
        pomodoroStorage.loadInterruptions(),
        activeTimerStorage.loadActiveTimer(),
      ]);

      if (!isMounted) {
        return;
      }

      if (!changedBeforeHydrationRef.current) {
        let nextCompletedSessions = storedSessions ?? sampleCompletedSessions;

        if (storedSessions) {
          setCompletedSessions(nextCompletedSessions);
        }

        if (storedInterruptions) {
          setInterruptions(storedInterruptions);
        }

        if (storedActiveTimer) {
          setFocusSessionIndex(storedActiveTimer.focusSessionIndex);

          if (storedActiveTimer.taskId) {
            setCurrentTask(storedActiveTimer.taskId);
          }

          const recovery = recoverActiveTimerSnapshot(
            storedActiveTimer,
            nextCompletedSessions
          );

          if (recovery.kind === 'running') {
            activeTimerSnapshotRef.current = recovery.snapshot;
            setActiveSession(recovery.session);
            setCurrentMode(recovery.snapshot.mode);
            setStatus('running');
            setRemainingSeconds(recovery.remainingSeconds);
          }

          if (recovery.kind === 'paused') {
            activeTimerSnapshotRef.current = recovery.snapshot;
            setActiveSession(recovery.session);
            setCurrentMode(recovery.snapshot.mode);
            setStatus(recovery.snapshot.status);
            setRemainingSeconds(recovery.snapshot.remainingSeconds);
          }

          if (recovery.kind === 'expired_focus') {
            if (!recovery.alreadyCompleted) {
              nextCompletedSessions = [
                ...nextCompletedSessions,
                recovery.completedSession,
              ];
              setCompletedSessions(nextCompletedSessions);
              if (storedActiveTimer.taskId) {
                incrementCompletedTomatoes(storedActiveTimer.taskId);
              }
              pomodoroStorage.saveCompletedSessions(nextCompletedSessions);
            }

            const breakStartedAt = Date.now();
            const breakSession = createSession(
              storedActiveTimer.taskId ?? 'break-session',
              'short_break',
              SHORT_BREAK_DURATION_SECONDS,
              breakStartedAt
            );
            const breakSnapshot = createActiveTimerSnapshot(
              breakSession,
              'running',
              SHORT_BREAK_DURATION_SECONDS,
              storedActiveTimer.focusSessionIndex,
              breakStartedAt
            );

            setActiveSession(breakSession);
            setCurrentMode('short_break');
            setStatus('running');
            setRemainingSeconds(SHORT_BREAK_DURATION_SECONDS);
            persistActiveTimer(breakSnapshot);
          }

          if (recovery.kind === 'expired_break') {
            if (!recovery.alreadyCompleted) {
              nextCompletedSessions = [
                ...nextCompletedSessions,
                recovery.completedSession,
              ];
              setCompletedSessions(nextCompletedSessions);
              pomodoroStorage.saveCompletedSessions(nextCompletedSessions);
            }

            setActiveSession(recovery.completedSession);
            setCurrentMode(storedActiveTimer.mode);
            setStatus('completed');
            setRemainingSeconds(0);
            clearActiveTimer();
          }

          if (recovery.kind === 'clear') {
            clearActiveTimer();
          }
        }
      }

      hydrationCompleteRef.current = true;
      setIsHydrated(true);
    }

    hydratePomodoro();

    return () => {
      isMounted = false;
    };
  }, [
    clearActiveTimer,
    incrementCompletedTomatoes,
    persistActiveTimer,
    setCurrentTask,
    tasksHydrated,
  ]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!skippedInitialSessionPersistRef.current) {
      skippedInitialSessionPersistRef.current = true;

      if (!changedBeforeHydrationRef.current) {
        return;
      }
    }

    pomodoroStorage.saveCompletedSessions(completedSessions);
  }, [completedSessions, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!skippedInitialInterruptionPersistRef.current) {
      skippedInitialInterruptionPersistRef.current = true;

      if (!changedBeforeHydrationRef.current) {
        return;
      }
    }

    pomodoroStorage.saveInterruptions(interruptions);
  }, [interruptions, isHydrated]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    if (currentMode === 'idle') {
      return;
    }

    const interval = setInterval(() => {
      const snapshot = activeTimerSnapshotRef.current;

      if (snapshot?.status === 'running' && snapshot.expectedEndAt) {
        setRemainingSeconds(getRecoveredRemainingSeconds(snapshot.expectedEndAt));
        return;
      }

      setRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMode, status]);

  const startTomato = useCallback((task: Task, sessionIndex = focusSessionIndex) => {
    const startedAt = Date.now();
    const session = createSession(task.id, 'focus', FOCUS_DURATION_SECONDS, startedAt);

    markPomodoroMutation();
    setCurrentTask(task.id);
    setActiveSession(session);
    setCurrentMode('focus');
    setRemainingSeconds(FOCUS_DURATION_SECONDS);
    setStatus('running');
    persistActiveTimer(
      createActiveTimerSnapshot(
        session,
        'running',
        FOCUS_DURATION_SECONDS,
        sessionIndex,
        startedAt
      )
    );
  }, [focusSessionIndex, markPomodoroMutation, persistActiveTimer, setCurrentTask]);

  const pause = useCallback(() => {
    if (status !== 'running') {
      return;
    }

    const currentRemainingSeconds = getCurrentRemainingSeconds();

    markPomodoroMutation();
    setStatus('paused');
    setRemainingSeconds(currentRemainingSeconds);
    setActiveSession(prev =>
      prev ? { ...prev, status: 'paused' } : prev
    );
    if (activeSession) {
      persistActiveTimer(
        createActiveTimerSnapshot(
          activeSession,
          'paused',
          currentRemainingSeconds,
          focusSessionIndex
        )
      );
    }
  }, [activeSession, focusSessionIndex, getCurrentRemainingSeconds, markPomodoroMutation, persistActiveTimer, status]);

  const resume = useCallback(() => {
    if (status !== 'paused' && status !== 'interrupted') {
      return;
    }

    const currentRemainingSeconds = getCurrentRemainingSeconds();

    markPomodoroMutation();
    setStatus('running');
    setActiveSession(prev =>
      prev ? { ...prev, status: 'running' } : prev
    );
    if (activeSession) {
      persistActiveTimer(
        createActiveTimerSnapshot(
          activeSession,
          'running',
          currentRemainingSeconds,
          focusSessionIndex
        )
      );
    }
  }, [activeSession, focusSessionIndex, getCurrentRemainingSeconds, markPomodoroMutation, persistActiveTimer, status]);

  const startBreak = useCallback(() => {
    const startedAt = Date.now();
    markPomodoroMutation();
    const breakTaskId = currentTask?.id ?? 'break-session';
    const session = createSession(
      breakTaskId,
      'short_break',
      SHORT_BREAK_DURATION_SECONDS,
      startedAt
    );

    setActiveSession(session);
    setCurrentMode('short_break');
    setRemainingSeconds(SHORT_BREAK_DURATION_SECONDS);
    setStatus('running');
    persistActiveTimer(
      createActiveTimerSnapshot(
        session,
        'running',
        SHORT_BREAK_DURATION_SECONDS,
        focusSessionIndex,
        startedAt
      )
    );
  }, [currentTask, focusSessionIndex, markPomodoroMutation, persistActiveTimer]);

  const completeFocus = useCallback(() => {
    if (!activeSession || currentMode !== 'focus' || !currentTask) {
      return;
    }

    const currentRemainingSeconds = getCurrentRemainingSeconds();
    const completedSession = finalizeSession(activeSession, 'completed', currentRemainingSeconds);

    markPomodoroMutation();
    setCompletedSessions(prev =>
      prev.some(session => session.id === completedSession.id)
        ? prev
        : [...prev, completedSession]
    );
    incrementCompletedTomatoes(currentTask.id);
    setActiveSession(null);
    setStatus('completed');
    startBreak();
  }, [activeSession, currentMode, currentTask, getCurrentRemainingSeconds, incrementCompletedTomatoes, markPomodoroMutation, startBreak]);

  const completeBreak = useCallback(() => {
    if (
      !activeSession ||
      status === 'completed' ||
      (currentMode !== 'short_break' && currentMode !== 'long_break')
    ) {
      return;
    }

    const currentRemainingSeconds = getCurrentRemainingSeconds();
    const completedSession = finalizeSession(activeSession, 'completed', currentRemainingSeconds);

    markPomodoroMutation();
    setCompletedSessions(prev =>
      prev.some(session => session.id === completedSession.id)
        ? prev
        : [...prev, completedSession]
    );
    setActiveSession(completedSession);
    setStatus('completed');
    setRemainingSeconds(currentRemainingSeconds);
    clearActiveTimer();
  }, [activeSession, clearActiveTimer, currentMode, getCurrentRemainingSeconds, markPomodoroMutation, status]);

  const startNextTomato = useCallback(() => {
    const shouldSwitchTask =
      !currentTask ||
      currentTask.completedTomatoes >= currentTask.estimatedTomatoes;

    const taskToStart = shouldSwitchTask ? nextTaskPreview ?? currentTask ?? currentFocusTask : currentTask;

    if (!taskToStart) {
      return;
    }

    markPomodoroMutation();
    const nextFocusSessionIndex = focusSessionIndex + 1;
    setFocusSessionIndex(nextFocusSessionIndex);
    startTomato(taskToStart, nextFocusSessionIndex);
  }, [currentTask, focusSessionIndex, markPomodoroMutation, nextTaskPreview, startTomato]);

  const saveForLater = useCallback(() => {
    const currentRemainingSeconds = getCurrentRemainingSeconds();

    markPomodoroMutation();
    if (activeSession) {
      const savedSession = finalizeSession(activeSession, 'saved_for_later', currentRemainingSeconds);
      setActiveSession(savedSession);
    }

    setCurrentMode('idle');
    setStatus('saved_for_later');
    setRemainingSeconds(FOCUS_DURATION_SECONDS);
    clearActiveTimer();
    if (currentTask) {
      updateTask(currentTask.id, { state: 'paused' });
    }
  }, [activeSession, clearActiveTimer, currentTask, getCurrentRemainingSeconds, markPomodoroMutation, updateTask]);

  const logInterruption = useCallback((reason: InterruptionReason) => {
    if (!activeSession) {
      return;
    }

    const interruption: Interruption = {
      id: `interrupt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sessionId: activeSession.id,
      reason,
      createdAt: Date.now(),
    };
    const currentRemainingSeconds = getCurrentRemainingSeconds();

    markPomodoroMutation();
    setInterruptions(prev => [...prev, interruption]);
    setRemainingSeconds(currentRemainingSeconds);
    setStatus('interrupted');
    setActiveSession(prev =>
      prev ? { ...prev, status: 'interrupted' } : prev
    );
    persistActiveTimer(
      createActiveTimerSnapshot(
        activeSession,
        'interrupted',
        currentRemainingSeconds,
        focusSessionIndex
      )
    );
  }, [activeSession, focusSessionIndex, getCurrentRemainingSeconds, markPomodoroMutation, persistActiveTimer]);

  const value = useMemo<PomodoroContextValue>(() => ({
    currentTask,
    activeSession,
    currentMode,
    status,
    remainingSeconds,
    completedSessions,
    interruptions,
    focusSessionIndex,
    nextTaskPreview,
    upNextTasks,
    dailyGoal: DAILY_GOAL,
    isHydrated,
    startTomato,
    pause,
    resume,
    completeFocus,
    startBreak,
    completeBreak,
    startNextTomato,
    saveForLater,
    logInterruption,
  }), [
    activeSession,
    completeBreak,
    completeFocus,
    completedSessions,
    currentMode,
    currentTask,
    focusSessionIndex,
    interruptions,
    isHydrated,
    logInterruption,
    nextTaskPreview,
    pause,
    remainingSeconds,
    resume,
    saveForLater,
    startBreak,
    startNextTomato,
    startTomato,
    status,
    upNextTasks,
    setCurrentTask,
    incrementCompletedTomatoes,
    updateTask,
  ]);

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext);

  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }

  return context;
}
