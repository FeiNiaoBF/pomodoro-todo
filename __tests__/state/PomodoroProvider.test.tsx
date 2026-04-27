import React, { ReactNode } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react-native';
import { usePomodoro } from '../../src/hooks/usePomodoro';
import { useTasks } from '../../src/hooks/useTasks';
import { PomodoroProvider } from '../../src/state/PomodoroProvider';
import { TasksProvider } from '../../src/state/TasksProvider';

const FOCUS_DURATION_SECONDS = 25 * 60;
const SHORT_BREAK_DURATION_SECONDS = 5 * 60;

function wrapper({ children }: { children: ReactNode }) {
  return (
    <TasksProvider>
      <PomodoroProvider>{children}</PomodoroProvider>
    </TasksProvider>
  );
}

function useProviderState() {
  return {
    pomodoro: usePomodoro(),
    tasks: useTasks(),
  };
}

describe('PomodoroProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('startTomato creates a running focus session', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask;

    expect(task).not.toBeNull();

    act(() => {
      result.current.pomodoro.startTomato(task!);
    });

    expect(result.current.pomodoro.activeSession).toMatchObject({
      taskId: task!.id,
      mode: 'focus',
      plannedDuration: FOCUS_DURATION_SECONDS,
      actualDuration: 0,
      status: 'running',
    });
    expect(result.current.pomodoro.currentMode).toBe('focus');
    expect(result.current.pomodoro.status).toBe('running');
    expect(result.current.pomodoro.remainingSeconds).toBe(FOCUS_DURATION_SECONDS);
  });

  it('pause and resume update session status', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.pause();
    });

    expect(result.current.pomodoro.status).toBe('paused');
    expect(result.current.pomodoro.activeSession?.status).toBe('paused');

    act(() => {
      result.current.pomodoro.resume();
    });

    expect(result.current.pomodoro.status).toBe('running');
    expect(result.current.pomodoro.activeSession?.status).toBe('running');
  });

  it('completeFocus stores a completed focus session, increments tomatoes, and prepares break state', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask!;
    const initialSessionCount = result.current.pomodoro.completedSessions.length;
    const initialTomatoes = task.completedTomatoes;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.completeFocus();
    });

    const completedFocusSession = result.current.pomodoro.completedSessions.at(-1);
    const updatedTask = result.current.tasks.tasks.find(item => item.id === task.id);

    expect(result.current.pomodoro.completedSessions).toHaveLength(initialSessionCount + 1);
    expect(completedFocusSession).toMatchObject({
      taskId: task.id,
      mode: 'focus',
      status: 'completed',
    });
    expect(updatedTask?.completedTomatoes).toBe(initialTomatoes + 1);
    expect(result.current.pomodoro.currentMode).toBe('short_break');
    expect(result.current.pomodoro.status).toBe('running');
    expect(result.current.pomodoro.remainingSeconds).toBe(SHORT_BREAK_DURATION_SECONDS);
    expect(result.current.pomodoro.activeSession?.mode).toBe('short_break');
  });

  it('saveForLater saves the active session and pauses the task', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.saveForLater();
    });

    const updatedTask = result.current.tasks.tasks.find(item => item.id === task.id);

    expect(result.current.pomodoro.currentMode).toBe('idle');
    expect(result.current.pomodoro.status).toBe('saved_for_later');
    expect(result.current.pomodoro.remainingSeconds).toBe(FOCUS_DURATION_SECONDS);
    expect(result.current.pomodoro.activeSession?.status).toBe('saved_for_later');
    expect(updatedTask?.state).toBe('paused');
  });

  it('logInterruption adds an interruption without clearing session progress state', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask!;
    const initialFocusSessionIndex = result.current.pomodoro.focusSessionIndex;
    const initialCompletedSessionCount = result.current.pomodoro.completedSessions.length;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.logInterruption('phone');
    });

    expect(result.current.pomodoro.interruptions).toHaveLength(1);
    expect(result.current.pomodoro.interruptions[0]).toMatchObject({
      sessionId: result.current.pomodoro.activeSession?.id,
      reason: 'phone',
    });
    expect(result.current.pomodoro.status).toBe('interrupted');
    expect(result.current.pomodoro.activeSession?.status).toBe('interrupted');
    expect(result.current.pomodoro.focusSessionIndex).toBe(initialFocusSessionIndex);
    expect(result.current.pomodoro.completedSessions).toHaveLength(initialCompletedSessionCount);
  });

  it('startNextTomato starts another focus session after a completed focus', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask!;
    const initialFocusSessionIndex = result.current.pomodoro.focusSessionIndex;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.completeFocus();
    });

    act(() => {
      result.current.pomodoro.startNextTomato();
    });

    expect(result.current.pomodoro.currentMode).toBe('focus');
    expect(result.current.pomodoro.status).toBe('running');
    expect(result.current.pomodoro.activeSession?.mode).toBe('focus');
    expect(result.current.pomodoro.focusSessionIndex).toBe(initialFocusSessionIndex + 1);
    expect(result.current.tasks.currentTask?.id).toBe('task-emails');
  });

  it('completeBreak stores a completed break session', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask!;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.completeFocus();
    });

    const sessionCountBeforeBreakCompletion = result.current.pomodoro.completedSessions.length;

    act(() => {
      result.current.pomodoro.completeBreak();
    });

    const completedBreakSession = result.current.pomodoro.completedSessions.at(-1);

    expect(result.current.pomodoro.completedSessions).toHaveLength(
      sessionCountBeforeBreakCompletion + 1
    );
    expect(completedBreakSession).toMatchObject({
      mode: 'short_break',
      status: 'completed',
    });
    expect(result.current.pomodoro.status).toBe('completed');
    expect(result.current.pomodoro.activeSession?.status).toBe('completed');
  });

  it('supports the core start focus, complete focus, break, next focus integration flow', () => {
    const { result } = renderHook(() => useProviderState(), { wrapper });
    const task = result.current.tasks.currentTask!;
    const initialTomatoes = task.completedTomatoes;

    act(() => {
      result.current.pomodoro.startTomato(task);
    });

    act(() => {
      result.current.pomodoro.completeFocus();
    });

    expect(result.current.tasks.tasks.find(item => item.id === task.id)?.completedTomatoes)
      .toBe(initialTomatoes + 1);
    expect(result.current.pomodoro.currentMode).toBe('short_break');
    expect(result.current.pomodoro.activeSession?.mode).toBe('short_break');

    act(() => {
      result.current.pomodoro.startNextTomato();
    });

    expect(result.current.pomodoro.currentMode).toBe('focus');
    expect(result.current.pomodoro.status).toBe('running');
    expect(result.current.pomodoro.activeSession?.mode).toBe('focus');
  });
});
