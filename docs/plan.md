# One Tomato 开发计划

> 以 Focus-first MVP 为核心的迭代路线图

## 一、路线总览

```text
v0.1 → v0.2 → v0.3 → v1.0
MVP   增强   打磨   桌面强化
```

## 二、v0.1 · Focus-first MVP

目标：

- 建立 `Today → Focus → Break → Tasks → Insights` 的最小可用闭环
- 优先把“计划今天并开始当前专注”做顺

### Day 1

- Initialize Expo project
- Set up navigation
- Set up design tokens
- Implement TodayScreen static UI
- Implement CurrentTaskCard
- Implement DailyProgress
- Implement StartTomatoButton
- Implement basic Tasks sample data

### Day 2

- Implement usePomodoro
- Implement FocusScreen
- Implement Pause / Resume
- Implement InterruptionModal basic UI
- Implement BreakScreen
- Implement Focus → Break flow

### Day 3

- Implement useTasks
- Implement QuickAddInput
- Implement TasksScreen
- Implement AsyncStorage persistence
- Implement Basic Insights
- Integrate Today → Focus → Break → Insights

### v0.1 交付清单

- Today screen
- Current task card
- Start Tomato flow
- Focus timer
- Pause / Resume
- Interruption logging
- Break screen
- Quick task add
- Local persistence
- Basic Insights

## 三、v0.2 · 核心增强

- Task states
- Planning accuracy
- Best focus time
- Weekly rhythm
- Custom Pomodoro durations
- Better notifications

## 四、v0.3 · 体验打磨

- UI polish
- Motion polish
- Empty states
- Accessibility
- Reduced motion
- Dark mode

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

- 如果沿用旧组件命名，`TimerRing.tsx` 可以作为过渡文件存在，但目标命名应迁移为 `FocusTimerRing.tsx`
- `useTimer` 作为旧实现命名可暂时保留，但新文档标准命名为 `usePomodoro`

## 七、实施注意事项

| 关注点 | 对策 |
|------|------|
| Focus 与 Break 流程衔接 | 先保证主流程完整，再增加扩展能力 |
| 任务状态复杂度 | 先覆盖 `backlog / today / active / completed`，再扩展更多状态 |
| 中断记录体验 | 先实现基本日志与非惩罚性文案，再做洞察分析 |
| 本地持久化 | 优先保证任务、会话、设置可恢复 |
| Insights 范围 | v0.1 只做基础复盘，避免一开始做成复杂 dashboard |
