import { OneTomatoLanguage } from '../storage/settingsStorage';

export type AppLanguage = 'en' | 'zh-Hans';

export type TranslationKey =
  | 'common.back'
  | 'common.settings'
  | 'nav.today'
  | 'nav.tasks'
  | 'nav.insights'
  | 'settings.title'
  | 'settings.subtitle'
  | 'settings.focusRhythm'
  | 'settings.focusDuration'
  | 'settings.shortBreak'
  | 'settings.longBreak'
  | 'settings.longBreakInterval'
  | 'settings.experience'
  | 'settings.reducedMotion'
  | 'settings.reducedMotionHint'
  | 'settings.theme'
  | 'settings.language'
  | 'settings.languageHint'
  | 'settings.language.system'
  | 'settings.language.en'
  | 'settings.language.zhHans'
  | 'settings.theme.system'
  | 'settings.theme.light'
  | 'settings.theme.dark'
  | 'settings.reset'
  | 'settings.unit.min'
  | 'settings.unit.tomatoes'
  | 'settings.decrease'
  | 'settings.increase'
  | 'today.title'
  | 'today.completed'
  | 'today.currentTomato'
  | 'today.startTomato'
  | 'today.continueTomato'
  | 'today.savedTimerBadge'
  | 'today.savedTimerNote'
  | 'today.preparingTitle'
  | 'today.preparingCopy'
  | 'today.blankTitle'
  | 'today.blankCopy'
  | 'today.addTask'
  | 'today.upNext'
  | 'today.keepLight'
  | 'today.noNextTitle'
  | 'today.noNextCopy'
  | 'greeting.morning'
  | 'greeting.afternoon'
  | 'greeting.evening'
  | 'task.currentFocus'
  | 'task.savedForLater'
  | 'task.today'
  | 'task.backlog'
  | 'task.done'
  | 'task.archived'
  | 'task.readyNow'
  | 'tomato.noEstimate'
  | 'tomato.completed'
  | 'tomato.estimated'
  | 'tomato.tomatoes'
  | 'tomato.goal'
  | 'tomato.beyondGoal'
  | 'focus.sessionOf'
  | 'focus.pause'
  | 'focus.resume'
  | 'focus.interrupted'
  | 'focus.saveForLater'
  | 'focus.devComplete'
  | 'focus.interruptionTitle'
  | 'focus.interruptionSupport'
  | 'focus.reason.phone'
  | 'focus.reason.message'
  | 'focus.reason.people'
  | 'focus.reason.self'
  | 'focus.reason.other'
  | 'break.title'
  | 'break.subtitle'
  | 'break.shortBreak'
  | 'break.afterSession'
  | 'break.next'
  | 'break.startAnother'
  | 'break.nextTomato'
  | 'break.doneForNow'
  | 'tasks.title'
  | 'tasks.subtitle'
  | 'tasks.quickAddPlaceholder'
  | 'tasks.quickAdd'
  | 'tasks.backlog'
  | 'tasks.completed'
  | 'tasks.add'
  | 'tasks.estimateLabel'
  | 'tasks.estimateHint'
  | 'tasks.completedLabel'
  | 'tasks.completedHint'
  | 'tasks.decreaseEstimate'
  | 'tasks.increaseEstimate'
  | 'tasks.emptyTitle'
  | 'tasks.emptyCopy'
  | 'tasks.moveToToday'
  | 'tasks.setFocus'
  | 'tasks.markComplete'
  | 'tasks.archive'
  | 'insights.title'
  | 'insights.subtitle'
  | 'insights.today'
  | 'insights.gentleHero'
  | 'insights.currentHero'
  | 'insights.completedTomatoes'
  | 'insights.completedTomatoesHint'
  | 'insights.completedTasks'
  | 'insights.completedTasksHint'
  | 'insights.currentStreak'
  | 'insights.currentStreakHint'
  | 'insights.interruptions'
  | 'insights.interruptionsHint'
  | 'insights.focusTimeHint'
  | 'insights.planChart'
  | 'insights.planChartMeta'
  | 'insights.done'
  | 'insights.planned'
  | 'insights.weeklyFocus'
  | 'insights.weeklyFocusMeta'
  | 'insights.focusSessions'
  | 'insights.interruptionChart'
  | 'insights.interruptionChartMeta'
  | 'insights.noInterruptions'
  | 'insights.taskDetails'
  | 'insights.taskDetailsMeta'
  | 'insights.noTaskDetails'
  | 'insights.reason.phone'
  | 'insights.reason.message'
  | 'insights.reason.people'
  | 'insights.reason.self'
  | 'insights.reason.other'
  | 'insights.minutesShort'
  | 'insights.starting'
  | 'insights.dayStreak'
  | 'insights.taskProgress'
  | 'insights.weeklyRhythm'
  | 'insights.lightPreview'
  | 'insights.simpleRead'
  | 'insights.oneTaskPlan'
  | 'insights.manyTasksPlan'
  | 'insights.beyondPlan';

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    'common.back': 'Back',
    'common.settings': 'Settings',
    'nav.today': 'Today',
    'nav.tasks': 'Tasks',
    'nav.insights': 'Insights',
    'settings.title': 'Settings',
    'settings.subtitle': 'Shape your focus rhythm.',
    'settings.focusRhythm': 'Focus rhythm',
    'settings.focusDuration': 'Focus duration',
    'settings.shortBreak': 'Short break',
    'settings.longBreak': 'Long break',
    'settings.longBreakInterval': 'Long break interval',
    'settings.experience': 'Experience',
    'settings.reducedMotion': 'Reduced motion',
    'settings.reducedMotionHint': 'Keep movement gentle and minimal.',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.languageHint': 'Use your device language or choose one.',
    'settings.language.system': 'System',
    'settings.language.en': 'English',
    'settings.language.zhHans': '简体中文',
    'settings.theme.system': 'System',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.reset': 'Reset to defaults',
    'settings.unit.min': 'min',
    'settings.unit.tomatoes': 'tomatoes',
    'settings.decrease': 'Decrease',
    'settings.increase': 'Increase',
    'today.title': "Today's Focus",
    'today.completed': 'Tomatoes completed today',
    'today.currentTomato': 'Current Tomato',
    'today.startTomato': 'Start Tomato',
    'today.continueTomato': 'Continue Tomato',
    'today.savedTimerBadge': 'Saved',
    'today.savedTimerNote': '{time} left from your saved tomato.',
    'today.preparingTitle': 'Preparing your focus rhythm...',
    'today.preparingCopy': 'Small steps count.',
    'today.blankTitle': 'Your day is a blank slate.',
    'today.blankCopy': 'Add one small task to begin.',
    'today.addTask': 'Add a task',
    'today.upNext': 'Up Next',
    'today.keepLight': 'Keep it light',
    'today.noNextTitle': 'No next task yet.',
    'today.noNextCopy': 'Keep one tomato in focus.',
    'greeting.morning': 'Good morning',
    'greeting.afternoon': 'Good afternoon',
    'greeting.evening': 'Good evening',
    'task.currentFocus': 'Current focus',
    'task.savedForLater': 'Saved for later',
    'task.today': 'Today',
    'task.backlog': 'Backlog',
    'task.done': 'Done',
    'task.archived': 'Archived',
    'task.readyNow': 'Ready now',
    'tomato.noEstimate': 'No estimate',
    'tomato.completed': 'completed',
    'tomato.estimated': 'Estimated',
    'tomato.tomatoes': 'tomatoes',
    'tomato.goal': 'Goal',
    'tomato.beyondGoal': 'beyond goal',
    'focus.sessionOf': 'Focus session {current} of {total}',
    'focus.pause': 'Pause',
    'focus.resume': 'Resume',
    'focus.interrupted': 'Interrupted',
    'focus.saveForLater': 'Save for later',
    'focus.devComplete': 'Dev: Complete session',
    'focus.interruptionTitle': 'What interrupted your focus?',
    'focus.interruptionSupport': "This won't break your streak.",
    'focus.reason.phone': 'Phone',
    'focus.reason.message': 'Message',
    'focus.reason.people': 'People',
    'focus.reason.self': 'Self-distraction',
    'focus.reason.other': 'Other',
    'break.title': 'Time to breathe.',
    'break.subtitle': 'Let your attention settle before the next tomato.',
    'break.shortBreak': 'Short Break',
    'break.afterSession': 'After focus session {current}',
    'break.next': 'Next',
    'break.startAnother': 'Start another focus session',
    'break.nextTomato': 'Start next tomato',
    'break.doneForNow': 'Done for now',
    'tasks.title': 'Tasks',
    'tasks.subtitle': 'Plan lightly. Focus clearly.',
    'tasks.quickAddPlaceholder': 'Add a small task',
    'tasks.quickAdd': 'Quick add',
    'tasks.backlog': 'Backlog',
    'tasks.completed': 'Completed',
    'tasks.add': 'Add',
    'tasks.estimateLabel': 'Planned tomatoes',
    'tasks.estimateHint': 'Estimate how many focus rounds this task needs.',
    'tasks.completedLabel': 'Completed tomatoes',
    'tasks.completedHint': 'This increases automatically when a focus session finishes.',
    'tasks.decreaseEstimate': 'Decrease planned tomatoes',
    'tasks.increaseEstimate': 'Increase planned tomatoes',
    'tasks.emptyTitle': 'No tasks here yet.',
    'tasks.emptyCopy': 'Add a small task and keep the plan light.',
    'tasks.moveToToday': 'Move to Today',
    'tasks.setFocus': 'Set Focus',
    'tasks.markComplete': 'Mark Complete',
    'tasks.archive': 'Archive',
    'insights.title': 'Insights',
    'insights.subtitle': 'Your rhythm is starting to form.',
    'insights.today': 'Today',
    'insights.gentleHero': 'Small steps count. Keep going gently.',
    'insights.currentHero': 'Small steps count. Your current focus is {title}.',
    'insights.completedTomatoes': 'Completed tomatoes',
    'insights.completedTomatoesHint': 'Focus sessions finished today.',
    'insights.completedTasks': 'Completed tasks',
    'insights.completedTasksHint': 'Tasks marked done today.',
    'insights.currentStreak': 'Current streak',
    'insights.currentStreakHint': 'A completed focus session keeps it alive.',
    'insights.interruptions': 'Interruptions noted',
    'insights.interruptionsHint': 'Interruptions logged during today\'s focus.',
    'insights.focusTimeHint': 'Actual focused minutes completed today.',
    'insights.planChart': 'Today plan completion',
    'insights.planChartMeta': '{done} done · {planned} planned',
    'insights.done': 'Done',
    'insights.planned': 'Planned',
    'insights.weeklyFocus': 'Weekly focus chart',
    'insights.weeklyFocusMeta': '{tomatoes} tomatoes · {minutes} focused',
    'insights.focusSessions': 'focus sessions',
    'insights.interruptionChart': 'Interruption pattern',
    'insights.interruptionChartMeta': 'Today by reason',
    'insights.noInterruptions': 'No interruptions logged today.',
    'insights.taskDetails': "Today's tasks",
    'insights.taskDetailsMeta': '{count} in plan',
    'insights.noTaskDetails': 'No planned tasks yet.',
    'insights.reason.phone': 'Phone',
    'insights.reason.message': 'Message',
    'insights.reason.people': 'People',
    'insights.reason.self': 'Self',
    'insights.reason.other': 'Other',
    'insights.minutesShort': '{count}m',
    'insights.starting': 'Starting',
    'insights.dayStreak': '1 day streak',
    'insights.taskProgress': 'Task progress',
    'insights.weeklyRhythm': 'Weekly rhythm',
    'insights.lightPreview': 'Light preview',
    'insights.simpleRead': 'This is a simple read on completed focus sessions for now.',
    'insights.oneTaskPlan': "1 task is part of today's plan.",
    'insights.manyTasksPlan': "{count} tasks are part of today's plan.",
    'insights.beyondPlan': "You went beyond today's plan.",
  },
  'zh-Hans': {
    'common.back': '返回',
    'common.settings': '设置',
    'nav.today': '今天',
    'nav.tasks': '任务',
    'nav.insights': '回顾',
    'settings.title': '设置',
    'settings.subtitle': '调整你的专注节奏。',
    'settings.focusRhythm': '专注节奏',
    'settings.focusDuration': '专注时长',
    'settings.shortBreak': '短休息',
    'settings.longBreak': '长休息',
    'settings.longBreakInterval': '长休息间隔',
    'settings.experience': '体验',
    'settings.reducedMotion': '减少动态效果',
    'settings.reducedMotionHint': '让动效更轻、更少。',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.languageHint': '跟随系统，或手动选择语言。',
    'settings.language.system': '跟随系统',
    'settings.language.en': 'English',
    'settings.language.zhHans': '简体中文',
    'settings.theme.system': '跟随系统',
    'settings.theme.light': '浅色',
    'settings.theme.dark': '深色',
    'settings.reset': '恢复默认设置',
    'settings.unit.min': '分钟',
    'settings.unit.tomatoes': '个番茄',
    'settings.decrease': '减少',
    'settings.increase': '增加',
    'today.title': '今天的专注',
    'today.completed': '今天已完成番茄',
    'today.currentTomato': '当前番茄',
    'today.startTomato': '开始番茄',
    'today.continueTomato': '继续番茄',
    'today.savedTimerBadge': '已保存',
    'today.savedTimerNote': '上次番茄还剩 {time}。',
    'today.preparingTitle': '正在准备你的专注节奏...',
    'today.preparingCopy': '小步前进也算数。',
    'today.blankTitle': '今天还没有安排。',
    'today.blankCopy': '先添加一个小任务。',
    'today.addTask': '添加任务',
    'today.upNext': '接下来',
    'today.keepLight': '保持轻量',
    'today.noNextTitle': '还没有下一个任务。',
    'today.noNextCopy': '一次只专注一个番茄。',
    'greeting.morning': '早上好',
    'greeting.afternoon': '下午好',
    'greeting.evening': '晚上好',
    'task.currentFocus': '当前专注',
    'task.savedForLater': '稍后继续',
    'task.today': '今天',
    'task.backlog': '待安排',
    'task.done': '已完成',
    'task.archived': '已归档',
    'task.readyNow': '已准备',
    'tomato.noEstimate': '未估算',
    'tomato.completed': '已完成',
    'tomato.estimated': '预计',
    'tomato.tomatoes': '个番茄',
    'tomato.goal': '目标',
    'tomato.beyondGoal': '超出目标',
    'focus.sessionOf': '第 {current} / {total} 轮专注',
    'focus.pause': '暂停',
    'focus.resume': '继续',
    'focus.interrupted': '被打断',
    'focus.saveForLater': '稍后继续',
    'focus.devComplete': '开发：完成本轮',
    'focus.interruptionTitle': '这次专注被什么打断了？',
    'focus.interruptionSupport': '记录下来，不会影响你的连续专注。',
    'focus.reason.phone': '电话',
    'focus.reason.message': '消息',
    'focus.reason.people': '他人打断',
    'focus.reason.self': '自己分心',
    'focus.reason.other': '其他',
    'break.title': '休息一下。',
    'break.subtitle': '让注意力慢慢沉下来，再开始下一个番茄。',
    'break.shortBreak': '短休息',
    'break.afterSession': '完成第 {current} 轮专注后',
    'break.next': '下一项',
    'break.startAnother': '再开始一轮专注',
    'break.nextTomato': '开始下一个番茄',
    'break.doneForNow': '今天先到这里',
    'tasks.title': '任务',
    'tasks.subtitle': '轻量计划，清晰专注。',
    'tasks.quickAddPlaceholder': '添加一个小任务',
    'tasks.quickAdd': '快速添加',
    'tasks.backlog': '待安排',
    'tasks.completed': '已完成',
    'tasks.add': '添加',
    'tasks.estimateLabel': '预计番茄',
    'tasks.estimateHint': '用来估算这个任务大约需要几轮专注。',
    'tasks.completedLabel': '已完成番茄',
    'tasks.completedHint': '完成一轮专注后会自动增加。',
    'tasks.decreaseEstimate': '减少预计番茄',
    'tasks.increaseEstimate': '增加预计番茄',
    'tasks.emptyTitle': '这里还没有任务。',
    'tasks.emptyCopy': '添加一个小任务，让计划保持轻量。',
    'tasks.moveToToday': '移到今天',
    'tasks.setFocus': '设为专注',
    'tasks.markComplete': '标记完成',
    'tasks.archive': '归档',
    'insights.title': '回顾',
    'insights.subtitle': '你的节奏正在慢慢形成。',
    'insights.today': '今天',
    'insights.gentleHero': '小步前进也算数。温和地继续。',
    'insights.currentHero': '小步前进也算数。当前专注是 {title}。',
    'insights.completedTomatoes': '已完成番茄',
    'insights.completedTomatoesHint': '今天完成的专注轮数。',
    'insights.completedTasks': '已完成任务',
    'insights.completedTasksHint': '今天标记完成的任务数。',
    'insights.currentStreak': '当前连续',
    'insights.currentStreakHint': '今天完成专注后会延续。',
    'insights.interruptions': '记录的打断',
    'insights.interruptionsHint': '今天专注中记录的打断次数。',
    'insights.focusTimeHint': '今天已完成的实际专注时间。',
    'insights.planChart': '今日计划完成度',
    'insights.planChartMeta': '已完成 {done} · 计划 {planned}',
    'insights.done': '已完成',
    'insights.planned': '计划内',
    'insights.weeklyFocus': '本周专注图',
    'insights.weeklyFocusMeta': '{tomatoes} 个番茄 · 专注 {minutes}',
    'insights.focusSessions': '轮专注',
    'insights.interruptionChart': '打断分布',
    'insights.interruptionChartMeta': '按今天记录的原因',
    'insights.noInterruptions': '今天还没有记录打断。',
    'insights.taskDetails': '今日任务明细',
    'insights.taskDetailsMeta': '计划内 {count} 个',
    'insights.noTaskDetails': '今天还没有计划任务。',
    'insights.reason.phone': '电话',
    'insights.reason.message': '消息',
    'insights.reason.people': '他人',
    'insights.reason.self': '自己',
    'insights.reason.other': '其他',
    'insights.minutesShort': '{count} 分钟',
    'insights.starting': '刚开始',
    'insights.dayStreak': '连续 1 天',
    'insights.taskProgress': '任务进度',
    'insights.weeklyRhythm': '本周节奏',
    'insights.lightPreview': '轻量预览',
    'insights.simpleRead': '这里先简单展示已完成的专注次数。',
    'insights.oneTaskPlan': '今天计划里有 1 个任务。',
    'insights.manyTasksPlan': '今天计划里有 {count} 个任务。',
    'insights.beyondPlan': '你已经超过了今天的计划。',
  },
};

function getDeviceLanguage(): AppLanguage {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;

    return locale.toLowerCase().startsWith('zh') ? 'zh-Hans' : 'en';
  } catch {
    return 'en';
  }
}

export function resolveLanguage(language: OneTomatoLanguage): AppLanguage {
  return language === 'system' ? getDeviceLanguage() : language;
}

export function translate(
  language: AppLanguage,
  key: TranslationKey,
  replacements: Record<string, string | number> = {}
) {
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    translations[language][key]
  );
}
