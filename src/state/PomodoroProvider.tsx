import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

function createSession(taskId: string, mode: 'focus' | 'short_break' | 'long_break', plannedDuration: number): PomodoroSession {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    taskId,
    mode,
    plannedDuration,
    actualDuration: 0,
    status: 'running',
    startedAt: Date.now(),
  };
}

function finalizeSession(
  session: PomodoroSession,
  status: PomodoroSession['status'],
  remainingSeconds: number
): PomodoroSession {
  return {
    ...session,
    status,
    actualDuration: Math.max(0, session.plannedDuration - remainingSeconds),
    endedAt: Date.now(),
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
  } = useTasks();
  const [activeSession, setActiveSession] = useState<PomodoroSession | null>(null);
  const [currentMode, setCurrentMode] = useState<PomodoroStateSnapshot['currentMode']>('idle');
  const [status, setStatus] = useState<PomodoroStatus>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(FOCUS_DURATION_SECONDS);
  const [completedSessions, setCompletedSessions] = useState<PomodoroSession[]>(sampleCompletedSessions);
  const [interruptions, setInterruptions] = useState<Interruption[]>([]);
  const [focusSessionIndex, setFocusSessionIndex] = useState(2);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    if (currentMode === 'idle') {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMode, status]);

  const startTomato = useCallback((task: Task) => {
    setCurrentTask(task.id);
    setActiveSession(createSession(task.id, 'focus', FOCUS_DURATION_SECONDS));
    setCurrentMode('focus');
    setRemainingSeconds(FOCUS_DURATION_SECONDS);
    setStatus('running');
  }, [setCurrentTask]);

  const pause = useCallback(() => {
    if (status !== 'running') {
      return;
    }

    setStatus('paused');
    setActiveSession(prev =>
      prev ? { ...prev, status: 'paused' } : prev
    );
  }, [status]);

  const resume = useCallback(() => {
    if (status !== 'paused' && status !== 'interrupted') {
      return;
    }

    setStatus('running');
    setActiveSession(prev =>
      prev ? { ...prev, status: 'running' } : prev
    );
  }, [status]);

  const startBreak = useCallback(() => {
    const breakTaskId = currentTask?.id ?? 'break-session';
    setActiveSession(createSession(breakTaskId, 'short_break', SHORT_BREAK_DURATION_SECONDS));
    setCurrentMode('short_break');
    setRemainingSeconds(SHORT_BREAK_DURATION_SECONDS);
    setStatus('running');
  }, [currentTask]);

  const completeFocus = useCallback(() => {
    if (!activeSession || currentMode !== 'focus' || !currentTask) {
      return;
    }

    const completedSession = finalizeSession(activeSession, 'completed', remainingSeconds);

    setCompletedSessions(prev => [...prev, completedSession]);
    incrementCompletedTomatoes(currentTask.id);
    setActiveSession(null);
    setStatus('completed');
    startBreak();
  }, [activeSession, currentMode, currentTask, incrementCompletedTomatoes, remainingSeconds, startBreak]);

  const completeBreak = useCallback(() => {
    if (
      !activeSession ||
      status === 'completed' ||
      (currentMode !== 'short_break' && currentMode !== 'long_break')
    ) {
      return;
    }

    const completedSession = finalizeSession(activeSession, 'completed', remainingSeconds);

    setCompletedSessions(prev => [...prev, completedSession]);
    setActiveSession(completedSession);
    setStatus('completed');
  }, [activeSession, currentMode, remainingSeconds, status]);

  const startNextTomato = useCallback(() => {
    const shouldSwitchTask =
      !currentTask ||
      currentTask.completedTomatoes >= currentTask.estimatedTomatoes;

    const taskToStart = shouldSwitchTask ? nextTaskPreview ?? currentTask ?? currentFocusTask : currentTask;

    if (!taskToStart) {
      return;
    }

    setFocusSessionIndex(prev => prev + 1);
    startTomato(taskToStart);
  }, [currentTask, nextTaskPreview, startTomato]);

  const saveForLater = useCallback(() => {
    if (activeSession) {
      const savedSession = finalizeSession(activeSession, 'saved_for_later', remainingSeconds);
      setActiveSession(savedSession);
    }

    setCurrentMode('idle');
    setStatus('saved_for_later');
    setRemainingSeconds(FOCUS_DURATION_SECONDS);
    if (currentTask) {
      updateTask(currentTask.id, { state: 'paused' });
    }
  }, [activeSession, currentTask, remainingSeconds, updateTask]);

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

    setInterruptions(prev => [...prev, interruption]);
    setStatus('interrupted');
    setActiveSession(prev =>
      prev ? { ...prev, status: 'interrupted' } : prev
    );
  }, [activeSession]);

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
