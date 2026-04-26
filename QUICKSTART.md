# One Tomato 快速启动

本文件说明如何运行当前仓库，并说明当前实现与目标产品文档之间的关系。

## 一、先知道两件事

### 1. 当前仓库可以运行

项目当前基于 Expo + React Native，可直接本地启动。

### 2. 文档中的产品模型已经升级

当前代码仍保留旧命名遗留，如 `TimerScreen`、`TodoScreen`、`StatsScreen`、`useTimer`。  
这些名称只代表当前实现阶段，不再作为产品命名标准。

从现在开始，文档统一使用：

- Today
- Focus
- Break
- Tasks
- Insights

## 二、环境要求

- Node.js ≥ 18
- Expo CLI：`npm install -g expo-cli`

## 三、安装依赖

```bash
cd pomodoro-todo
npm install
```

## 四、启动项目

### 浏览器运行

```bash
npm run web
```

### 手机扫码运行

```bash
npm run start
```

### 指定平台

```bash
npm run android
npm run ios
```

## 五、当前代码结构

```text
src/
├── components/
│   └── TimerRing.tsx
├── hooks/
│   ├── useTimer.ts
│   └── useTodos.ts
├── navigation/
│   ├── RootNavigator.tsx
│   └── types.ts
├── screens/
│   ├── TimerScreen.tsx
│   ├── TodoScreen.tsx
│   ├── StatsScreen.tsx
│   └── SettingsScreen.tsx
├── types/
│   └── index.ts
└── utils/
    └── StorageService.ts
```

说明：

- 以上是当前仓库实际文件结构
- 目标产品结构请以 `docs/` 中的文档为准
- 后续代码重构阶段将逐步从旧命名迁移到 `Today / Focus / Break / Tasks / Insights`

## 六、目标产品结构

```text
Bottom tabs:
- Today
- Tasks
- Insights

Immersive flow screens:
- Focus
- Break

Secondary page:
- Settings
```

## 七、当前开发阶段关注点

当前文档定义的方向是：

- 首屏应为 `Today`
- 主操作应为 `Start Tomato`
- `Focus` 与 `Break` 形成沉浸式节奏闭环
- `Tasks` 负责轻量计划与快速添加
- `Insights` 负责温和复盘

## 八、数据与本地存储

当前和目标方向都坚持：

- 本地优先
- 无需后端
- 无需账号
- 隐私优先

目标 storage keys 以文档为准：

- `@one-tomato/tasks`
- `@one-tomato/sessions`
- `@one-tomato/interruptions`
- `@one-tomato/settings`
- `@one-tomato/version`

## 九、推荐阅读顺序

1. `docs/PRD.md`
2. `docs/design.md`
3. `docs/architecture.md`
4. `docs/plan.md`
5. `docs/screen-flow.md`
6. `docs/data-model.md`

## 十、常见问题

### Q: 为什么文档和当前代码命名不一致？

A: 因为这次先完成文档体系重构，代码迁移会在后续实现阶段进行。

### Q: 当前项目是否依赖云端？

A: 不依赖，产品方向仍然是本地优先。

### Q: Focus 和 Break 是不是底部 Tab？

A: 不是。它们是沉浸式流程页。

### Q: 首屏是不是 timer？

A: 不是。目标产品首屏是 `Today`。
