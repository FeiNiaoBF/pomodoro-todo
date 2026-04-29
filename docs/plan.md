# One Tomato 开发计划

> 当前项目已经完成 Focus-first MVP 的主要闭环。本文记录后续路线和优先级。

## 一、路线总览

```text
v0.1        → v0.2             → v0.3       → v1.0
已完成闭环   真机与发布前打磨   增强体验     桌面强化
```

## 二、v0.1 · Focus-first MVP 状态

已完成：

- `Today → Focus → Break → Tasks → Insights` 主闭环
- Settings
- Light / Dark / System theme
- System / English / 中文
- AsyncStorage 持久化
- Active timer 恢复
- 基础 Insights
- EAS 构建配置
- 发布前 checklist 和视觉 QA checklist

仍需回归：

- 语言切换真机表现
- 小屏布局
- 旧 `zh-Hans` 设置迁移
- Focus / Break 后台恢复

## 三、v0.2 · 发布前打磨

优先级最高：

1. 提交当前语言文件拆分和中文调整。
2. 更新并执行 `visual-qa-checklist.md`。
3. 补 AppState 前后台校准。
4. 增加 Focus / Break 完成本地通知。
5. 修正 Today daily goal 的硬编码策略。
6. 完善 Insights 指标说明和图表口径。
7. 更新应用商店元信息、隐私说明和截图。

## 四、v0.3 · 核心增强

- 任务编辑
- 删除任务
- 归档与恢复
- 可配置每日目标
- 更完整的 tutorial todo
- 更丰富的周/月趋势
- 数据导出
- 更完整的无障碍检查

## 五、v1.0 · 桌面强化

- Desktop wrapper with Tauri
- Tray actions
- Desktop notifications
- Global shortcuts

## 六、开发规范

```typescript
// 文件命名: PascalCase 组件 / camelCase hooks
// 组件示例: FocusTimerRing.tsx
// Hook 示例: usePomodoro.ts

// 类型定义集中在 types/index.ts
// 工具函数集中在 utils/ 下

// Commit 规范
feat:     # 新功能
fix:      # 修复
docs:     # 文档
refactor: # 重构
style:    # 样式/UI
chore:    # 杂项
```

补充说明：

- 当前代码已经使用 `TodayScreen / FocusScreen / BreakScreen / TasksScreen / InsightsScreen`。
- 新增页面和文档不要再使用 `TimerScreen / TodoScreen / StatsScreen` 作为产品级命名。

## 七、实施注意事项

| 关注点 | 对策 |
|------|------|
| Focus 与 Break 流程衔接 | 先保证主流程完整，再增加扩展能力 |
| 任务状态复杂度 | 先覆盖 `backlog / today / active / completed`，再扩展更多状态 |
| 中断记录体验 | 先实现基本日志与非惩罚性文案，再做洞察分析 |
| 本地持久化 | 优先保证任务、会话、设置可恢复 |
| Insights 范围 | v0.1 只做基础复盘，避免一开始做成复杂 dashboard |

## 八、发布前固定验证

```bash
npx tsc --noEmit
npm test -- --runInBand
git diff --check
```
