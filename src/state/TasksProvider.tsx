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
import { initialTasks, normalizeSeedTasks } from '../data/todaySample';
import { runStorageMigrations } from '../storage/migrations';
import { tasksStorage } from '../storage/tasksStorage';
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
  archivedTasks: Task[];
  currentTask: Task | null;
  upNextTasks: Task[];
  nextTaskPreview: Task | null;
  isHydrated: boolean;
  addTask: (input: AddTaskInput) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskToToday: (id: string) => void;
  moveTaskToBacklog: (id: string) => void;
  reorderTodayTask: (id: string, direction: 'up' | 'down') => void;
  setCurrentTask: (id: string) => void;
  archiveTask: (id: string) => void;
  completeTask: (id: string) => void;
  incrementCompletedTomatoes: (id: string) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function getTaskSortOrder(task: Task) {
  return task.sortOrder ?? task.createdAt;
}

function sortByPlanOrder(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    const orderDiff = getTaskSortOrder(a) - getTaskSortOrder(b);

    return orderDiff !== 0 ? orderDiff : a.createdAt - b.createdAt;
  });
}

function isTodayPlanTask(task: Task) {
  return task.state === 'today' || task.state === 'active' || task.state === 'paused';
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sortByPlanOrder(initialTasks));
  const [isHydrated, setIsHydrated] = useState(false);
  const hydrationCompleteRef = useRef(false);
  const changedBeforeHydrationRef = useRef(false);
  const skippedInitialPersistRef = useRef(false);

  const markTaskMutation = useCallback(() => {
    if (!hydrationCompleteRef.current) {
      changedBeforeHydrationRef.current = true;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function hydrateTasks() {
      await runStorageMigrations();
      const storedTasks = await tasksStorage.loadTasks();

      if (!isMounted) {
        return;
      }

      if (storedTasks && !changedBeforeHydrationRef.current) {
        const normalized = normalizeSeedTasks(storedTasks);
        setTasks(sortByPlanOrder(normalized.tasks));

        if (normalized.changed) {
          tasksStorage.saveTasks(normalized.tasks);
        }
      }

      hydrationCompleteRef.current = true;
      setIsHydrated(true);
    }

    hydrateTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!skippedInitialPersistRef.current) {
      skippedInitialPersistRef.current = true;

      if (!changedBeforeHydrationRef.current) {
        return;
      }
    }

    tasksStorage.saveTasks(tasks);
  }, [isHydrated, tasks]);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    markTaskMutation();
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
  }, [markTaskMutation]);

  const addTask = useCallback((input: AddTaskInput) => {
    markTaskMutation();
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
      sortOrder: now,
    };

    setTasks(prev => [...prev, nextTask]);
  }, [markTaskMutation]);

  const deleteTask = useCallback((id: string) => {
    markTaskMutation();
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [markTaskMutation]);

  const moveTaskToToday = useCallback((id: string) => {
    markTaskMutation();
    setTasks(prev => {
      const lastTodayOrder = Math.max(
        0,
        ...prev.filter(isTodayPlanTask).map(getTaskSortOrder)
      );

      return prev.map(task =>
        task.id === id
          ? {
              ...task,
              state: 'today',
              sortOrder: lastTodayOrder + 1,
              updatedAt: Date.now(),
            }
          : task
      );
    });
  }, [markTaskMutation]);

  const moveTaskToBacklog = useCallback((id: string) => {
    updateTask(id, { state: 'backlog' });
  }, [updateTask]);

  const reorderTodayTask = useCallback((id: string, direction: 'up' | 'down') => {
    markTaskMutation();
    setTasks(prev => {
      const orderedTodayTasks = sortByPlanOrder(prev.filter(isTodayPlanTask));
      const currentIndex = orderedTodayTasks.findIndex(task => task.id === id);

      if (currentIndex < 0) {
        return prev;
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const currentTask = orderedTodayTasks[currentIndex];
      const targetTask = orderedTodayTasks[targetIndex];

      if (!targetTask) {
        return prev;
      }

      const currentOrder = getTaskSortOrder(currentTask);
      const targetOrder = getTaskSortOrder(targetTask);
      const now = Date.now();

      return prev.map(task => {
        if (task.id === currentTask.id) {
          return {
            ...task,
            sortOrder: targetOrder,
            updatedAt: now,
          };
        }

        if (task.id === targetTask.id) {
          return {
            ...task,
            sortOrder: currentOrder,
            updatedAt: now,
          };
        }

        return task;
      });
    });
  }, [markTaskMutation]);

  const setCurrentTask = useCallback((id: string) => {
    markTaskMutation();
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
  }, [markTaskMutation]);

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
    markTaskMutation();
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
  }, [markTaskMutation]);

  const currentTask = useMemo(() => {
    return (
      sortByPlanOrder(tasks).find(task => task.state === 'active') ??
      sortByPlanOrder(tasks).find(task => task.state === 'paused') ??
      sortByPlanOrder(tasks).find(task => task.state === 'today') ??
      null
    );
  }, [tasks]);

  const todayTasks = useMemo(() => {
    return sortByPlanOrder(tasks.filter(isTodayPlanTask));
  }, [tasks]);

  const backlogTasks = useMemo(() => {
    return sortByPlanOrder(tasks.filter(task => task.state === 'backlog'));
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return sortByPlanOrder(tasks.filter(task => task.state === 'completed'));
  }, [tasks]);

  const archivedTasks = useMemo(() => {
    return sortByPlanOrder(tasks.filter(task => task.state === 'archived'));
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
    archivedTasks,
    currentTask,
    upNextTasks,
    nextTaskPreview,
    isHydrated,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToToday,
    moveTaskToBacklog,
    reorderTodayTask,
    setCurrentTask,
    archiveTask,
    completeTask,
    incrementCompletedTomatoes,
  }), [
    addTask,
    archiveTask,
    archivedTasks,
    backlogTasks,
    completeTask,
    completedTasks,
    currentTask,
    deleteTask,
    incrementCompletedTomatoes,
    isHydrated,
    moveTaskToBacklog,
    moveTaskToToday,
    nextTaskPreview,
    reorderTodayTask,
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
