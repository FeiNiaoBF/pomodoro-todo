# One Tomato Quickstart

本文件说明当前仓库如何运行、如何验证，以及下一步开发应先看哪里。

## 1. 当前项目状态

当前应用主结构为：

- Bottom tabs: `Today / Tasks / Insights`
- Flow screens: `Focus / Break`
- Secondary screen: `Settings`
- Localization: `System / English / 中文`
- Storage: AsyncStorage，本地优先，无账号、无后端
- Build: Expo + EAS，已可打 Android/iOS 内测包

## 2. 环境要求

- Node.js 18 或更高
- npm
- Expo / EAS 通过项目脚本或 `npx` 使用
- 本机如使用 `fnm`，先切换到项目需要的 Node 版本，再执行安装和启动命令

常用检查：

```bash
node -v
npm -v
```

## 3. 安装依赖

```bash
npm install
```

如果刚切换 Node 版本或依赖异常，优先重新执行 `npm install`，不要手动改 `node_modules`。

## 4. 本地启动

```bash
npm run start
```

常用平台命令：

```bash
npm run web
npm run android
npm run ios
```

如果 Expo Dev Server 已经运行，继续使用现有地址即可，例如 `http://localhost:8082/`。

## 5. 验证命令

开发或发布前至少运行：

```bash
npx tsc --noEmit
npm test -- --runInBand
git diff --check
```

说明：

- `npx tsc --noEmit` 检查 TypeScript 类型。
- `npm test -- --runInBand` 串行运行 Jest，适合当前 React Native 测试环境。
- `git diff --check` 检查空白字符问题。

## 6. 当前代码结构

```text
src/
├── components/
│   ├── BreathingBackground.tsx
│   ├── CurrentTaskHeroCard.tsx
│   ├── SegmentedProgressBar.tsx
│   └── TomatoDots.tsx
├── data/
│   └── todaySample.ts
├── hooks/
│   ├── useAppTheme.ts
│   ├── usePomodoro.ts
│   ├── useSettings.ts
│   ├── useTasks.ts
│   └── useTranslation.ts
├── i18n/
│   ├── locales/
│   │   ├── en.json
│   │   └── zh-CN.json
│   └── translations.ts
├── navigation/
│   ├── LocalStackNavigator.tsx
│   ├── RootNavigator.tsx
│   └── types.ts
├── screens/
│   ├── TodayScreen.tsx
│   ├── FocusScreen.tsx
│   ├── BreakScreen.tsx
│   ├── TasksScreen.tsx
│   ├── InsightsScreen.tsx
│   └── SettingsScreen.tsx
├── state/
│   ├── PomodoroProvider.tsx
│   ├── SettingsProvider.tsx
│   ├── TasksProvider.tsx
│   └── pomodoroRecovery.ts
├── storage/
│   ├── activeTimerStorage.ts
│   ├── migrations.ts
│   ├── pomodoroStorage.ts
│   ├── settingsStorage.ts
│   ├── storageClient.ts
│   ├── storageKeys.ts
│   └── tasksStorage.ts
├── theme/
├── types/
└── utils/
```

## 7. 数据与设置

当前核心 storage keys：

- `@one-tomato/tasks`
- `@one-tomato/sessions`
- `@one-tomato/interruptions`
- `@one-tomato/settings`
- `@one-tomato/active-timer`
- `@one-tomato/version`

语言设置目前使用：

- `system`
- `en`
- `zh-CN`

## 8. 发布与真机 QA

发布前先看：

1. `docs/release-checklist.md`
2. `docs/visual-qa-checklist.md`
3. `docs/release-build-notes.md`
4. `docs/real-device-qa-findings.md`

重点真机检查：

- 首次安装是否进入 Today。
- 语言切换和重启持久化是否正确。
- Focus 结束、Break 开始、稍后继续等计时状态是否符合预期。
- Insights 中的今日专注时间是否只来自已完成的专注记录。
- 小屏手机上中英文按钮不截断、不重叠。

## 9. 下一步建议

优先级从高到低：

1. 提交当前中文 / English 语言改动，避免后续功能混入同一批变更。
2. 补后台与锁屏体验：AppState 校准、本地通知、Focus/Break 完成提醒。
3. 梳理 Today 的每日目标算法，避免固定 `8` 带来的误解。
4. 继续完善 Insights 的数据解释、图表含义和空状态。
5. 集中整理迁移逻辑，减少 Provider 内分散的历史兼容代码。
6. 补任务编辑、删除、归档恢复、教程任务重置等任务管理能力。

## 10. 常见问题

### 项目现在是不是可以上手机测试？

可以。当前项目已经可以通过 Expo / EAS 构建并部署到真机。

### Focus 和 Break 是底部 Tab 吗？

不是。它们是从 Today 进入的沉浸式流程页。

### 应用是否依赖云端？

不依赖。当前方向是本地优先、无账号、无后端同步。

### 为什么还有 `zh-Hans`？

只用于兼容旧本地设置。当前正式语言标识是 `zh-CN`。
