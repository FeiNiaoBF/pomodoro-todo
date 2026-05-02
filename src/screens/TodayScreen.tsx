import React, { useEffect, useState } from 'react';
import {
  Platform,
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
import { useTranslation } from '../hooks/useTranslation';
import { RootStackParamList } from '../navigation/types';
import { tokens } from '../theme/tokens';
import { getTimeOfDayGreeting } from '../utils/dateLabels';
import { getTaskDisplayDescription, getTaskDisplayTitle } from '../utils/taskDisplay';
import { formatDailyGoalProgress } from '../utils/tomatoProgress';

function formatRemainingTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export function TodayScreen() {
  const theme = useAppTheme();
  const { language, t } = useTranslation();
  const webViewportWidth = useWebViewportWidth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { activeSession, completedSessions, dailyGoal, remainingSeconds, startTomato, status } = usePomodoro();
  const {
    currentTask,
    todayTasks,
    upNextTasks,
    isHydrated,
    moveTaskToBacklog,
    reorderTodayTask,
    setCurrentTask,
  } = useTasks();
  const [arrangingTaskId, setArrangingTaskId] = useState<string | null>(null);

  const completedToday = completedSessions.filter(
    session => session.mode === 'focus' && session.status === 'completed'
  ).length;
  const dailyProgress = formatDailyGoalProgress(completedToday, dailyGoal, language);

  const focusTask = currentTask ?? todayTasks[0] ?? null;
  const shouldContinueTomato =
    Boolean(focusTask) &&
    focusTask?.id === activeSession?.taskId &&
    (focusTask.state === 'paused' || status === 'saved_for_later' || status === 'paused');
  const startButtonLabel = shouldContinueTomato
    ? t('today.continueTomato')
    : t('today.startTomato');
  const savedTimerNote = shouldContinueTomato
    ? t('today.savedTimerNote', { time: formatRemainingTime(remainingSeconds) })
    : undefined;
  const displayedUpNextTasks = focusTask
    ? upNextTasks.filter(task => task.id !== focusTask.id)
    : upNextTasks;
  const hasCompletedToday = completedToday > 0;
  const arrangingTaskExists = displayedUpNextTasks.some(task => task.id === arrangingTaskId);
  const activeArrangingTaskId = arrangingTaskExists ? arrangingTaskId : null;
  const webContentWidth =
    Platform.OS === 'web' && webViewportWidth
      ? Math.max(280, Math.min(webViewportWidth - 40, 440))
      : undefined;
  const contentItemStyle = webContentWidth
    ? { width: webContentWidth, alignSelf: 'center' as const }
    : undefined;

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
        <View style={[styles.header, styles.contentItem, contentItemStyle]}>
          <View style={styles.headerTopRow}>
            <Text style={[styles.greeting, { color: theme.colors.muted }]}>{getTimeOfDayGreeting(new Date(), language)}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.settings')}
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
              <SettingsGlyph color={theme.colors.muted} />
            </Pressable>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t('today.title')}</Text>
        </View>

        {hasCompletedToday ? (
          <View
            style={[
              styles.progressCard,
              styles.contentItem,
              contentItemStyle,
              {
                backgroundColor: theme.colors.cardStrong,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: theme.colors.muted }]}>{t('today.completed')}</Text>
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
        ) : (
          <View
            style={[
              styles.firstStepCard,
              styles.contentItem,
              contentItemStyle,
              {
                backgroundColor: theme.colors.cardTranslucent,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text style={[styles.firstStepText, { color: theme.colors.muted }]}>{t('today.firstStepHint')}</Text>
          </View>
        )}

        {!isHydrated ? (
          <View
            style={[
              styles.stateCard,
              styles.contentItem,
              contentItemStyle,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text style={[styles.stateTitle, { color: theme.colors.text }]}>{t('today.preparingTitle')}</Text>
            <Text style={[styles.stateCopy, { color: theme.colors.muted }]}>{t('today.preparingCopy')}</Text>
          </View>
        ) : focusTask ? (
          <>
            <View style={[styles.contentItem, contentItemStyle]}>
              <CurrentTaskHeroCard
                label={t('today.currentTomato')}
                title={getTaskDisplayTitle(focusTask, language)}
                description={getTaskDisplayDescription(focusTask, language)}
                completedTomatoes={focusTask.completedTomatoes}
                totalTomatoes={focusTask.estimatedTomatoes}
                badgeText={shouldContinueTomato ? t('today.savedTimerBadge') : undefined}
                footerNote={savedTimerNote}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityHint={startButtonLabel}
              accessibilityLabel={startButtonLabel}
              onPress={() => {
                setCurrentTask(focusTask.id);
                startTomato(focusTask);
                navigation.navigate('Focus');
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.contentItem,
                contentItemStyle,
                { backgroundColor: theme.colors.primary },
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <View style={[styles.primaryButtonIndicator, { backgroundColor: theme.colors.onPrimary }]} />
              <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>{startButtonLabel}</Text>
            </Pressable>
          </>
        ) : (
          <View
            style={[
              styles.stateCard,
              styles.contentItem,
              contentItemStyle,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text style={[styles.stateTitle, { color: theme.colors.text }]}>{t('today.blankTitle')}</Text>
            <Text style={[styles.stateCopy, { color: theme.colors.muted }]}>{t('today.blankCopy')}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('today.addTask')}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Tasks' })}
              style={({ pressed }) => [
                styles.emptyAction,
                { backgroundColor: theme.colors.primary },
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={[styles.emptyActionText, { color: theme.colors.onPrimary }]}>{t('today.addTask')}</Text>
            </Pressable>
          </View>
        )}

        <View style={[styles.upNextSection, styles.contentItem, contentItemStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('today.upNext')}</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.muted }]}>
              {activeArrangingTaskId ? t('today.arrange') : t('today.keepLight')}
            </Text>
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
                <Text style={[styles.upNextEmptyTitle, { color: theme.colors.text }]}>{t('today.noNextTitle')}</Text>
                <Text style={[styles.upNextEmptyCopy, { color: theme.colors.muted }]}>{t('today.noNextCopy')}</Text>
              </View>
            ) : (
              displayedUpNextTasks.map((task, index) => {
                const todayTaskIndex = todayTasks.findIndex(item => item.id === task.id);
                const isArranging = activeArrangingTaskId === task.id;

                return (
                <Pressable
                  key={task.id}
                  accessibilityRole="button"
                  accessibilityLabel={getTaskDisplayTitle(task, language)}
                  onLongPress={() => setArrangingTaskId(task.id)}
                  delayLongPress={260}
                  style={({ pressed }) => [
                    styles.queueCard,
                    isArranging && styles.queueCardArranging,
                    {
                      backgroundColor: isArranging ? theme.colors.surface : theme.colors.cardTranslucent,
                      borderColor: isArranging ? theme.colors.primary : theme.colors.outline,
                    },
                    pressed && styles.queueCardPressed,
                  ]}
                >
                  <View style={styles.queueTextWrap}>
                    <Text style={[styles.queueTitle, { color: theme.colors.text }]}>
                      {getTaskDisplayTitle(task, language)}
                    </Text>
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
                  {isArranging ? (
                    <View style={styles.arrangeControls}>
                      <ArrangeButton
                        label={t('tasks.moveUp')}
                        disabled={todayTaskIndex <= 0}
                        onPress={() => reorderTodayTask(task.id, 'up')}
                      >
                        ↑
                      </ArrangeButton>
                      <ArrangeButton
                        label={t('tasks.moveDown')}
                        disabled={todayTaskIndex < 0 || todayTaskIndex >= todayTasks.length - 1}
                        onPress={() => reorderTodayTask(task.id, 'down')}
                      >
                        ↓
                      </ArrangeButton>
                      <ArrangeTextButton
                        label={t('today.removeFromToday')}
                        onPress={() => {
                          moveTaskToBacklog(task.id);
                          setArrangingTaskId(null);
                        }}
                      />
                      <ArrangeTextButton
                        label={t('today.doneArranging')}
                        onPress={() => setArrangingTaskId(null)}
                        primary
                      />
                    </View>
                  ) : null}
                </Pressable>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getWebViewportWidth() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return undefined;
  }

  const widths = [window.visualViewport?.width, window.innerWidth, window.outerWidth].filter(
    (width): width is number => typeof width === 'number' && width > 0
  );

  return widths.length > 0 ? Math.min(...widths) : undefined;
}

function useWebViewportWidth() {
  const [viewportWidth, setViewportWidth] = useState(getWebViewportWidth);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const updateViewportWidth = () => setViewportWidth(getWebViewportWidth());

    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    window.visualViewport?.addEventListener('resize', updateViewportWidth);

    return () => {
      window.removeEventListener('resize', updateViewportWidth);
      window.visualViewport?.removeEventListener('resize', updateViewportWidth);
    };
  }, []);

  return viewportWidth;
}

function SettingsGlyph({ color }: { color: string }) {
  return (
    <View style={styles.settingsGlyph} pointerEvents="none">
      <View style={[styles.settingsGlyphLine, { backgroundColor: color }]} />
      <View style={[styles.settingsGlyphLine, { backgroundColor: color, width: 18 }]} />
      <View style={[styles.settingsGlyphLine, { backgroundColor: color }]} />
      <View style={[styles.settingsGlyphDot, styles.settingsGlyphDotTop, { backgroundColor: color }]} />
      <View style={[styles.settingsGlyphDot, styles.settingsGlyphDotMiddle, { backgroundColor: color }]} />
      <View style={[styles.settingsGlyphDot, styles.settingsGlyphDotBottom, { backgroundColor: color }]} />
    </View>
  );
}

function ArrangeButton({
  children,
  disabled,
  label,
  onPress,
}: {
  children: string;
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.arrangeButton,
        {
          backgroundColor: disabled ? theme.colors.disabled : theme.colors.surfaceSoft,
          borderColor: theme.colors.outline,
        },
        pressed && !disabled && styles.arrangeButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.arrangeButtonText,
          { color: disabled ? theme.colors.disabledText : theme.colors.primaryHover },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function ArrangeTextButton({
  label,
  onPress,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.arrangeTextButton,
        {
          backgroundColor: primary ? theme.colors.primarySoft : 'transparent',
          borderColor: theme.colors.outline,
        },
        pressed && styles.arrangeButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.arrangeTextButtonText,
          { color: primary ? theme.colors.primaryHover : theme.colors.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 20,
  },
  contentItem: {
    ...Platform.select({
      web: {},
      default: {
        marginHorizontal: 20,
      },
    }),
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
    width: 44,
    minHeight: 44,
    minWidth: 44,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.cardTranslucent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonPressed: {
    opacity: 0.9,
  },
  settingsGlyph: {
    width: 22,
    height: 22,
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  settingsGlyphLine: {
    width: 22,
    height: 2,
    borderRadius: 2,
  },
  settingsGlyphDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  settingsGlyphDotTop: {
    top: 1.5,
    left: 4,
  },
  settingsGlyphDotMiddle: {
    top: 8.5,
    right: 3,
  },
  settingsGlyphDotBottom: {
    bottom: 1.5,
    left: 10,
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
  firstStepCard: {
    backgroundColor: tokens.colors.cardTranslucent,
    borderRadius: tokens.radius.modal,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  firstStepText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
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
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    backgroundColor: tokens.colors.cardTranslucent,
    borderRadius: tokens.radius.modal,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  queueCardPressed: {
    opacity: 0.92,
  },
  queueCardArranging: {
    ...tokens.shadow,
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
    minWidth: 0,
    gap: 8,
  },
  queueTitle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 17,
    lineHeight: 23,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  arrangeControls: {
    width: '100%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 2,
  },
  arrangeButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrangeButtonPressed: {
    opacity: 0.9,
  },
  arrangeButtonText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  arrangeTextButton: {
    minHeight: 44,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrangeTextButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
});
