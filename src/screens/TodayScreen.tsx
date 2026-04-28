import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrentTaskHeroCard } from '../components/CurrentTaskHeroCard';
import { SegmentedProgressBar } from '../components/SegmentedProgressBar';
import { TomatoDots } from '../components/TomatoDots';
import { useAppTheme } from '../hooks/useAppTheme';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTasks } from '../hooks/useTasks';
import { RootStackParamList } from '../navigation/types';
import { tokens } from '../theme/tokens';
import { getTimeOfDayGreeting } from '../utils/dateLabels';
import { formatDailyGoalProgress } from '../utils/tomatoProgress';

export function TodayScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { completedSessions, dailyGoal, startTomato } = usePomodoro();
  const {
    currentTask,
    todayTasks,
    upNextTasks,
    isHydrated,
    setCurrentTask,
  } = useTasks();

  const completedToday = completedSessions.filter(
    session => session.mode === 'focus' && session.status === 'completed'
  ).length;
  const dailyProgress = formatDailyGoalProgress(completedToday, dailyGoal);

  const focusTask = currentTask ?? todayTasks[0] ?? null;
  const displayedUpNextTasks = focusTask
    ? upNextTasks.filter(task => task.id !== focusTask.id)
    : upNextTasks;

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View
        style={[styles.backgroundBloomTop, { backgroundColor: theme.colors.bloomTop }]}
        pointerEvents="none"
      />
      <View
        style={[styles.backgroundBloomBottom, { backgroundColor: theme.colors.bloomBottom }]}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={[styles.greeting, { color: theme.colors.muted }]}>{getTimeOfDayGreeting()}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => navigation.navigate('Settings')}
              style={({ pressed }) => [
                styles.settingsButton,
                {
                  backgroundColor: theme.colors.cardTranslucent,
                  borderColor: theme.colors.outline,
                },
                pressed && styles.settingsButtonPressed,
              ]}
            >
              <Text style={[styles.settingsButtonText, { color: theme.colors.muted }]}>Settings</Text>
            </Pressable>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Today&apos;s Focus</Text>
        </View>

        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: theme.colors.cardStrong,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme.colors.muted }]}>Tomatoes completed today</Text>
            <View style={styles.progressSummaryRow}>
              <Text style={[styles.progressValue, { color: theme.colors.text }]}>{dailyProgress.primaryText}</Text>
              {dailyProgress.secondaryText ? (
                <Text style={[styles.progressSecondary, { color: theme.colors.primaryHover }]}>
                  {dailyProgress.secondaryText}
                </Text>
              ) : null}
            </View>
          </View>
          <SegmentedProgressBar total={dailyProgress.total} completed={dailyProgress.completed} />
        </View>

        {!isHydrated ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text style={[styles.stateTitle, { color: theme.colors.text }]}>Preparing your focus rhythm...</Text>
            <Text style={[styles.stateCopy, { color: theme.colors.muted }]}>Small steps count.</Text>
          </View>
        ) : focusTask ? (
          <>
            <CurrentTaskHeroCard
              label="Current Tomato"
              title={focusTask.title}
              description={focusTask.description ?? ''}
              completedTomatoes={focusTask.completedTomatoes}
              totalTomatoes={focusTask.estimatedTomatoes}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityHint="Starts one pomodoro for the current task"
              accessibilityLabel="Start Tomato"
              onPress={() => {
                setCurrentTask(focusTask.id);
                startTomato(focusTask);
                navigation.navigate('Focus');
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.colors.primary },
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <View style={[styles.primaryButtonIndicator, { backgroundColor: theme.colors.onPrimary }]} />
              <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>Start Tomato</Text>
            </Pressable>
          </>
        ) : (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text style={[styles.stateTitle, { color: theme.colors.text }]}>Your day is a blank slate.</Text>
            <Text style={[styles.stateCopy, { color: theme.colors.muted }]}>Add one small task to begin.</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add a task"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Tasks' })}
              style={({ pressed }) => [
                styles.emptyAction,
                { backgroundColor: theme.colors.primary },
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={[styles.emptyActionText, { color: theme.colors.onPrimary }]}>Add a task</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.upNextSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Up Next</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.muted }]}>Keep it light</Text>
          </View>

          <View style={styles.queue}>
            {displayedUpNextTasks.length === 0 ? (
              <View
                style={[
                  styles.upNextEmptyCard,
                  {
                    backgroundColor: theme.colors.cardTranslucent,
                    borderColor: theme.colors.outline,
                  },
                ]}
              >
                <Text style={[styles.upNextEmptyTitle, { color: theme.colors.text }]}>No next task yet.</Text>
                <Text style={[styles.upNextEmptyCopy, { color: theme.colors.muted }]}>Keep one tomato in focus.</Text>
              </View>
            ) : (
              displayedUpNextTasks.map((task, index) => (
                <View
                  key={task.id}
                  style={[
                    styles.queueCard,
                    {
                      backgroundColor: theme.colors.cardTranslucent,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                >
                  <View style={styles.queueTextWrap}>
                    <Text style={[styles.queueTitle, { color: theme.colors.text }]}>{task.title}</Text>
                    <TomatoDots
                      total={task.estimatedTomatoes}
                      completed={task.completedTomatoes}
                      size="sm"
                      showLabel
                    />
                  </View>
                  <View style={[styles.queueIndex, { backgroundColor: theme.colors.surfaceSoft }]}>
                    <Text style={[styles.queueIndexText, { color: theme.colors.primaryHover }]}>#{index + 1}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 20,
  },
  backgroundBloomTop: {
    position: 'absolute',
    top: -30,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: tokens.colors.bloomTop,
    opacity: 0.85,
  },
  backgroundBloomBottom: {
    position: 'absolute',
    bottom: 120,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: tokens.colors.bloomBottom,
    opacity: 0.75,
  },
  header: {
    marginBottom: 4,
  },
  headerTopRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  greeting: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  settingsButton: {
    minHeight: 44,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.cardTranslucent,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonPressed: {
    opacity: 0.9,
  },
  settingsButtonText: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  title: {
    fontSize: tokens.typography.title,
    lineHeight: 38,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: tokens.colors.cardStrong,
    borderRadius: tokens.radius.modal,
    padding: 18,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  progressHeader: {
    gap: 8,
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  progressSummaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressSecondary: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  progressValue: {
    fontSize: 21,
    lineHeight: 26,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  stateCard: {
    borderRadius: tokens.radius.hero,
    padding: tokens.spacing.md,
    borderWidth: 1,
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.outline,
    gap: 12,
    ...tokens.shadow,
  },
  stateTitle: {
    fontSize: 26,
    lineHeight: 32,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  stateCopy: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  emptyAction: {
    minHeight: 52,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.primary,
    marginTop: 6,
  },
  emptyActionText: {
    fontSize: tokens.typography.button,
    color: tokens.colors.onPrimary,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...tokens.shadow,
  },
  primaryButtonPressed: {
    opacity: 0.94,
  },
  primaryButtonIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: tokens.colors.onPrimary,
  },
  primaryButtonText: {
    fontSize: tokens.typography.button,
    color: tokens.colors.onPrimary,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  upNextSection: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  sectionMeta: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  queue: {
    gap: 12,
  },
  upNextEmptyCard: {
    borderRadius: tokens.radius.modal,
    padding: 18,
    borderWidth: 1,
    backgroundColor: tokens.colors.cardTranslucent,
    borderColor: tokens.colors.outline,
    gap: 6,
  },
  upNextEmptyTitle: {
    fontSize: 17,
    lineHeight: 22,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  upNextEmptyCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: tokens.colors.cardTranslucent,
    borderRadius: tokens.radius.modal,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  queueIndex: {
    minWidth: 38,
    height: 30,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  queueIndexText: {
    fontSize: 12,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  queueTextWrap: {
    flex: 1,
    gap: 8,
  },
  queueTitle: {
    fontSize: 17,
    lineHeight: 23,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
});
