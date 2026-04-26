import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerPhase, TimerStatus, TimerConfig, DEFAULT_TIMER_CONFIG, PomodoroSession } from '../types';
import { SessionStorage } from '../utils/StorageService';

interface UseTimerReturn {
  phase: TimerPhase;
  status: TimerStatus;
  elapsed: number;
  totalSeconds: number;
  progress: number;           // 0~1
  displayTime: string;        // mm:ss
  completedPomodoros: number;
  start: (taskId?: string) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  setConfig: (config: Partial<TimerConfig>) => void;
}

export function useTimer(): UseTimerReturn {
  const [phase, setPhase] = useState<TimerPhase>('focus');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [config, setConfigState] = useState<TimerConfig>(DEFAULT_TIMER_CONFIG);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // 使用 useRef 持久化最新值，避免闭包问题
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const completedRef = useRef(0);
  const phaseRef = useRef<TimerPhase>('focus');
  const startTimeRef = useRef<string | null>(null);
  const currentTaskIdRef = useRef<string | undefined>(undefined);

  const getTotalSeconds = useCallback((p: TimerPhase) => {
    switch (p) {
      case 'focus': return config.focusDuration * 60;
      case 'shortBreak': return config.shortBreakDuration * 60;
      case 'longBreak': return config.longBreakDuration * 60;
    }
  }, [config]);

  const totalSeconds = getTotalSeconds(phase);

  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    clearTick();
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }, [clearTick]);

  const start = useCallback((taskId?: string) => {
    elapsedRef.current = 0;
    setElapsed(0);
    setStatus('running');
    startTimeRef.current = new Date().toISOString();
    currentTaskIdRef.current = taskId;
    startTick();
  }, [startTick]);

  const pause = useCallback(() => {
    if (status === 'running') {
      clearTick();
      setStatus('paused');
    }
  }, [status, clearTick]);

  const resume = useCallback(() => {
    if (status === 'paused') {
      setStatus('running');
      startTick();
    }
  }, [status, startTick]);

  const reset = useCallback(() => {
    clearTick();
    elapsedRef.current = 0;
    setElapsed(0);
    setStatus('idle');
  }, [clearTick]);

  const nextPhase = useCallback(() => {
    completedRef.current += 1;
    setCompletedPomodoros(completedRef.current);

    const newPhase = phaseRef.current === 'focus'
      ? (completedRef.current % config.longBreakInterval === 0 ? 'longBreak' : 'shortBreak')
      : 'focus';

    phaseRef.current = newPhase;
    setPhase(newPhase);
  }, [config.longBreakInterval]);

  const skip = useCallback(() => {
    clearTick();
    elapsedRef.current = 0;
    setElapsed(0);
    setStatus('idle');
    nextPhase();
  }, [clearTick, nextPhase]);

  const setConfig = useCallback((partial: Partial<TimerConfig>) => {
    setConfigState(prev => ({ ...prev, ...partial }));
  }, []);

  // 计时结束自动切换，并保存会话
  useEffect(() => {
    if (status === 'running' && elapsed >= totalSeconds && totalSeconds > 0) {
      clearTick();
      setStatus('idle');
      elapsedRef.current = 0;
      setElapsed(0);

      // 保存本次会话
      const endTime = new Date().toISOString();
      const session: PomodoroSession = {
        id: `session_${Date.now()}`,
        taskId: currentTaskIdRef.current,
        phase: phaseRef.current,
        startedAt: startTimeRef.current || endTime,
        endedAt: endTime,
        durationSeconds: totalSeconds,
        completed: phaseRef.current === 'focus', // 只有 focus 算完成
      };

      // 异步保存，不阻塞 UI
      SessionStorage.addSession(session).catch(err =>
        console.error('Failed to save session:', err)
      );

      // 切换到下一阶段
      nextPhase();
    }
  }, [elapsed, totalSeconds, status, clearTick, nextPhase]);

  // 同步更新 ref 值以避免闭包陷阱
  useEffect(() => {
    completedRef.current = completedPomodoros;
  }, [completedPomodoros]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // 清理
  useEffect(() => {
    return () => clearTick();
  }, [clearTick]);

  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;

  const remaining = Math.max(0, totalSeconds - elapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    phase,
    status,
    elapsed,
    totalSeconds,
    progress,
    displayTime,
    completedPomodoros,
    start,
    pause,
    resume,
    reset,
    skip,
    setConfig,
  };
}
