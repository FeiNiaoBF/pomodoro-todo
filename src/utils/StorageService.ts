import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, PomodoroSession, TimerConfig, DEFAULT_TIMER_CONFIG } from '../types';

const STORAGE_KEYS = {
  TASKS: '@pomodoro/tasks',
  SESSIONS: '@pomodoro/sessions',
  SETTINGS: '@pomodoro/settings',
  VERSION: '@pomodoro/version',
} as const;

const CURRENT_VERSION = '1.0.0';

/**
 * 核心存储服务 - 封装 AsyncStorage 所有操作
 * 提供类型安全和错误处理
 */

// ============ 任务管理 ============

export const TaskStorage = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
      throw error;
    }
  },

  async addTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.saveTasks(tasks);
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveTasks(tasks);
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    await this.saveTasks(filtered);
  },

  async clearAllTasks(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TASKS);
  },
};

// ============ 番茄会话记录 ============

export const SessionStorage = {
  async getSessions(): Promise<PomodoroSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  },

  async saveSessions(sessions: PomodoroSession[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
      throw error;
    }
  },

  async addSession(session: PomodoroSession): Promise<void> {
    const sessions = await this.getSessions();
    sessions.push(session);
    await this.saveSessions(sessions);
  },

  async getSessionsByDate(date: string): Promise<PomodoroSession[]> {
    const sessions = await this.getSessions();
    return sessions.filter(s => s.startedAt.startsWith(date));
  },

  async getSessionsByTask(taskId: string): Promise<PomodoroSession[]> {
    const sessions = await this.getSessions();
    return sessions.filter(s => s.taskId === taskId);
  },

  async clearAllSessions(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS);
  },
};

// ============ 设置管理 ============

export const SettingsStorage = {
  async getSettings(): Promise<TimerConfig> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_TIMER_CONFIG;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return DEFAULT_TIMER_CONFIG;
    }
  },

  async saveSettings(config: TimerConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  },

  async updateSettings(updates: Partial<TimerConfig>): Promise<void> {
    const current = await this.getSettings();
    const merged = { ...current, ...updates };
    await this.saveSettings(merged);
  },
};

// ============ 版本管理与迁移 ============

export const StorageMigration = {
  async getVersion(): Promise<string> {
    try {
      const version = await AsyncStorage.getItem(STORAGE_KEYS.VERSION);
      return version || '0.0.0';
    } catch {
      return '0.0.0';
    }
  },

  async setVersion(version: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VERSION, version);
    } catch (error) {
      console.error('Failed to set version:', error);
    }
  },

  async migrate(): Promise<void> {
    const storedVersion = await this.getVersion();

    if (storedVersion === CURRENT_VERSION) {
      return;
    }

    // 在此处添加版本迁移逻辑
    // 例如：从 v0.9.x 迁移到 v1.0.0
    if (storedVersion < '1.0.0') {
      // 迁移逻辑...
      console.log('Migrating data from', storedVersion, 'to', CURRENT_VERSION);
    }

    await this.setVersion(CURRENT_VERSION);
  },
};

// ============ 初始化 ============

export const initializeStorage = async (): Promise<void> => {
  try {
    await StorageMigration.migrate();
    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Storage initialization failed:', error);
  }
};
