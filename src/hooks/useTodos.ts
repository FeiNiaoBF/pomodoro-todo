import { useState, useCallback, useEffect } from 'react';
import { Task, Priority, TaskStatus } from '../types';
import { TaskStorage } from '../utils/StorageService';

interface UseTodosReturn {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string, priority?: Priority) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  getTotalCompleted: () => number;
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  refreshTasks: () => Promise<void>;
}

/**
 * 任务管理 Hook
 * 提供任务的增删改查及统计功能
 */
export function useTodos(): UseTodosReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化：从存储加载任务
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const savedTasks = await TaskStorage.getTasks();
        setTasks(savedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 刷新任务列表
  const refreshTasks = useCallback(async () => {
    try {
      const savedTasks = await TaskStorage.getTasks();
      setTasks(savedTasks);
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
    }
  }, []);

  // 添加任务
  const addTask = useCallback(
    async (title: string, priority: Priority = 'medium') => {
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title,
        priority,
        status: 'active',
        tags: [],
        estimatedPomodoros: 1,
        actualPomodoros: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await TaskStorage.addTask(newTask);
        setTasks(prev => [...prev, newTask]);
      } catch (error) {
        console.error('Failed to add task:', error);
        throw error;
      }
    },
    []
  );

  // 更新任务
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      await TaskStorage.updateTask(taskId, updates);
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }, []);

  // 删除任务
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await TaskStorage.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }, []);

  // 切换任务状态
  const toggleTaskStatus = useCallback(
    async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newStatus: TaskStatus =
        task.status === 'active' ? 'completed' : 'active';

      await updateTask(taskId, {
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
      });
    },
    [tasks, updateTask]
  );

  // 获取已完成任务数
  const getTotalCompleted = useCallback(() => {
    return tasks.filter(t => t.status === 'completed').length;
  }, [tasks]);

  // 获取活跃任务
  const getActiveTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'active').sort((a, b) => {
      // 按优先级排序：high > medium > low
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks]);

  // 获取已完成任务
  const getCompletedTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'completed');
  }, [tasks]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTotalCompleted,
    getActiveTasks,
    getCompletedTasks,
    refreshTasks,
  };
}
