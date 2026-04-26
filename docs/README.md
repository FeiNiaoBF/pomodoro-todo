# 文档索引与 Source of Truth

本目录用于统一定义 `One Tomato` 的产品、设计、架构与实现路线。

## 一、文档优先级

1. `PRD.md` — 产品需求与功能优先级
2. `design.md` — UI/UX 设计系统与页面规则
3. `architecture.md` — 技术架构与模块关系
4. `plan.md` — 开发路线图
5. `screen-flow.md` — 页面流转与状态切换
6. `data-model.md` — 数据结构、存储键与迁移策略

## 二、命名 Source of Truth

文档统一使用以下产品命名：

- Today
- Focus
- Break
- Tasks
- Insights

不再使用以下旧主模型命名：

- Timer
- Todo
- Stats

说明：

- `timer` 可以作为组件或局部功能术语存在，例如 Focus timer、Break timer
- 但在页面级与产品级叙事中，应使用 `FocusScreen` 而不是 `TimerScreen`

## 三、阅读建议

如果你要：

- 理解产品目标，先读 `PRD.md`
- 设计界面，先读 `design.md`
- 规划实现结构，先读 `architecture.md`
- 安排开发节奏，先读 `plan.md`
- 理解页面跳转，读 `screen-flow.md`
- 设计存储和类型，读 `data-model.md`

## 四、当前仓库说明

当前代码实现仍保留旧命名遗留。这些命名不再代表产品方向，后续代码阶段应逐步迁移到本目录定义的 One Tomato 结构。
