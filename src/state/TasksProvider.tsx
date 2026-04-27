import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { initialTasks } from '../data/todaySample';
import { Task, TaskState } from '../types/task';

interface AddTaskInput {
  title: string;
  state?: Extract<TaskState, 'backlog' | 'today'>;
  estimatedTomatoes?: number;
  description?: string;
  project?: string;
  dueDate?: string;
}

interface TasksContextValue {
  tasks: Task[];
  todayTasks: Task[];
  backlogTasks: Task[];
  completedTasks: Task[];
  currentTask: Task | null;
  upNextTasks: Task[];
  nextTaskPreview: Task | null;
  addTask: (input: AddTaskInput) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskToToday: (id: string) => void;
  setCurrentTask: (id: string) => void;
  archiveTask: (id: string) => void;
  completeTask: (id: string) => void;
  incrementCompletedTomatoes: (id: string) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function sortByCreatedAt(tasks: Task[]) {
  return [...tasks].sort((a, b) => a.createdAt - b.createdAt);
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sortByCreatedAt(initialTasks));

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              ...patch,
              updatedAt: Date.now(),
            }
          : task
      )
    );
  }, []);

  const addTask = useCallback((input: AddTaskInput) => {
    const now = Date.now();
    const nextState = input.state ?? 'backlog';

    const nextTask: Task = {
      id: `task-${now}-${Math.random().toString(36).slice(2, 7)}`,
      title: input.title.trim(),
      description: input.description,
      project: input.project,
      estimatedTomatoes: input.estimatedTomatoes ?? 1,
      completedTomatoes: 0,
      state: nextState,
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
    };

    setTasks(prev => [...prev, nextTask]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const moveTaskToToday = useCallback((id: string) => {
    updateTask(id, { state: 'today' });
  }, [updateTask]);

  const setCurrentTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            state: 'active',
            updatedAt: Date.now(),
          };
        }

        if (task.state === 'active') {
          return {
            ...task,
            state: 'today',
            updatedAt: Date.now(),
          };
        }

        return task;
      })
    );
  }, []);

  const archiveTask = useCallback((id: string) => {
    updateTask(id, { state: 'archived' });
  }, [updateTask]);

  const completeTask = useCallback((id: string) => {
    updateTask(id, {
      state: 'completed',
      completedAt: Date.now(),
    });
  }, [updateTask]);

  const incrementCompletedTomatoes = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completedTomatoes: task.completedTomatoes + 1,
              updatedAt: Date.now(),
            }
          : task
      )
    );
  }, []);

  const currentTask = useMemo(() => {
    return (
      tasks.find(task => task.state === 'active') ??
      tasks.find(task => task.state === 'paused') ??
      tasks.find(task => task.state === 'today') ??
      null
    );
  }, [tasks]);

  const todayTasks = useMemo(() => {
    return sortByCreatedAt(
      tasks.filter(task =>
        task.state === 'today' ||
        task.state === 'active' ||
        task.state === 'paused'
      )
    );
  }, [tasks]);

  const backlogTasks = useMemo(() => {
    return sortByCreatedAt(tasks.filter(task => task.state === 'backlog'));
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return sortByCreatedAt(tasks.filter(task => task.state === 'completed'));
  }, [tasks]);

  const upNextTasks = useMemo(() => {
    if (!currentTask) {
      return todayTasks;
    }

    return todayTasks.filter(task => task.id !== currentTask.id);
  }, [currentTask, todayTasks]);

  const nextTaskPreview = upNextTasks[0] ?? null;

  const value = useMemo<TasksContextValue>(() => ({
    tasks,
    todayTasks,
    backlogTasks,
    completedTasks,
    currentTask,
    upNextTasks,
    nextTaskPreview,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToToday,
    setCurrentTask,
    archiveTask,
    completeTask,
    incrementCompletedTomatoes,
  }), [
    addTask,
    archiveTask,
    backlogTasks,
    completeTask,
    completedTasks,
    currentTask,
    deleteTask,
    incrementCompletedTomatoes,
    moveTaskToToday,
    nextTaskPreview,
    setCurrentTask,
    tasks,
    todayTasks,
    upNextTasks,
    updateTask,
  ]);

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }

  return context;
}
