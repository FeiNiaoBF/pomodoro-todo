# One Tomato 数据模型

> 当前核心类型、存储键和迁移策略。类型以 `src/types` 与 `src/storage` 中的实现为准。

## 1. TaskState

```typescript
type TaskState =
  | 'backlog'
  | 'today'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived';
```

用户可理解的含义：

- `backlog`：待安排
- `today`：今天
- `active`：当前专注
- `paused`：稍后继续
- `completed`：已完成
- `archived`：已归档

## 2. Task

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

说明：

- `estimatedTomatoes` 是用户对任务大约需要几轮专注的估计。
- `completedTomatoes` 只应在完成一轮 Focus 后增加。
- 用户创建的 `title` 和 `description` 不参与翻译。

## 3. Pomodoro

```typescript
type PomodoroMode =
  | 'idle'
  | 'focus'
  | 'short_break'
  | 'long_break';

type PomodoroStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'interrupted'
  | 'saved_for_later';
```

## 4. PomodoroSession

```typescript
interface PomodoroSession {
  id: string;
  taskId: string;
  mode: 'focus' | 'short_break' | 'long_break';
  plannedDuration: number;
  actualDuration: number;
  status: 'completed' | 'paused' | 'interrupted' | 'saved_for_later' | 'running';
  startedAt: number;
  endedAt?: number;
}
```

统计原则：

- 今日专注时间应来自已记录的 focus session。
- Break 不应计入今日专注时间。
- 未完成、被保存待后续处理的 session 不应被当成完整番茄。

## 5. Interruption

```typescript
type InterruptionReason =
  | 'phone'
  | 'message'
  | 'people'
  | 'self_distraction'
  | 'other';

interface Interruption {
  id: string;
  sessionId: string;
  reason: InterruptionReason;
  createdAt: number;
}
```

中断记录用于 Insights 复盘，不用于惩罚用户或打断主流程。

## 6. Settings

```typescript
type OneTomatoTheme = 'system' | 'light' | 'dark';
type OneTomatoLanguage = 'system' | 'en' | 'zh-CN';

interface OneTomatoSettings {
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakInterval: number;
  reducedMotion: boolean;
  theme: OneTomatoTheme;
  language: OneTomatoLanguage;
}
```

当前设置范围：

| 字段 | 最小值 | 最大值 |
|------|------:|------:|
| `focusDurationMinutes` | 5 | 90 |
| `shortBreakDurationMinutes` | 1 | 30 |
| `longBreakDurationMinutes` | 5 | 60 |
| `longBreakInterval` | 2 | 8 |

## 7. Storage Keys

```typescript
const STORAGE_KEYS = {
  tasks: '@one-tomato/tasks',
  sessions: '@one-tomato/sessions',
  interruptions: '@one-tomato/interruptions',
  settings: '@one-tomato/settings',
  activeTimer: '@one-tomato/active-timer',
  version: '@one-tomato/version',
} as const;
```

## 8. Active Timer

Active timer 快照用于恢复正在进行或暂停中的 Focus / Break。

关键原则：

- running 计时应基于墙钟时间恢复。
- paused 计时应保留暂停时的剩余秒数。
- 重启应用后不应无故重置用户的当前计时。

## 9. 迁移策略

当前迁移重点：

- 旧语言值 `zh-Hans` 迁移到 `zh-CN`。
- 旧 sample sessions / sample tasks 应避免污染用户真实数据。
- 存储版本由 `@one-tomato/version` 记录。

后续建议：

1. 将 Provider 内的历史兼容逻辑逐步集中到 `migrations.ts`。
2. 对每个迁移步骤写独立测试。
3. 迁移时优先保留用户数据。
4. 无法推断的字段使用保守默认值。
5. 迁移不应阻塞应用启动太久。
