# Real Device QA Findings

Date: 2026-04-27

Source: User-provided iPhone screenshots from Today, Focus, Break, Tasks, and Insights.

## Summary

The app is generally rendering correctly on device: safe area spacing, bottom navigation, core cards, and main controls are visible and tappable. The remaining issues are mostly data-display edge cases and a few polish items caused by over-completed tomato counts, very short task titles, development controls, and locale-specific labels.

## Findings

### P1 - Over-completed tomato counts still appear in key surfaces

Screens:
- Today
- Focus
- Tasks

Evidence:
- Today progress header shows `9/8`.
- Current task card shows `6/1 tomatoes`.
- Focus timer badge shows `6/1 tomatoes`.
- Tasks card shows `7 tomatoes completed - Estimated 1`, which is improved, but other tomato badges still expose the over-completed ratio.

Impact:
- Ratios like `6/1` look invalid even when the underlying data is technically possible.
- The app feels less calm because it appears to be reporting an error.

Recommended fix:
- Centralize tomato progress display formatting in `TomatoDots` or a shared helper.
- Clamp visual dots to the estimate.
- Use supportive copy when completed tomatoes exceed the estimate, such as `6 completed` and `Estimated 1`.
- For daily goal progress, avoid `9/8`; use `9 completed`, `Goal 8`, or `1 beyond goal`.

### P1 - Development-only focus control is visible during device QA

Screen:
- Focus

Evidence:
- Focus shows `Dev: Complete session` as a large bottom control.

Impact:
- This is useful for development, but too prominent for normal real-device QA and can be mistaken for production UI.

Recommended fix:
- Keep the action available only behind a stronger explicit flag, for example `EXPO_PUBLIC_SHOW_DEV_TIMER_CONTROLS=true`.
- Default to hidden even in Expo development builds unless that flag is enabled.

### P1 - Today Up Next tomato dots appear completed for future tasks

Screen:
- Today

Evidence:
- Up Next tasks such as `喝水` and `做作业` show a filled tomato icon even though they are upcoming tasks.

Impact:
- Future tasks look already completed.

Recommended fix:
- In Today Up Next rows, pass the task's real `completedTomatoes` value to `TomatoDots`.
- Do not pass `estimatedTomatoes` as both total and completed.

### P2 - Very short task titles still feel visually under-supported

Screens:
- Today
- Focus
- Tasks
- Insights

Evidence:
- Task title `1` appears as the main task name.
- Focus screen places `1` alone under the session label.

Impact:
- Very short or numeric titles are valid input, but they can look accidental or visually isolated.

Recommended fix:
- Keep the data as entered, but add safer surrounding context in hero/focus surfaces.
- Consider a small label such as `Current focus` near the title, or use a minimum title container height that balances short titles without adding clutter.

### P2 - Time-of-day greeting is static

Screen:
- Today

Evidence:
- Screenshot time is 22:56, but Today says `Good morning`.

Impact:
- The screen feels out of sync with the user's current context.

Recommended fix:
- Derive greeting from local time:
  - morning
  - afternoon
  - evening
- Keep the copy calm and short.

### P2 - Weekly rhythm labels collapse in Chinese locale

Screen:
- Insights

Evidence:
- Weekly rhythm labels all display `周`.

Root cause:
- The current label generation appears to take the first character from localized weekday names. In Chinese, weekdays are commonly `周一`, `周二`, etc., so the first character is always `周`.

Impact:
- The weekly rhythm chart becomes hard to read.

Recommended fix:
- Use a locale-safe weekday formatter.
- For Chinese, display `一`, `二`, `三`, `四`, `五`, `六`, `日`, or use fixed weekday labels independent of locale.

### P2 - Break timer composition is tight on device

Screen:
- Break

Evidence:
- The `04:58` timer, `Time to breathe.`, and supporting copy sit inside the breathing visual with tight vertical spacing.

Impact:
- It is readable, but the large timer and headline compete visually on smaller phone widths.

Recommended fix:
- Slightly reduce the break headline size or increase vertical spacing inside the timer visual.
- Keep the same warm break style.

### P3 - Insights scroll content can sit behind the status area while scrolling

Screen:
- Insights

Evidence:
- A scrolled screenshot shows content near the very top under the status bar area.

Impact:
- This may be normal scroll behavior, but it should be confirmed on device to ensure content is not visually trapped under the status bar.

Recommended check:
- Scroll Insights to top and mid-scroll on iOS and Android.
- Confirm no important text or controls are hidden under the status bar.

### P3 - Task state labels may expose internal workflow states

Screen:
- Tasks

Evidence:
- One card shows `Paused`.
- Another card with the title `1` shows `Today` while also being the current task elsewhere.

Impact:
- Labels may be correct internally, but users may not understand the difference between `Today`, `Paused`, and `Current focus`.

Recommended fix:
- Review task state label mapping for user-facing language.
- Prefer supportive labels such as `Current focus`, `Saved for later`, `Today`, and `Done`.

## Confirmed Good

- Headers are no longer covered by the status bar.
- Bottom navigation is visible and not clipped by the home indicator.
- Main controls are large enough for touch.
- Quick add duplicate wording is resolved.
- Insights progress is clamped to `100%`.
- Insights current-task copy avoids awkward numeric-title interpolation.
- Cards and buttons preserve the One Tomato warm visual direction.

## Suggested Next Fix Order

1. Fix shared tomato progress formatting and Today Up Next completed-dot bug.
2. Hide the dev-only Focus completion button behind an explicit opt-in flag.
3. Fix locale-safe Weekly rhythm labels.
4. Make Today greeting time-aware.
5. Polish very short task title presentation on Today and Focus.
6. Recheck Break timer spacing on the smallest target phone.
