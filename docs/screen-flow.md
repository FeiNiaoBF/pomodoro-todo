# One Tomato 页面流转

> 定义 One Tomato 的主要页面、状态切换与交互路径

## 一、主流程

```text
Today → Focus → Break → Today / Focus → Insights
```

说明：

- 独立 Onboarding 尚未实现；首次体验由默认教程任务承担
- `Today` 是日常入口
- `Focus` 与 `Break` 是主循环的沉浸式页面
- `Insights` 用于复盘而不是实时施压

## 二、底部导航

```text
Today | Tasks | Insights
```

规则：

- `Focus` 和 `Break` 不在底部导航中
- `Settings` 为次级入口

## 三、Today Flows

```text
Today → Start Tomato → Focus
Today → Up Next item → Make Current Focus
Today → Add Task / empty state action → Tasks
Today → Settings → Settings
```

说明：

- `Start Tomato` 是 Today 的主要 CTA
- `Up Next` 最多展示两项，作为下一步候选而非完整任务列表
- 从 Today 添加任务应进入 Tasks 的轻量添加流程

## 四、Focus Flows

```text
Focus → Pause → Resume
Focus → Interrupted → InterruptionModal → Resume / Save for later
Focus → Complete → Start Break → Break
Focus → Save for later → Today / Tasks
```

说明：

- Focus 页面不展示复杂列表或数据仪表板
- 中断记录不应制造失败感
- `Save for later` 用于替代放弃式语言

## 五、Break Flows

```text
Break → Start Next Tomato → Focus
Break → Skip Break → Today
Break complete → Start Next Tomato / Return Today
```

说明：

- Break 应比 Focus 更柔和
- Break 允许用户回到 Today 重新确认下一步

## 六、Tasks Flows

```text
Tasks → Quick Add → Backlog / Today
Tasks → Today / Backlog / Completed tab switch
Tasks → Set current focus
Tasks → Mark done
Tasks → Archive
Tasks → Estimate tomatoes with +/- controls
```

说明：

- `Tasks` 的角色是轻量规划，不是复杂项目系统
- 任务状态流转围绕“今天、当前、完成、归档”组织

## 七、Insights Flows

```text
Insights → Day detail modal
Insights → Interruption breakdown
Insights → Planning accuracy
```

说明：

- Insights 应优先帮助用户理解习惯，而不是被动承受绩效展示
- 重点是节奏反馈、最佳专注时段、计划准确率与中断分布

当前状态：

- 已有基础 Insights 页面。
- 日详情 modal 尚未实现。
- 下一步重点是明确每个指标和图表的统计口径。

## 八、Settings Flows

```text
Settings → Change durations → Persist
Settings → Change theme → Apply immediately + Persist
Settings → Change language → Apply immediately + Persist
Settings → Reset defaults → Restore default settings
```

说明：

- 语言支持 System / English / 中文。
- System language 需要跟随 OS 语言。
- 旧 `zh-Hans` 应迁移为 `zh-CN`，但不在 UI 中展示。
