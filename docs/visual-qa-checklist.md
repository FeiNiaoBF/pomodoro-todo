# One Tomato Visual QA Checklist

Use this checklist on a real device or simulator before adding more product behavior. Keep the pass focused on readability, theme correctness, persistence, and interaction quality.

## Pre-Flight

- Install dependencies and start the Expo app with the normal project command.
- Test on at least one small phone viewport and one larger phone viewport.
- Start with a clean app install when checking first-run behavior.
- Repeat the theme checks after closing and reopening the app.

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
- Confirm the Settings entry is tappable and visually aligned in the header.
- Confirm the progress card, current task card, Start Tomato button, and Up Next cards use the active theme.
- Tap Start Tomato and verify the app enters Focus without layout shift.
- Confirm tomato dots are readable in both themes.

## Focus Screen

- Confirm the timer uses Fraunces and remains centered.
- Confirm the current task title and description are readable.
- Verify Pause / Resume, Interrupted, Save for later, and Complete session controls are at least 44px tall.
- Confirm the breathing background remains soft and does not obscure the timer.
- Pause and resume once to confirm visual state remains stable.
- Confirm accidental swipe-back is disabled and Save for later remains the safe exit path.
- On Android, confirm hardware back does not leave an active Focus session; use Save for later instead.

## Break Screen

- Confirm the break timer uses Fraunces and accent color.
- Confirm the break bloom, next-task preview card, Start Next Tomato button, and Skip Break action use the active theme.
- Let or force a break complete and confirm the screen state remains readable.
- Confirm accidental swipe-back is disabled and Skip Break remains the safe exit path.
- On Android, confirm hardware back does not leave Break; use Skip Break instead.

## Tasks Screen

- Add a task and confirm input text, placeholder, and Add button are readable.
- Switch Today, Backlog, and Completed tabs in both themes.
- Confirm tab chips and task action chips are at least 44px tall.
- Confirm task cards, state pills, tomato dots, metadata, and empty state use the active theme.

## Insights Screen

- Confirm the hero focus-time card, metric cards, task progress bar, and weekly rhythm bars use the active theme.
- Confirm supportive copy remains readable and not dashboard-dense.
- Check that empty or low-data states still feel calm.

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
- Start a running focus timer, close the app long enough for wall-clock recovery, reopen, and confirm recovery behavior is sane.
