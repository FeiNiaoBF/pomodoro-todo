# One Tomato 数据模型

> 统一定义核心类型、存储键名与迁移策略

## 一、TaskState

```typescript
type TaskState =
  | 'backlog'
  | 'today'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived';
```

说明：

- `backlog`：尚未安排到今天
- `today`：已进入今日计划
- `active`：当前专注中的任务
- `paused`：暂时搁置
- `completed`：已完成
- `archived`：归档

## 二、Task

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  project?: string;
  estimatedTomatoes: number;
  completedTomatoes: number;
  state: TaskState;
  dueDate?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}
```

## 三、PomodoroSession

```typescript
interface PomodoroSession {
  id: string;
  taskId?: string;
  mode: 'focus' | 'short_break' | 'long_break';
  plannedDuration: number;
  actualDuration: number;
  status: 'completed' | 'paused' | 'interrupted' | 'saved_for_later';
  startedAt: number;
  endedAt?: number;
}
```

## 四、Interruption

```typescript
interface Interruption {
  id: string;
  sessionId: string;
  reason: 'phone' | 'message' | 'people' | 'self_distraction' | 'other';
  createdAt: number;
}
```

## 五、DailyStats

```typescript
interface DailyStats {
  date: string;
  focusSeconds: number;
  completedTomatoes: number;
  completedTasks: number;
  interruptions: number;
  planningAccuracy: number;
  bestFocusWindow?: string;
}
```

## 六、Settings

```typescript
interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
}
```

## 七、Storage Keys

```typescript
const STORAGE_KEYS = {
  TASKS: '@one-tomato/tasks',
  SESSIONS: '@one-tomato/sessions',
  INTERRUPTIONS: '@one-tomato/interruptions',
  SETTINGS: '@one-tomato/settings',
  VERSION: '@one-tomato/version',
} as const;
```

## 八、迁移策略

### 目标

- 从旧的 `@pomodoro/*` 键名迁移到 `@one-tomato/*`
- 从旧任务布尔完成态迁移到 `TaskState`
- 为会话补齐 `mode`、`status`、`actualDuration` 等字段

### 建议步骤

1. 读取旧 `@pomodoro/version`
2. 检查旧数据是否存在
3. 若存在旧任务：
   - `completed: true` → `state: 'completed'`
   - `completed: false` → 默认映射为 `backlog`
4. 若存在旧会话：
   - `type: 'focus' | 'shortBreak' | 'longBreak'`
   - 转换为 `mode: 'focus' | 'short_break' | 'long_break'`
5. 将迁移后的数据写入 `@one-tomato/*`
6. 更新版本号

### 迁移原则

- 优先保留用户已有数据
- 对无法精确推断的字段使用保守默认值
- 迁移过程不可阻塞应用启动太久
