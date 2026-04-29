import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTasks } from '../hooks/useTasks';
import { useTranslation } from '../hooks/useTranslation';
import { tokens } from '../theme/tokens';
import { TranslationKey } from '../i18n/translations';
import { InterruptionReason } from '../types/pomodoro';
import { getWeekdayLabel } from '../utils/dateLabels';

const INTERRUPTION_REASONS: InterruptionReason[] = [
  'phone',
  'message',
  'people',
  'self_distraction',
  'other',
];

function isSameDay(timestamp: number, reference: Date) {
  const date = new Date(timestamp);

  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function formatFocusTime(seconds: number, language: 'en' | 'zh-Hans') {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (language === 'zh-Hans') {
    return hours > 0 ? `${hours}小时 ${minutes}分钟` : `${minutes}分钟`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function shouldUseGentleFocusCopy(title?: string) {
  const trimmedTitle = title?.trim() ?? '';

  return trimmedTitle.length < 3 || /^\d+$/.test(trimmedTitle);
}

function getReasonLabelKey(reason: InterruptionReason): TranslationKey {
  switch (reason) {
    case 'phone':
      return 'insights.reason.phone';
    case 'message':
      return 'insights.reason.message';
    case 'people':
      return 'insights.reason.people';
    case 'self_distraction':
      return 'insights.reason.self';
    default:
      return 'insights.reason.other';
  }
}

export function InsightsScreen() {
  const theme = useAppTheme();
  const { language, t } = useTranslation();
  const { completedSessions, interruptions } = usePomodoro();
  const { completedTasks, todayTasks, currentTask } = useTasks();

  const insights = useMemo(() => {
    const today = new Date();
    const focusSessions = completedSessions.filter(
      session => session.mode === 'focus' && session.status === 'completed'
    );
    const focusSessionsToday = focusSessions.filter(session =>
      isSameDay(session.startedAt, today)
    );
    const interruptionsToday = interruptions.filter(interruption =>
      isSameDay(interruption.createdAt, today)
    );
    const completedTodayTasks = completedTasks.filter(task =>
      task.completedAt ? isSameDay(task.completedAt, today) : false
    );
    const plannedTaskCount = todayTasks.length + completedTodayTasks.length;
    const taskProgress = plannedTaskCount > 0
      ? Math.min(100, Math.round((completedTodayTasks.length / plannedTaskCount) * 100))
      : 0;
    const focusTimeToday = focusSessionsToday.reduce(
      (total, session) => total + session.actualDuration,
      0
    );

    const weeklyRhythm = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));

      const sessions = focusSessions.filter(session => isSameDay(session.startedAt, day));
      const focusSeconds = sessions.reduce(
        (total, session) => total + session.actualDuration,
        0
      );

      return {
        key: day.toISOString(),
        label: getWeekdayLabel(day, language === 'zh-Hans' ? 'zh-CN' : 'en-US'),
        count: sessions.length,
        focusSeconds,
      };
    });

    const interruptionBreakdown = INTERRUPTION_REASONS.map(reason => ({
      reason,
      count: interruptionsToday.filter(interruption => interruption.reason === reason).length,
    }));

    return {
      focusTimeToday,
      completedTomatoes: focusSessionsToday.length,
      completedTasks: completedTodayTasks.length,
      plannedTaskCount,
      currentStreak: focusSessionsToday.length > 0 ? t('insights.dayStreak') : t('insights.starting'),
      interruptionCount: interruptionsToday.length,
      taskProgress,
      weeklyRhythm,
      weeklyTomatoes: weeklyRhythm.reduce((total, day) => total + day.count, 0),
      weeklyFocusSeconds: weeklyRhythm.reduce((total, day) => total + day.focusSeconds, 0),
      interruptionBreakdown,
    };
  }, [completedSessions, completedTasks, interruptions, language, t, todayTasks]);

  const maxWeeklySeconds = Math.max(1, ...insights.weeklyRhythm.map(day => day.focusSeconds));
  const maxInterruptionCount = Math.max(1, ...insights.interruptionBreakdown.map(item => item.count));
  const heroCopy = currentTask && !shouldUseGentleFocusCopy(currentTask.title)
    ? t('insights.currentHero', { title: currentTask.title })
    : t('insights.gentleHero');

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBloom, { backgroundColor: theme.colors.bloomTop }]} pointerEvents="none" />
      <View style={[styles.bottomBloom, { backgroundColor: theme.colors.bloomBottom }]} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t('insights.title')}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{t('insights.subtitle')}</Text>
        </View>

        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <Text style={[styles.heroLabel, { color: theme.colors.primaryHover }]}>{t('insights.today')}</Text>
          <Text style={[styles.heroValue, { color: theme.colors.text }]}>
            {formatFocusTime(insights.focusTimeToday, language)}
          </Text>
          <Text style={[styles.heroHint, { color: theme.colors.muted }]}>{t('insights.focusTimeHint')}</Text>
          <Text style={[styles.heroText, { color: theme.colors.muted }]}>{heroCopy}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            label={t('insights.completedTomatoes')}
            value={String(insights.completedTomatoes)}
            hint={t('insights.completedTomatoesHint')}
          />
          <MetricCard
            label={t('insights.completedTasks')}
            value={`${insights.completedTasks}/${insights.plannedTaskCount}`}
            hint={t('insights.completedTasksHint')}
          />
          <MetricCard
            label={t('insights.currentStreak')}
            value={insights.currentStreak}
            hint={t('insights.currentStreakHint')}
          />
          <MetricCard
            label={t('insights.interruptions')}
            value={String(insights.interruptionCount)}
            hint={t('insights.interruptionsHint')}
          />
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.cardTranslucent,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('insights.planChart')}</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.primaryHover }]}>
              {t('insights.planChartMeta', {
                done: insights.completedTasks,
                planned: insights.plannedTaskCount,
              })}
            </Text>
          </View>
          <View style={styles.planRow}>
            <Text style={[styles.planLabel, { color: theme.colors.muted }]}>{t('insights.done')}</Text>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceSoft }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${insights.taskProgress}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.planValue, { color: theme.colors.text }]}>{insights.taskProgress}%</Text>
          </View>
          <Text style={[styles.sectionText, { color: theme.colors.muted }]}>
            {insights.plannedTaskCount === 0
              ? t('insights.manyTasksPlan', { count: 0 })
              : insights.plannedTaskCount === 1
                ? t('insights.oneTaskPlan')
                : t('insights.manyTasksPlan', { count: insights.plannedTaskCount })}
          </Text>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.cardTranslucent,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('insights.weeklyFocus')}</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.primaryHover }]}>
              {t('insights.weeklyFocusMeta', {
                tomatoes: insights.weeklyTomatoes,
                minutes: formatFocusTime(insights.weeklyFocusSeconds, language),
              })}
            </Text>
          </View>
          <View style={styles.rhythmRow}>
            {insights.weeklyRhythm.map(day => (
              <View key={day.key} style={styles.rhythmItem}>
                <View style={[styles.rhythmBarTrack, { backgroundColor: theme.colors.surfaceSoft }]}>
                  <View
                    style={[
                      styles.rhythmBar,
                      {
                        height: `${Math.max(8, (day.focusSeconds / maxWeeklySeconds) * 100)}%`,
                        backgroundColor: theme.colors.accent,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.rhythmCount, { color: theme.colors.text }]}>{day.count}</Text>
                <Text style={[styles.rhythmLabel, { color: theme.colors.muted }]}>{day.label}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.sectionText, { color: theme.colors.muted }]}>
            {t('insights.simpleRead')}
          </Text>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.cardTranslucent,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('insights.interruptionChart')}</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.primaryHover }]}>
              {t('insights.interruptionChartMeta')}
            </Text>
          </View>
          {insights.interruptionCount === 0 ? (
            <Text style={[styles.sectionText, { color: theme.colors.muted }]}>
              {t('insights.noInterruptions')}
            </Text>
          ) : (
            <View style={styles.interruptionList}>
              {insights.interruptionBreakdown.map(item => (
                <View key={item.reason} style={styles.interruptionRow}>
                  <Text style={[styles.interruptionLabel, { color: theme.colors.text }]}>
                    {t(getReasonLabelKey(item.reason))}
                  </Text>
                  <View style={[styles.interruptionTrack, { backgroundColor: theme.colors.surfaceSoft }]}>
                    <View
                      style={[
                        styles.interruptionFill,
                        {
                          width: `${Math.max(4, (item.count / maxInterruptionCount) * 100)}%`,
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.interruptionValue, { color: theme.colors.muted }]}>
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  const theme = useAppTheme();
  const isLongValue = value.length > 6;

  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: theme.colors.cardTranslucent,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <Text style={[styles.metricValue, isLongValue && styles.metricValueCompact, { color: theme.colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.metricLabel, { color: theme.colors.text }]}>{label}</Text>
      <Text style={[styles.metricHint, { color: theme.colors.muted }]}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  topBloom: {
    position: 'absolute',
    top: -58,
    right: -44,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: tokens.colors.bloomTop,
    opacity: 0.78,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 82,
    left: -56,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: tokens.colors.bloomBottom,
    opacity: 0.7,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 18,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: tokens.typography.title,
    lineHeight: 38,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  heroCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.hero,
    padding: 24,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    ...tokens.shadow,
  },
  heroLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    marginBottom: 10,
  },
  heroValue: {
    fontSize: 46,
    lineHeight: 52,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroHint: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    marginBottom: 12,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 23,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 134,
    borderRadius: tokens.radius.modal,
    padding: 16,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    justifyContent: 'flex-start',
    gap: 7,
  },
  metricValue: {
    fontSize: 28,
    lineHeight: 34,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  metricValueCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  metricLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  metricHint: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  sectionCard: {
    borderRadius: tokens.radius.modal,
    padding: 18,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  sectionMeta: {
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    textAlign: 'right',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planLabel: {
    minWidth: 42,
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  planValue: {
    minWidth: 42,
    fontSize: 14,
    lineHeight: 18,
    color: tokens.colors.text,
    textAlign: 'right',
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  progressTrack: {
    flex: 1,
    height: 14,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.surfaceSoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.primary,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  rhythmRow: {
    height: 148,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  rhythmItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  rhythmBarTrack: {
    width: '100%',
    height: 98,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.surfaceSoft,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  rhythmBar: {
    width: '100%',
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.accent,
  },
  rhythmCount: {
    fontSize: 12,
    lineHeight: 15,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  rhythmLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  interruptionList: {
    gap: 12,
  },
  interruptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  interruptionLabel: {
    width: 74,
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  interruptionTrack: {
    flex: 1,
    height: 12,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.surfaceSoft,
    overflow: 'hidden',
  },
  interruptionFill: {
    height: '100%',
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.primary,
  },
  interruptionValue: {
    width: 24,
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    textAlign: 'right',
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
});
