# One Tomato

One Tomato 是一个温暖、极简、专注优先的 Pomodoro Todo 应用。

它帮助用户先规划今天，再选定当前重点，进入沉浸式 Focus，完成后自然过渡到 Break，并通过温和的 Insights 形成复盘闭环。

核心承诺：

- `One task, one focus, one tomato.`
- `一次只专注一件事，一个番茄完成一个进步。`

## 产品方向

主循环：

`Today → Focus → Break → Insights → Repeat`

主底部导航：

- Today
- Tasks
- Insights

重要说明：

- `Focus` 与 `Break` 是沉浸式流程页，不是主导航 Tab
- `Today` 才是产品首屏，不是 timer 主界面

## 技术基础

| 层级 | 技术 |
|------|------|
| App | React Native + Expo + TypeScript |
| Storage | AsyncStorage |
| Future Desktop | Tauri |

产品策略：

- 本地优先
- 隐私优先
- 不要求后端
- 未来支持跨平台扩展

## 当前仓库说明

当前仓库实现仍保留旧命名遗留，例如 `TimerScreen`、`TodoScreen`、`StatsScreen`、`useTimer`。这些名字只代表当前代码阶段，不代表 One Tomato 的目标产品模型。

文档中的 source of truth 已统一为：

- Today
- Focus
- Break
- Tasks
- Insights

## 快速开始

### 环境要求

- Node.js ≥ 18
- Expo CLI：`npm install -g expo-cli`
- 可选：Rust toolchain，用于未来桌面封装

### 安装与运行

```bash
git clone https://github.com/your-username/pomodoro-todo.git
cd pomodoro-todo
npm install

npx expo start
npx expo start --web
```

## 文档索引

优先阅读：

1. [docs/PRD.md](docs/PRD.md)
2. [docs/design.md](docs/design.md)
3. [docs/architecture.md](docs/architecture.md)
4. [docs/plan.md](docs/plan.md)
5. [docs/screen-flow.md](docs/screen-flow.md)
6. [docs/data-model.md](docs/data-model.md)

文档索引总入口：

- [docs/README.md](docs/README.md)

## 路线图摘要

| 版本 | 方向 |
|------|------|
| `v0.1` | Focus-first MVP |
| `v0.2` | 任务状态、计划准确率、最佳专注时段、更多洞察 |
| `v0.3` | UI 打磨、动效打磨、无障碍、深色模式 |
| `v1.0` | Tauri 桌面封装、托盘、快捷键 |

## License

MIT
