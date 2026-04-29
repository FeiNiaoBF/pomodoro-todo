# One Tomato Visual QA Checklist

Use this checklist on a real device or simulator before release or before adding more product behavior. Keep the pass focused on readability, theme correctness, localization, persistence, and interaction quality.

## Pre-Flight

- Install dependencies and start the Expo app with the normal project command.
- Test on at least one small phone viewport and one larger phone viewport.
- Start with a clean app install when checking first-run behavior.
- Repeat the theme checks after closing and reopening the app.
- Run `npx tsc --noEmit`, `npm test -- --runInBand`, and `git diff --check` before marking the QA pass complete.

## Light Theme

- In Settings, select Light.
- Confirm the warm off-white background, tomato primary actions, espresso text, and soft clay cards are visible.
- Check that muted labels remain readable on background, cards, inputs, and chips.
- Confirm selected chips and selected theme options have readable tomato text on the soft tomato background.
- Verify the bottom navigation active and inactive labels are readable.

## Dark Theme

- In Settings, select Dark.
- Confirm the background is warm dark, not neutral black or blue-gray.
- Check primary text, muted text, labels, timer text, button text, tab labels, chip labels, and modal copy.
- Confirm card borders remain visible without looking harsh.
- Confirm tomato and accent surfaces do not vibrate or feel over-saturated.

## System Theme

- In Settings, select System.
- Change the OS theme between light and dark.
- Confirm the app follows the OS theme after returning to the app.
- Close and reopen the app, then confirm System remains selected and resolves correctly.

## Localization

- In Settings, select System language.
- Change the OS language to English, return to the app, and confirm the app shows English copy.
- Change the OS language to Mainland Chinese, return to the app, and confirm the app shows Mainland Chinese copy.
- In Settings, select English, close and reopen the app, then confirm English mode persists.
- In Settings, select 中文, close and reopen the app, then confirm Mainland Chinese mode persists.
- Confirm Today, Focus, Break, Tasks, Insights, and Settings copy switches correctly between English and Mainland Chinese.
- Confirm bottom navigation labels switch correctly between Today / Tasks / Insights and 今天 / 任务 / 回顾.
- Confirm tomato progress copy switches correctly, including normal progress, no-estimate copy, and over-completed copy.
- Confirm task state labels switch correctly, including Current focus, Saved for later, Today, Backlog, Done, and Archived equivalents.
- Confirm first-run tutorial/default tasks are localized in both English and Mainland Chinese.
- Create a task in English, switch to Mainland Chinese, and confirm the user-created task title is not translated.
- Create a task in Mainland Chinese, switch to English, and confirm the user-created task title is not translated.
- In Mainland Chinese mode, confirm weekly rhythm labels are distinct: 一 二 三 四 五 六 日.
- In English mode, confirm weekly rhythm labels remain distinct enough to identify the week positions and do not collapse into seven identical labels.
- If upgrading from a build that stored `zh-Hans`, confirm it migrates to Mainland Chinese / `zh-CN`.
- On a small phone viewport, confirm English button labels do not truncate or overlap.
- On a small phone viewport, confirm Mainland Chinese button labels do not truncate or overlap.

## Safe Area / Status Bar

- Confirm no header, title, label, or top bloom content is hidden by the status bar.
- Confirm top content remains visible on notch and dynamic island devices.
- Confirm Today, Tasks, Insights, and Settings start below the status bar in light, dark, and system themes.
- Confirm Focus and Break labels, timer content, and top spacing remain visible on small and large phone viewports.
- Confirm Focus controls and Break buttons are not hidden by the home indicator.
- Confirm the bottom navigation is not clipped, too low, or too close to the home indicator.
- Confirm the StatusBar text/icon style is readable in light and dark themes.
- Check iOS and Android if both are available.

## Today Screen

- Confirm the screen never appears blank while app data is loading.
- With a slow/cold launch, confirm the loading state says "Preparing your focus rhythm...".
- With an empty stored task list, confirm the empty state says "Your day is a blank slate." and the Add a task action opens Tasks.
- Confirm the greeting matches local time: morning, afternoon, or evening.
- Confirm the Settings entry is tappable and visually aligned in the header.
- Confirm the progress card, current task card, Start Tomato button, and Up Next cards use the active theme.
- Complete more tomatoes than the daily goal and confirm the card does not show ratios like "9/8".
- Confirm over-goal progress shows completed count plus calm goal context.
- Confirm a clean new install does not show misleading completed-today progress before any completed Focus session.
- Confirm very short or numeric current task titles still have enough surrounding context.
- Confirm Up Next tasks with zero completed tomatoes show unfilled tomato dots.
- Tap Start Tomato and verify the app enters Focus without layout shift.
- Confirm tomato dots are readable in both themes.

## Focus Screen

- Confirm the timer uses Fraunces and remains centered.
- Confirm the current task title and description are readable.
- Confirm very short or numeric task titles are supported by the Current focus label.
- Confirm over-completed task progress does not show ratios like "6/1 tomatoes".
- Confirm the development timer completion control is hidden by default.
- If `EXPO_PUBLIC_SHOW_DEV_TIMER_CONTROLS=true` is set, confirm the dev control appears and remains visually quiet.
- Verify Pause / Resume, Interrupted, Save for later, and any enabled dev timer control are at least 44px tall.
- Confirm the breathing background remains soft and does not obscure the timer.
- Pause and resume once to confirm visual state remains stable.
- Tap Save for later, return to the task, and confirm the remaining time is not unexpectedly reset.
- Confirm accidental swipe-back is disabled and Save for later remains the safe exit path.
- On Android, confirm hardware back does not leave an active Focus session; use Save for later instead.

