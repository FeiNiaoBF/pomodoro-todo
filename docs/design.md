# One Tomato 设计系统

> 面向 `Today → Focus → Break → Tasks → Insights` 的产品设计说明

## 一、产品概览

`One Tomato` 是一个温暖、极简、专注优先的 Pomodoro Todo 应用。

它帮助用户先计划今天，再选择一个当前重点，进入沉浸式 Focus，完成后自然过渡到 Break，并通过温和的 Insights 帮助用户复盘自己的节奏。

它不是复杂项目管理工具，而是一个平静、支持型的专注伴侣。

## 二、目标用户

- 容易被分心的学生
- 需要深度工作的知识工作者
- 设计师、开发者、写作者、创作者
- 被复杂 Todo 工具压垮的用户
- 想要温和习惯支持，而不是严格打卡系统的人

## 三、设计方向

主方向：

`Warm Minimal + Organic Bloom + Soft Claymorphism + Swiss-inspired layout`

界面气质应当是：

- Warm
- Calm
- Minimal
- Focus-first
- Supportive
- Restorative
- Non-judgmental
- Habit-building

明确避免：

- Corporate blue SaaS 风格
- Heavy glassmorphism
- Brutalism
- Full neumorphism
- 复杂项目管理语言
- 惩罚式效率表达
- 通用 Todo App 视觉套板

## 四、UX 原则

### 1. Focus First

任何页面都应帮助用户更快进入“当前要做的一件事”。

### 2. Reduce Cognitive Load

减少按钮、减少解释、减少层级。主操作始终明确。

### 3. Gentle Productivity

中断、暂停、保存待后续处理都应被温和承接，不使用失败型文案。

### 4. Rhythm Over Pressure

番茄钟的意义是平衡专注与恢复，不是逼迫持续冲刺。

### 5. Mobile First

优先按 390px 左右移动宽度设计，保证大触控区域与清晰单列结构。

## 五、视觉 Tokens

### 色彩

| Token | Value | 用途 |
|------|------|------|
| Primary | `#E85D4F` | 主 CTA、当前专注强调 |
| Primary Hover | `#D94F42` | 按压态、hover 态 |
| Primary Soft | `#FFE0DC` | 主色浅底、提示背景 |
| Background | `#F8F6F2` | 页面背景 |
| Surface | `#FFFDF9` | 主卡片 |
| Surface Soft | `#FFF0ED` | 次级卡片、柔和区块 |
| Text | `#2D2422` | 正文和标题深色 |
| Muted | `#8C7A77` | 次级信息 |
| Outline | `#E0BFBB` | 边框与分隔 |
| Accent | `#F4A261` | Break、柔和强调 |
| Accent Soft | `#FFE7CF` | Break 背景、辅助卡 |
| Success | `#7BAE7F` | 完成与正向反馈 |
| Error | `#BA1A1A` | 错误状态 |

说明：

- 旧的 `#E53935` 和 `#FFB300` 不再作为主品牌设计依据
- 蓝色信息色不作为核心品牌表达

### 字体

| 用途 | 字体 | 规则 |
|------|------|------|
| Headings | `Fraunces` | 品牌感、温暖、节奏感 |
| Body | `DM Sans` | 清晰、轻量、可读性稳定 |
| Timer | `Fraunces` | 72px 至 88px，700，字距略收紧 |

建议层级：

- Main heading: 32px / 700 / Fraunces
- Section heading: 24px / 700 / Fraunces
- Body: 14px 至 16px / DM Sans
- Button: 16px / 600 / DM Sans
- Caption: 12px 至 13px / DM Sans

### 间距

采用 8px spacing system：

- 8
- 16
- 24
- 32
- 40
- 48

### 圆角

- Small controls: 8px
- Small cards and inputs: 16px
- Main cards and modals: 24px
- Hero cards and organic containers: 32px
- Pills and progress dots: full radius

### 阴影

统一使用软色阴影，避免重黑阴影：

```css
0 8px 24px rgba(232, 93, 79, 0.08)
```

## 六、组件规则

### Primary Button

- 高度优先 52 至 56px
- 强对比主色背景
- 文案简短，强调当下动作
- `Today` 中的 `Start Tomato` 必须是最清晰的主操作

### Secondary Button

- 使用浅色底或描边
- 不与主按钮争抢视觉层级
- 用于 `Skip Break`、`Save for later` 等次动作

### Current Task Card

- 是 `Today` 页的主 Hero 元素
- 展示当前任务标题、简短说明、番茄进度
- 视觉上比 `Up Next` 更大、更稳、更有空间

### Task Card

- 信息密度轻量
- 展示标题、项目标签、预估番茄、已完成番茄、状态
- 不做复杂项目管理卡片

### Tomato Estimator

- 用简洁番茄点或条段表达，不用系统 emoji
- 目的是快速估算，不是精细表单

### Interruption Modal

- 标题清晰：`What interrupted your focus?`
- 支持原因选择：phone、message、people、self-distraction、other
- 必须附带支持性文案：`This won't break your streak.`

