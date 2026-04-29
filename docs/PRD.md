# One Tomato PRD

> 版本：v0.3 当前实现同步版
> 最后更新：2026-04-29

## 一、产品概述

`One Tomato` 是一个温暖、极简、专注优先的 Pomodoro Todo 移动应用。

它不是复杂任务管理器，也不是压力型效率工具。它帮助用户先安排今天，再选定一个当前重点，进入沉浸专注，完成一个番茄后恢复、复盘，再继续下一轮。

核心承诺：

- `One task, one focus, one tomato.`
- `一次只专注一件事，一个番茄完成一个进步。`

主循环：

`计划今日任务 → 选择当前专注 → Start Tomato → Focus → Break → Insights 复盘 → Repeat`

## 二、产品定位

### 解决的问题

许多番茄钟或 Todo 工具存在这些问题：

- 功能层级复杂，用户还没开始专注就先被界面拖慢
- 任务管理过重，更像项目系统而不是日常专注伴侣
- 统计表达带有考核意味，容易制造失败感
- 依赖登录、云端或订阅，不能完全本地与隐私优先

### One Tomato 的价值

- 本地优先：不依赖后端，不要求注册
- 专注优先：首屏先看到 `Today`，而不是参数化计时器
- 温和陪伴：强调节奏与恢复，不用惩罚性语言
- 轻量任务：围绕“今天做什么”和“现在做哪一件”展开
- 习惯建立：通过轻反馈帮助用户形成稳定节奏

## 三、目标用户

- 容易被分心的学生
- 需要深度工作的知识工作者
- 设计师、开发者、写作者、内容创作者
- 被复杂 Todo 工具压垮的用户
- 想要温和型效率工具，而不是严格任务系统的人

## 四、核心体验原则

### 1. Focus First

应用应优先引导用户进入“当前这一件事”的专注状态。

### 2. Reduce Cognitive Load

减少选择、减少解释、减少界面噪音。用户每一步只看到当前最需要的内容。

### 3. Gentle Productivity

暂停、中断、改天再做都不应被描述为失败。

### 4. Rhythm Over Pressure

番茄钟是专注与恢复的节奏系统，不是连续施压工具。

### 5. Mobile First

围绕移动端单列结构设计，保证在手机宽度下清晰、轻快、可单手操作。

## 五、核心屏幕与导航

主要屏幕：

1. Today
2. Focus
3. Break
4. Tasks
5. Insights
6. Settings

主底部导航：

- Today
- Tasks
- Insights

导航规则：

- `Focus` 和 `Break` 是沉浸式流程页面，不属于常驻底部 Tab
- `Settings` 是次级入口，不作为主产品导航的一部分
- Onboarding 目前未实现；首次体验暂由默认教程任务承担

## 六、用户故事

### P0 · Focus-first MVP

```text
US-01: 作为用户，我打开应用时想先看到 Today，而不是 Timer，这样我可以先确认今天最重要的任务。
US-02: 作为用户，我想在 Today 中看到当前优先任务，这样我可以直接决定现在要做什么。
US-03: 作为用户，我想从 Today 点击 Start Tomato，这样我可以快速进入专注。
US-04: 作为用户，我想进入沉浸式 Focus 页面，这样专注时不会被多余信息打断。
US-05: 作为用户，我想暂停和继续 Focus，会话可以被温和地控制。
US-06: 作为用户，我想记录一次中断而不被判定为失败，这样我可以真实了解分心原因。
US-07: 作为用户，我在完成一个 Pomodoro 后应自然进入 Break，这样我能维持专注与恢复的节奏。
US-08: 作为用户，我想快速添加任务并估算所需番茄数，这样我能轻松规划今天。
US-09: 作为用户，我希望数据完全保存在本地，关闭应用后不会丢失。
US-10: 作为用户，我想看到基础 Insights，这样我能温和地复盘今天的专注表现。
```

### P1 · 核心增强

```text
US-11: 作为用户，我希望任务拥有清晰状态，如 backlog、today、active、paused，这样我能区分计划与执行。
US-12: 作为用户，我希望 Insights 能展示中断来源分布，这样我能知道自己常被什么打断。
US-13: 作为用户，我希望看到 planning accuracy，这样我能比较预估与实际的番茄投入。
US-14: 作为用户，我希望知道自己最佳专注时段，这样我能把困难任务安排在更合适的时间。
US-15: 作为用户，我想自定义专注与休息时长，以适配自己的节奏。
```

