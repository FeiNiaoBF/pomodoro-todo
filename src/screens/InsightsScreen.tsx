import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTasks } from '../hooks/useTasks';
import { tokens } from '../theme/tokens';

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

export function InsightsScreen() {
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
    const taskProgress =
      todayTasks.length > 0
        ? Math.round((completedTodayTasks.length / todayTasks.length) * 100)
        : 0;

    const weeklyRhythm = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));

      return {
        key: day.toISOString(),
        label: day.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1),
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
      currentStreak: focusSessionsToday.length > 0 ? '1 day' : 'Starting',
      interruptionCount: interruptionsToday.length,
      taskProgress,
      weeklyRhythm,
    };
  }, [completedSessions, completedTasks, interruptions, todayTasks]);

  const maxWeeklyCount = Math.max(1, ...insights.weeklyRhythm.map(day => day.count));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBloom} pointerEvents="none" />
      <View style={styles.bottomBloom} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Your rhythm is starting to form.</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Today</Text>
          <Text style={styles.heroValue}>{formatFocusTime(insights.focusTimeToday)}</Text>
          <Text style={styles.heroText}>
            {currentTask
              ? `Small steps count. Your current focus is ${currentTask.title}.`
              : 'Small steps count. Choose one task when you are ready.'}
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard label="Completed tomatoes" value={String(insights.completedTomatoes)} />
          <MetricCard label="Completed tasks" value={String(insights.completedTasks)} />
          <MetricCard label="Current streak" value={insights.currentStreak} />
          <MetricCard label="Interruptions noted" value={String(insights.interruptionCount)} />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Task progress</Text>
            <Text style={styles.sectionMeta}>{insights.taskProgress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${insights.taskProgress}%` }]} />
          </View>
          <Text style={styles.sectionText}>
            {todayTasks.length} tasks are part of today&apos;s plan.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly rhythm</Text>
            <Text style={styles.sectionMeta}>Light preview</Text>
          </View>
          <View style={styles.rhythmRow}>
            {insights.weeklyRhythm.map(day => (
              <View key={day.key} style={styles.rhythmItem}>
                <View style={styles.rhythmBarTrack}>
                  <View
                    style={[
                      styles.rhythmBar,
                      { height: `${Math.max(12, (day.count / maxWeeklyCount) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.rhythmLabel}>{day.label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.sectionText}>
            This is a simple read on completed focus sessions for now.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
    backgroundColor: '#FFE5DE',
    opacity: 0.78,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 82,
    left: -56,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFF1E8',
    opacity: 0.7,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
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
    borderColor: '#F0DDD8',
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
    backgroundColor: 'rgba(255, 253, 249, 0.88)',
    borderWidth: 1,
    borderColor: '#F0DED9',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 28,
    lineHeight: 34,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
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
    backgroundColor: 'rgba(255, 253, 249, 0.86)',
    borderWidth: 1,
    borderColor: '#F0DED9',
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
    backgroundColor: '#FFF3EF',
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
