# One Tomato 技术架构

> 文档描述目标产品架构。当前仓库实现仍存在旧命名遗留，代码迁移应在后续实现阶段进行。

## 一、技术决策

### Expo React Native 作为起点

保留现有技术方向：

- 移动端优先，适合 `Today / Focus / Break` 单列体验
- 支持 iOS、Android、Web
- 开发效率高，适合快速迭代 MVP
- 与未来桌面封装路线兼容

### AsyncStorage 作为本地优先存储

- 无需后端和用户账户
- 满足隐私优先策略
- 满足 MVP 阶段任务、会话和设置持久化需求

### Tauri 作为未来桌面包装层

- 当前仍以 Expo 为主应用层
- 桌面版本未来以 Tauri 封装 Web 构建产物为主
- 后续补足托盘与全局快捷键能力

## 二、整体分层

```text
Presentation Layer
  TodayScreen / FocusScreen / BreakScreen / TasksScreen / InsightsScreen / SettingsScreen
  NavigationContainer + Bottom Tabs + Stack / Modal

Logic Layer
  usePomodoro / useTasks / useTodayFocus / useInsights / useSettings / useInterruptionLog
  Session orchestration + task selection + insight aggregation

Data Layer
  AsyncStorage adapters
  Task / Session / Interruption / Settings models
  Versioned migration strategy
```

## 三、组件树

```text
App
├── NavigationContainer
│   ├── BottomTabNavigator
│   │   ├── TodayTab
│   │   │   └── TodayScreen
│   │   │       ├── TodayHeader
│   │   │       ├── DailyProgress
│   │   │       ├── CurrentTaskCard
│   │   │       ├── StartTomatoButton
│   │   │       └── UpNextList
│   │   ├── TasksTab
│   │   │   └── TasksScreen
│   │   │       ├── QuickAddInput
│   │   │       ├── TaskTabs
│   │   │       └── TaskList
│   │   └── InsightsTab
│   │       └── InsightsScreen
│   │           ├── TodaySummary
│   │           ├── WeeklyRhythm
│   │           ├── PlanningAccuracy
│   │           └── InterruptionBreakdown
│   └── Stack / Modal Screens
│       ├── FocusScreen
│       │   ├── BreathingBackground
│       │   ├── FocusTimer
│       │   ├── FocusControls
│       │   └── InterruptionModal
│       ├── BreakScreen
│       ├── TaskEditSheet
│       └── SettingsScreen
```

## 四、导航与路由模型

逻辑路由定义：

```text
/               → redirect to /today
/today          → TodayScreen
/focus          → FocusScreen
/break          → BreakScreen
/tasks          → TasksScreen
/insights       → InsightsScreen
/settings       → SettingsScreen
```

导航规则：

- 底部主导航仅包含 `Today | Tasks | Insights`
- `Focus` 与 `Break` 作为沉浸式流程页，通过 Stack 或 Modal 进入
- `Settings` 为次级页面，不属于主导航

说明：

- 即使当前 Expo 项目尚未以 URL 形式实现这些路径，这里仍作为信息架构与产品导航的标准定义

## 五、核心 Hooks 规划

| Hook | 职责 |
|------|------|
| `usePomodoro` | 控制 Focus / Break 会话、暂停、恢复、完成、保存待后续处理 |
| `useTasks` | 任务增删改查、状态流转、今日任务与积压管理 |
| `useTodayFocus` | 计算当前优先任务、Up Next、今日进度 |
| `useInsights` | 聚合每日统计、周节奏、计划准确率、中断分布 |
| `useSettings` | 番茄时长、休息时长、通知与主题设置 |
| `useInterruptionLog` | 记录中断原因并关联到会话与洞察 |

## 六、数据流

### Start Tomato

```text
Today
  → useTodayFocus.getCurrentTask()
  → usePomodoro.start(taskId)
  → FocusScreen
  → persist session
```

### Complete Pomodoro

```text
FocusScreen
  → usePomodoro.complete()
  → session stored
  → task.completedTomatoes += 1
  → BreakScreen
```

### Interruption

```text
FocusScreen
  → InterruptionModal
  → useInterruptionLog.add()
  → session status updated
  → Insights
```

## 七、存储策略

### 存储键

| Key | 类型 | 说明 |
|------|------|------|
| `@one-tomato/tasks` | `Task[]` | 所有任务 |
| `@one-tomato/sessions` | `PomodoroSession[]` | 所有 Focus / Break 会话 |
| `@one-tomato/interruptions` | `Interruption[]` | 中断日志 |
| `@one-tomato/settings` | `Settings` | 用户设置 |
| `@one-tomato/version` | `string` | 数据版本与迁移依据 |

### 迁移原则

- 启动时优先读取 `@one-tomato/version`
- 若版本不一致，先迁移旧结构再加载业务数据
- 对旧任务布尔完成态做一次性映射
- 对旧 `@pomodoro/*` 键名做统一迁移

## 八、跨平台策略

- Mobile：iOS / Android
- Web：浏览器访问
- Desktop：未来基于 Tauri 封装

差异处理原则：

- 通知能力按平台适配
- 动效与触感反馈按平台降级
- 数据模型与产品流程保持一致，不因平台切换而改变主导航结构

## 九、性能策略

| 关注点 | 策略 |
|------|------|
| 计时器精度 | 使用 `useRef + setInterval` 或等效时间校准机制 |
| 首屏速度 | `Today` 优先加载，非首屏内容延迟准备 |
| 存储频率 | 会话关键节点写入，不做每秒持久化 |
| 任务列表 | 使用虚拟化列表，避免整页重渲染 |
| Insights 聚合 | 尽量在读取层做聚合缓存，减少重复计算 |

## 十、当前代码现状说明

当前仓库实现仍保留旧的 screen / hook 命名，例如 `TimerScreen`、`TodoScreen`、`StatsScreen`、`useTimer`。这些名字属于历史实现遗留，不再代表 One Tomato 的目标产品结构。

后续代码重构阶段应以本文件中的 `Today / Focus / Break / Tasks / Insights` 架构为准。
