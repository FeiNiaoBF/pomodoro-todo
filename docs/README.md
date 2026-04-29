# One Tomato Docs

本目录记录当前产品事实、设计约束、发布流程和后续路线。除非特别说明，文档以当前可运行应用为基准。

## 1. 推荐阅读顺序

1. `PRD.md` - 产品定位、核心流程和优先级
2. `architecture.md` - 当前技术结构和模块边界
3. `data-model.md` - 类型、存储键和迁移策略
4. `design.md` - 视觉、交互和文案原则
5. `screen-flow.md` - 页面流转和关键状态
6. `plan.md` - 下一步路线
7. `visual-qa-checklist.md` - 真机视觉、本地化和持久化 QA
8. `release-checklist.md` - 发布前逐项检查
9. `release-build-notes.md` - EAS 构建和发布标识
10. `real-device-qa-findings.md` - 历史真机 QA 发现与回归重点

## 2. 当前 Source of Truth

产品页面命名：

- `Today`
- `Focus`
- `Break`
- `Tasks`
- `Insights`
- `Settings`

主导航：

- `Today`
- `Tasks`
- `Insights`

语言：

- `System`
- `English`
- `中文`

语言 key：

- `system`
- `en`
- `zh-CN`

旧值 `zh-Hans` 仅用于迁移兼容。

## 3. 当前实现说明

当前仓库已经完成基础闭环：

- Today 首屏
- 当前专注任务
- Focus 计时
- Pause / Resume
- Interrupted / Save for later
- Break 流程
- Tasks 快速添加和状态切换
- Insights 基础数据展示
- Settings 中的时长、主题、语言、Reduced motion
- 本地持久化
- 中英文多语言文件拆分

当前仍需要继续打磨：

- 后台 / 锁屏时的通知和 AppState 校准
- Today 每日目标算法
- Insights 数据解释和图表表达
- 任务编辑、删除、归档恢复
- 集中式数据迁移

## 4. 旧命名说明

旧文档或早期讨论里的 `Timer / Todo / Stats` 不再作为产品结构使用。

允许保留的局部技术词：

- `timer` 作为计时器功能
- `tomato` 作为番茄数单位
- `stats` 作为内部统计计算

页面级和用户叙事应使用 `Today / Focus / Break / Tasks / Insights`。
