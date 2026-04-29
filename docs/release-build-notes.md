# One Tomato Release Build Notes

> 发布配置说明。用于开发或测试人员打内测包、正式包前确认。

## 当前发布标识

- App name: `One Tomato`
- Expo slug: `one-tomato`
- URL scheme: `one-tomato`
- Version name: `0.1.0`
- Android package: `com.yeekox.onetomato`
- Android versionCode: `1`
- iOS bundle identifier: `com.yeekox.onetomato`
- iOS buildNumber: `1`

这些标识在首次提交 App Store / Google Play 前需要最终确认。尤其是 Android package 和 iOS bundle identifier，一旦正式上架后就不应该再修改。

## Native Directory Note

仓库的 `android/` 目录目前在 `.gitignore` 中，正式 EAS 构建应以 `app.json` 为发布配置来源。如果本机保留了已生成的 `android/` 目录，需要确保其中的 app name、applicationId、namespace、versionName 与本文件一致。

## EAS Build Profiles

- `development`: 内部开发包，启用 development client，并显示开发计时控制。
- `preview`: 内测包，Android 输出 APK，隐藏开发计时控制。
- `production`: 正式包，隐藏开发计时控制，并开启 EAS 远端 build number / versionCode 自动递增。

## 常用命令

```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform ios --profile preview
npx eas-cli build --platform all --profile production
```

## 发布前必须确认

- `EXPO_PUBLIC_SHOW_DEV_TIMER_CONTROLS` 在 `preview` 和 `production` 中为 `false`。
- `app.json` 中的 `name`、`slug`、`version`、`bundleIdentifier`、`package` 正确。
- EAS 远端版本号已初始化；之后 production profile 会自动递增 build number / versionCode。
- `assets/icon.png` 和 `assets/adaptive-icon.png` 为 1024x1024。
- `assets/splash-icon.png` 在小屏和大屏上不变形。
- Android 生产包不申请多余权限。
- 隐私说明保持与产品事实一致：本地优先、无后端同步。