### Insight Card

- 以可读、可行动的小结论为主
- 优先自然语言，而非过多技术指标
- 例如：`Morning Bird` 类型反馈卡

### Bottom Navigation

- 仅包含 `Today | Tasks | Insights`
- 应轻、低对比、不压主内容
- Focus 与 Break 不应作为常驻 Tab

## 七、动效原则

关键词：

- breathing
- blooming
- ease-in-out
- reduced motion support

规则：

- 动效以柔和、缓慢、有呼吸感为主
- Focus 可使用轻微背景脉动，帮助沉浸
- Break 的色调变化比 Focus 更柔软
- 页面切换避免炫技式位移
- 必须支持 `prefers-reduced-motion` 或平台等价方案

## 八、屏幕规范

### 1. Onboarding / Tutorial

目标：

- 建立温暖的产品第一印象
- 帮用户选择适合自己的专注节奏

当前状态：

- 独立 Onboarding 尚未实现。
- 当前首次体验通过默认教程任务说明 Today、Tasks、Focus 和 Insights。
- 默认任务必须参与本地化，不能只显示英文。

核心内容：

- App name: `One Tomato`
- Headline: `Let's find your rhythm.`
- Description: `Choose a focus pace that feels natural for you.`
- Rhythm cards:
  - Classic 25/5
  - Deep Work 50/10
  - Gentle 15/5
- Primary CTA: `Start my first tomato`

### 2. Today

目标：

- 让用户一打开应用就知道今天最重要的事
- 让 `Start Tomato` 成为最自然的下一步

核心内容：

- Greeting
- `Today’s Focus`
- `Tomatoes completed today`
- Segmented progress
- Current Task Card
- `Start Tomato`
- Up Next 最多两项

规则：

- 用户第一次看到的是 `Today`
- Current Task Card 必须是主视觉
- Up Next 是辅助，不要像任务清单主视图
- 不使用系统 emoji 作为核心进度图标

### 3. Focus

目标：

- 提供无干扰的沉浸式专注环境

核心内容：

- 当前任务标题
- 大号倒计时
- 会话标签，如 `Focus session 2 of 4`
- Pause
- Interrupted
- Save for later

规则：

- Timer 是 Focus 内的最强视觉元素
- 不出现任务列表、统计图表或设置面板
- 完成状态要引导到 Break，而不是停在原地

### 4. Break

目标：

- 帮助用户从专注转入恢复

核心内容：

- 大号休息计时器
- `Time to breathe.`
- 恢复型说明文案
- `Start Next Tomato`
- `Skip Break`

规则：

- 比 Focus 更柔和
- 以 `Accent` 与 `Accent Soft` 为主
- 不用高压语言催促恢复工作

### 5. Tasks

目标：

- 管理任务积压与今日计划，但不破坏专注主线

核心内容：

- Header: `Tasks`
- Quick add input
- Tabs: Today / Backlog / Completed
- Task cards
- Floating add button

规则：

- 信息轻量
- 不做复杂筛选与层级结构
- 番茄估算应该快速、直观

### 6. Insights

目标：

- 帮助用户温和复盘，而不是被数字审判

核心内容：

- Focus time today
- Completed tomatoes
- Completed tasks
- Current streak
- Weekly rhythm
- Organic heatmap
- Best focus time
- Planning accuracy
- Interruption breakdown

规则：

- 易扫读
- 不做密集 dashboard
- 使用友善反馈语言
- 每个数据卡片应让用户知道“这个数字来自哪里”
- 图表标题和辅助说明必须解释统计口径

### 7. Settings

目标：

- 让用户调整节奏、主题和语言
- 不把设置页做成复杂控制台

核心内容：

- Focus duration
- Short break
- Long break
- Long break interval
- Theme: System / Light / Dark
- Language: System / English / 中文
- Reduced motion

规则：

- 设置项变更应持久化。
- 语言切换后主要 UI 立即更新。
- `zh-Hans` 不作为用户可见语言名称。

## 九、文案原则

One Tomato 的语气应平静、直接、支持用户行动。

推荐：

- `稍后继续`
- `今天`
- `待安排`
- `已完成`
- `当前专注`
- `完成一轮后会自动增加`

避免：

- AI 感强的泛泛鼓励
- 过度拟人
- 惩罚、失败、落后、打卡压力
- 没有数据来源解释的结论式评价

## 十、UI 质量检查清单

- 首屏是否为 `Today`，而不是 timer 主界面
- 主导航是否仅为 `Today | Tasks | Insights`
- Focus 与 Break 是否是沉浸式流程页
- 所有主要按钮触控区域是否至少 44px
- 是否避免只靠颜色表达状态
- 是否使用新色板而不是旧红黄体系
- 是否将 timer 限定在 Focus / Break 内部表达
- 是否支持 reduced motion
- 是否避免惩罚式文案与失败感
- 中英文按钮是否在小屏手机上不截断、不重叠
- Insights 图表是否有清楚标题、单位和统计口径