## Break Screen

- Confirm the break timer uses Fraunces and accent color.
- Confirm the timer remains the visual focus and "Time to breathe." does not crowd the timer on small phones.
- Confirm the break bloom, next-task preview card, Start Next Tomato button, and Skip Break action use the active theme.
- Let or force a break complete and confirm the screen state remains readable.
- Confirm accidental swipe-back is disabled and Skip Break remains the safe exit path.
- On Android, confirm hardware back does not leave Break; use Skip Break instead.

## Tasks Screen

- Add a task and confirm input text, placeholder, and Add button are readable.
- Switch Today, Backlog, and Completed tabs in both themes.
- Confirm tab chips and task action chips are at least 44px tall.
- Confirm task cards, state pills, tomato dots, metadata, and empty state use the active theme.
- Confirm task state labels are user-facing: Current focus, Saved for later, Today, Backlog, Done, and Archived.
- Complete more tomatoes than the estimate and confirm the task metadata does not show ratios like "6/1 tomatoes".
- Confirm very short or numeric task titles remain readable inside task cards.

## Insights Screen

- Confirm the hero focus-time card, metric cards, task progress bar, and weekly rhythm bars use the active theme.
- Confirm supportive copy remains readable and not dashboard-dense.
- Confirm every metric has enough context to understand what it represents.
- Confirm Today Summary explains Focus time, Completed tomatoes, Completed tasks, and Interruptions.
- Confirm Weekly Focus chart labels are distinct in English and Mainland Chinese.
- Confirm Weekly Focus rounded bars remain readable on small screens.
- Confirm Planning Accuracy clearly compares Planned and Actual tomatoes.
- Confirm Planning Accuracy explains what planned tomatoes and actual completed tomatoes mean.
- Confirm Task Progress is clamped to 0-100%.
- Confirm Interruption bubble cluster is readable and supported by a ranked list.
- Confirm Best Focus Time shows an honest learning state when fewer than 3 completed focus sessions exist.
- Confirm dark mode charts remain readable.
- Confirm Mainland Chinese Insights copy does not overflow on small screens.
- Confirm today focus time increases only from actual focus work, not from idle time, break time, or merely opening Insights.
- Check that empty or low-data states still feel calm.
- In Chinese locale, confirm weekly rhythm labels show distinct values: 一 二 三 四 五 六 日.
- In English locale, confirm weekly rhythm labels do not collapse into seven identical labels.
- Confirm Task progress remains capped at 100% and uses supportive copy when progress exceeds the plan.
- Scroll the page midway and confirm no important content is trapped under the status bar.

## Settings Screen

- Confirm the Back button is at least 44px tall.
- On iOS, open Settings from Today and confirm swipe-back dismisses Settings.
- On Android, open Settings and confirm the hardware back button dismisses Settings.
- Check all duration steppers in light and dark themes.
- Confirm plus/minus buttons, disabled buttons, stepper values, and units have enough contrast.
- Select System, Light, and Dark and confirm selected state is readable.
- Toggle Reduced motion and confirm the switch is readable in both states.
- Tap Reset to defaults and confirm settings return to defaults without visual breakage.

## Interruption Modal

- Open the Focus screen and tap Interrupted.
- Confirm the modal backdrop dims content without making the card muddy.
- Confirm every interruption chip is readable, tappable, and at least 44px tall.
- Select each option and confirm selected state has enough contrast.
- Test Resume and Save for later in both themes.

## Reduced Motion

- Turn Reduced motion off and confirm the breathing bloom animates gently.
- Turn Reduced motion on and confirm the breathing bloom becomes static or softened.
- Confirm reduced motion does not affect timer correctness or navigation.

## Font Loading

- Relaunch the app and confirm there is no flash of broken typography.
- Confirm page headings and timer use Fraunces.
- Confirm body copy, labels, tabs, chips, and buttons use DM Sans.
- Confirm the timer, Settings stepper values, and button labels do not wrap unexpectedly.

## Touch Targets

- Confirm these controls are comfortably tappable: Start Tomato, Pause / Resume, Interrupted, Save for later, Start Next Tomato, Settings steppers, theme selector, Reset to defaults, task tabs, task action chips, and interruption chips.
- Watch for controls near screen edges or inside scroll views that are hard to tap.

## AsyncStorage Persistence

- Add a task, set it as current, complete or move it, then close and reopen the app.
- Confirm tasks hydrate from storage instead of seed tasks.
- Start and complete a focus session, close and reopen, then confirm Insights reflects the completed tomato.
- Log an interruption, close and reopen, then confirm the interruption count persists.
- Change theme and duration settings, close and reopen, then confirm settings persist.
- Change language, close and reopen, then confirm language persists.
- Start a running focus timer, close the app long enough for wall-clock recovery, reopen, and confirm recovery behavior is sane.
