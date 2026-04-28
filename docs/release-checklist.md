# One Tomato 发布前 Checklist

> 用于正式打包、提交 TestFlight / Google Play 内测 / 商店审核前逐项核对。

## 1. 代码与依赖

- [ ] `git status` 确认没有未预期的改动。
- [ ] `npm install` 已基于当前 `package-lock.json` 完成。
- [ ] `npm test -- --runInBand` 通过。
- [ ] `npx tsc --noEmit` 通过。
- [ ] 确认没有调试日志、临时按钮、测试文案进入生产界面。
- [ ] `EXPO_PUBLIC_SHOW_DEV_TIMER_CONTROLS` 未在生产环境启用。

## 2. 产品主流程

- [ ] 首次打开 App 能进入 Today。
- [ ] 空任务状态展示正常，能从 Today 跳转到 Tasks 添加任务。
- [ ] Tasks 能新增任务、切换 Today / Backlog / Completed。
- [ ] 任务能设置为当前专注。
- [ ] Today 能开始番茄。
- [ ] Focus 能暂停、继续、记录打断、稍后继续。
- [ ] Focus 倒计时结束后能进入 Break。
- [ ] Break 能开始下一个番茄，也能回到 Today。
- [ ] Insights 能展示当天专注、任务进度、周节奏。
- [ ] 关闭并重启 App 后，任务、设置、当前计时状态能恢复。

## 3. 语言与本地化

- [ ] Settings 中能选择 System / English / 简体中文。
- [ ] 跟随系统语言在中文系统下显示中文，在英文系统下显示英文。
- [ ] Today、Focus、Break、Tasks、Insights、Settings 的主要 UI 文案会随语言切换。
- [ ] 中文星期标签不会全部显示成同一个字。
- [ ] 中英文按钮文字在小屏手机上不截断、不重叠。
- [ ] 任务标题保持用户输入内容，不被翻译。

## 4. 真机视觉 QA

- [ ] iPhone 小屏设备检查 Today / Focus / Break / Tasks / Insights。
- [ ] Android 小屏设备检查 Today / Focus / Break / Tasks / Insights。
- [ ] 顶部内容不被状态栏遮挡。
- [ ] 底部导航不被 Home Indicator / 系统导航栏遮挡。
- [ ] Break 圆形呼吸区内文字不拥挤。
- [ ] 很短的任务标题，例如 `1`，在 Today / Focus / Insights 中显示不突兀。
- [ ] 番茄完成数超过预计值时不显示无效比例，例如 `6/1`。
- [ ] Today 的 Up Next 不把未完成任务显示成已完成番茄。

## 5. 设置与边界值

- [ ] Focus duration 最小/最大值限制有效。
- [ ] Short break 最小/最大值限制有效。
- [ ] Long break 最小/最大值限制有效。
- [ ] Long break interval 最小/最大值限制有效。
- [ ] Reduced motion 开关生效。
- [ ] Theme 的 System / Light / Dark 能切换。
- [ ] Reset to defaults 能恢复默认设置。

## 6. App 配置与素材

- [ ] `app.json` 中 app name、slug、version、icon、splash 配置正确。
- [ ] Android package name 确认无误。
- [ ] iOS bundle identifier 确认无误。
- [ ] App icon 在浅色/深色背景下清晰。
- [ ] Splash 图在不同屏幕比例下不变形。
- [ ] 权限声明没有多余权限。

## 7. 打包前

- [ ] 清理本地开发缓存后仍可启动。
- [ ] 生产包中隐藏开发工具。
- [ ] 测试账号/示例数据策略已确认。
- [ ] 隐私说明已确认：本地优先、无后端同步。
- [ ] 版本号与构建号已递增。
- [ ] 记录本次发布的已知问题与回归范围。

## 8. 提审前记录

- [ ] 测试设备型号：
- [ ] iOS 版本：
- [ ] Android 版本：
- [ ] 构建命令：
- [ ] 构建号：
- [ ] 测试负责人：
- [ ] 日期：