### P2 · 打磨扩展

```text
US-16: 作为用户，我想使用深色模式，以便在不同环境下舒适使用。
US-17: 作为用户，我想在专注或休息时选择白噪音，以提升沉浸感。
US-18: 作为用户，我想看到更丰富的周/月图表，以便回顾长期节奏。
US-19: 作为用户，我想导出数据，以便做个人备份或进一步分析。
```

### P3 · 未来能力

```text
US-20: 作为用户，我希望多设备之间可以同步数据。
US-21: 作为用户，我希望桌面端有托盘操作入口。
US-22: 作为用户，我希望能用全局快捷键快速开始、暂停或继续专注。
```

## 七、功能优先级

| 优先级 | 范围 | 说明 |
|------|------|------|
| `P0` | Today、Focus、Break、Quick Add、Local Storage、Basic Insights | 形成最小可用闭环 |
| `P1` | Task states、interruption insights、planning accuracy、best focus time、custom durations | 提升计划质量与反馈质量 |
| `P2` | Dark mode、white noise、richer weekly/monthly charts、data export | 提升舒适度与长期复盘能力 |
| `P3` | Cloud sync、desktop tray、global shortcuts | 面向跨设备与桌面强化能力 |

## 八、功能模块

### 1. Today

- 展示问候、今日进度和当前重点任务
- 提供明确的 `Start Tomato` 主操作
- 仅展示最多两个 `Up Next`

### 2. Focus

- 展示当前任务标题与大号倒计时
- 支持暂停、继续、中断记录、保存待后续处理
- 专注完成后引导进入 Break

### 3. Break

- 展示休息计时器与恢复型文案
- 可开始下一轮专注，或回到 Today
- 不展示高压指标

### 4. Tasks

- 支持 Quick Add
- 管理 `Today / Backlog / Completed` 视图
- 每个任务可快速估算番茄数

### 5. Insights

- 展示今日专注时间、完成番茄数、完成任务数、当前节奏
- 展示 weekly rhythm、interruption breakdown、planning accuracy、best focus time
- 使用鼓励式、非评判式反馈语言

### 6. Settings

- 专注时长、短休、长休、长休间隔
- 主题：System / Light / Dark
- 语言：System / English / 中文
- Reduced motion
- 通知开关属于后续扩展，目前未实现

### 7. Localization

- UI 文案支持 English 和中文
- Settings 中支持跟随系统语言
- 用户创建的任务标题和描述不翻译
- 旧语言值 `zh-Hans` 迁移为 `zh-CN`

## 九、数据模型

### TaskState

```typescript
type TaskState =
  | 'backlog'
  | 'today'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived';
```

### Task

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

### PomodoroSession

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

### Interruption

```typescript
interface Interruption {
  id: string;
  sessionId: string;
  reason: 'phone' | 'message' | 'people' | 'self_distraction' | 'other';
  createdAt: number;
}
```

### DailyStats

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

### Settings

```typescript
interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  language: 'system' | 'en' | 'zh-CN';
}
```

## 十、非功能需求

| 需求 | 指标 |
|------|------|
| 启动速度 | 冷启动小于 2 秒 |
| 离线能力 | 100% 离线可用 |
| 数据策略 | 默认本地优先，不依赖后端 |
| 隐私 | 不要求账号，不上传个人数据 |
| 可移植性 | 支持 iOS、Android、Web，未来支持桌面封装 |
| 存储占用 | 一年个人数据应保持轻量，适合 AsyncStorage |

## 十一、成功标准

MVP 达标时应满足：

- 用户打开应用先进入 `Today`
- 用户可以快速确定当前专注任务
- 用户可以从 `Today` 顺畅进入 `Focus` 与 `Break`
- 用户可以记录中断而不被惩罚性打断流程
- 用户可以快速添加任务并安排今日计划
- 所有关键数据本地持久化
- 用户能在 `Insights` 中看到基础复盘信息
- 中英文主要 UI 文案完整切换
- 发布前 QA checklist 可逐项核对

## 十二、当前已知下一步

优先处理：

- 后台 / 锁屏计时体验和本地通知
- Today 每日目标算法，避免硬编码目标造成误解
- Insights 指标解释和图表可读性
- 任务编辑、删除、归档恢复
- 集中式数据迁移
