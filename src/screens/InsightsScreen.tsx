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
import { getWeekdayLabel } from '../utils/dateLabels';

function isSameDay(timestamp: number, reference: Date) {
  const date = new Date(timestamp);

  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function formatFocusTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function shouldUseGentleFocusCopy(title?: string) {
  const trimmedTitle = title?.trim() ?? '';

  return trimmedTitle.length < 3 || /^\d+$/.test(trimmedTitle);
}

export function InsightsScreen() {
  const theme = useAppTheme();
  const { language, t } = useTranslation();
  const { completedSessions, interruptions } = usePomodoro();
  const { completedTasks, todayTasks, currentTask } = useTasks();

  const insights = useMemo(() => {
    const today = new Date();
    const focusSessionsToday = completedSessions.filter(
      session =>
        session.mode === 'focus' &&
        session.status === 'completed' &&
        isSameDay(session.startedAt, today)
    );
    const interruptionsToday = interruptions.filter(interruption =>
      isSameDay(interruption.createdAt, today)
    );
    const completedTodayTasks = completedTasks.filter(task =>
      task.completedAt ? isSameDay(task.completedAt, today) : false
    );
    const focusTimeToday = focusSessionsToday.reduce(
      (total, session) => total + session.actualDuration,
      0
    );
    const rawTaskProgress =
      todayTasks.length > 0
        ? Math.round((completedTodayTasks.length / todayTasks.length) * 100)
        : 0;
    const taskProgress = Math.min(rawTaskProgress, 100);

    const weeklyRhythm = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));

      return {
        key: day.toISOString(),
        label: getWeekdayLabel(day, language === 'zh-Hans' ? 'zh-CN' : 'en-US'),
        count: completedSessions.filter(
          session =>
            session.mode === 'focus' &&
            session.status === 'completed' &&
            isSameDay(session.startedAt, day)
        ).length,
      };
    });

    return {
      focusTimeToday,
      completedTomatoes: focusSessionsToday.length,
      completedTasks: completedTodayTasks.length,
      currentStreak: focusSessionsToday.length > 0 ? t('insights.dayStreak') : t('insights.starting'),
      interruptionCount: interruptionsToday.length,
      taskProgress,
      wentBeyondPlan: rawTaskProgress > 100,
      weeklyRhythm,
    };
  }, [completedSessions, completedTasks, interruptions, language, t, todayTasks]);

  const maxWeeklyCount = Math.max(1, ...insights.weeklyRhythm.map(day => day.count));
  const taskPlanText = todayTasks.length === 1
    ? t('insights.oneTaskPlan')
    : t('insights.manyTasksPlan', { count: todayTasks.length });
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
          <Text style={[styles.heroValue, { color: theme.colors.text }]}>{formatFocusTime(insights.focusTimeToday)}</Text>
          <Text style={[styles.heroText, { color: theme.colors.muted }]}>
            {heroCopy}
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard label={t('insights.completedTomatoes')} value={String(insights.completedTomatoes)} />
          <MetricCard label={t('insights.completedTasks')} value={String(insights.completedTasks)} />
          <MetricCard label={t('insights.currentStreak')} value={insights.currentStreak} />
          <MetricCard label={t('insights.interruptions')} value={String(insights.interruptionCount)} />
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
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('insights.taskProgress')}</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.primaryHover }]}>{insights.taskProgress}%</Text>
          </View>
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
          <Text style={[styles.sectionText, { color: theme.colors.muted }]}>
            {insights.wentBeyondPlan ? t('insights.beyondPlan') : taskPlanText}
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
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('insights.weeklyRhythm')}</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.primaryHover }]}>{t('insights.lightPreview')}</Text>
          </View>
          <View style={styles.rhythmRow}>
            {insights.weeklyRhythm.map(day => (
              <View key={day.key} style={styles.rhythmItem}>
                <View style={[styles.rhythmBarTrack, { backgroundColor: theme.colors.surfaceSoft }]}>
                  <View
                    style={[
                      styles.rhythmBar,
                      {
                        height: `${Math.max(12, (day.count / maxWeeklyCount) * 100)}%`,
                        backgroundColor: theme.colors.accent,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.rhythmLabel, { color: theme.colors.muted }]}>{day.label}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.sectionText, { color: theme.colors.muted }]}>
            {t('insights.simpleRead')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
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
      <Text style={[styles.metricLabel, { color: theme.colors.muted }]}>{label}</Text>
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
    marginBottom: 10,
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
    minHeight: 104,
    borderRadius: tokens.radius.modal,
    padding: 16,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    justifyContent: 'space-between',
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
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
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
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  sectionMeta: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  progressTrack: {
    height: 12,
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
    height: 126,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  rhythmItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  rhythmBarTrack: {
    width: '100%',
    height: 92,
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
  rhythmLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
});
