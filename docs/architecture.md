# One Tomato 技术架构

> 当前架构说明。本文以现有 Expo React Native 应用为准，并记录下一步需要补强的技术点。

## 1. 技术栈

- Expo React Native
- React Navigation Bottom Tabs + Native Stack
- AsyncStorage
- Jest + Testing Library
- TypeScript
- EAS Build

当前应用移动端优先，同时保留 Web 调试能力。数据默认本地保存，不依赖账号、后端或同步服务。

## 2. 页面结构

```text
App
└── RootNavigator
    ├── MainTabs
    │   ├── TodayScreen
    │   ├── TasksScreen
    │   └── InsightsScreen
    ├── FocusScreen
    ├── BreakScreen
    └── SettingsScreen
```

规则：

- `Today / Tasks / Insights` 是主底部导航。
- `Focus / Break` 是沉浸式流程页，不出现在底部导航。
- `Settings` 是次级页面，从 Today 进入。
- Focus 和 Break 禁用手势返回，避免破坏计时流程。

## 3. 目录结构

```text
src/
├── components/   共享 UI 组件
├── data/         首次体验与默认任务数据
├── hooks/        Context hooks、主题和翻译 hooks
├── i18n/         语言入口与 locale JSON
├── navigation/   Tab / Stack 路由
├── screens/      页面级组件
├── state/        Tasks / Pomodoro / Settings Provider
├── storage/      AsyncStorage 适配、key、迁移入口
├── theme/        tokens、字体、主题
├── types/        Task、Pomodoro、ActiveTimer 类型
└── utils/        展示格式、图表尺度、日期标签等纯函数
```

## 4. 状态层

### TasksProvider

负责：

- 任务读取与持久化
- 首次默认任务
- 新增任务
- 设置当前专注
- 标记完成
- 今日 / 待安排 / 已完成等状态流转

### PomodoroProvider

负责：

- Focus / Break 会话
- Pause / Resume
- Interrupted
- Save for later
- 完成 Focus 后写入 session
- 完成番茄后更新任务进度
- Active timer 快照恢复

### SettingsProvider

负责：

- 专注时长、短休、长休、长休间隔
- 主题：System / Light / Dark
- 语言：System / English / 中文
- Reduced motion
- 旧语言值 `zh-Hans` 迁移到 `zh-CN`

## 5. 数据层

当前存储基于 AsyncStorage，所有 key 集中在 `src/storage/storageKeys.ts`。

```text
@one-tomato/tasks
@one-tomato/sessions
@one-tomato/interruptions
@one-tomato/settings
@one-tomato/active-timer
@one-tomato/version
```

存储层原则：

- Provider 不直接拼 storage key。
- 读写通过 `storageClient` 和具体 storage adapter。
- 迁移逻辑应逐步集中到 `migrations.ts`。

## 6. 本地化架构

当前语言文件：

```text
src/i18n/locales/en.json
src/i18n/locales/zh-CN.json
```

要求：

- 两个 JSON 文件 key 必须一致。
- `translations.ts` 只负责聚合和类型导出。
- 用户创建的任务标题、描述不翻译。
- 旧 `zh-Hans` 只用于本地设置迁移。

## 7. 计时与恢复

当前已经有 active timer 快照和恢复逻辑：

- running 状态使用 `expectedEndAt` 做墙钟恢复。
- paused 状态保存剩余秒数。
- 重新打开应用后恢复当前计时状态。

下一步需要补强：

- AppState 前后台切换校准。
- Focus 完成和 Break 完成本地通知。
- 锁屏后返回应用的边界测试。

## 8. Insights 聚合

当前 Insights 基于本地任务、会话和中断记录计算：

- 今日实际专注时间
- 完成番茄
- 完成任务
- 当前连续节奏
- 今日计划完成度
- 任务进度列表
- 本周专注图
- 中断分布

下一步重点不是增加更多数字，而是让每个指标来源更清楚、图表更可解释。

## 9. 测试策略

当前测试覆盖：

- 本地化 key 和语言切换
- Settings 持久化
- Tasks Provider
- Pomodoro Provider
- Active timer recovery
- Today screen
- 展示 helper

发布前固定运行：

```bash
npx tsc --noEmit
npm test -- --runInBand
git diff --check
```

## 10. 下一步技术债

优先级：

1. 提交当前语言结构整理。
2. AppState + 本地通知。
3. Today daily goal 从硬编码改为设置或计划派生。
4. 集中迁移逻辑。
5. 完善任务编辑 / 删除 / 归档恢复。
6. 为 Insights 聚合补更多边界测试。
