import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ComparisonBars,
  InterruptionFlowList,
  TaskProgressBar,
  TimeBlockBars,
  WeeklyRoundedBarChart,
} from '../components/insights/InsightsCharts';
import { useAppTheme } from '../hooks/useAppTheme';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTasks } from '../hooks/useTasks';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { tokens } from '../theme/tokens';
import {
  formatFocusTime,
  getBestFocusTimeBlock,
  getInterruptionBreakdown,
  getLocalizedInterruptionLabels,
  getLocalizedTimeBlockLabels,
  getPlanningAccuracy,
  getTaskProgress,
  getTodaySummary,
  getWeeklyFocusTrend,
} from '../utils/insightsData';

export function InsightsScreen() {
  const theme = useAppTheme();
  const { language, t } = useTranslation();
  const { completedSessions, interruptions } = usePomodoro();
  const { completedTasks, todayTasks } = useTasks();

  const insights = useMemo(() => {
    const now = new Date();

    return {
      todaySummary: getTodaySummary(
        completedSessions,
        completedTasks,
        interruptions,
        now
      ),
      weeklyFocus: getWeeklyFocusTrend(completedSessions, language, now),
      planningAccuracy: getPlanningAccuracy(
        todayTasks,
        completedTasks,
        completedSessions,
        now
      ),
      taskProgress: getTaskProgress(todayTasks, completedTasks, now),
      interruptionBreakdown: getInterruptionBreakdown(interruptions, now),
      bestFocusTime: getBestFocusTimeBlock(completedSessions),
      interruptionLabels: getLocalizedInterruptionLabels(language),
      timeBlockLabels: getLocalizedTimeBlockLabels(language),
    };
  }, [completedSessions, completedTasks, interruptions, language, todayTasks]);

  const planningCopy = getPlanningCopy(
    insights.planningAccuracy.status,
    Math.abs(insights.planningAccuracy.difference),
    t
  );
  const taskProgressCopy = insights.taskProgress.totalTasks === 0
    ? t('insights.taskProgressEmpty')
    : insights.taskProgress.exceededPlan
      ? t('insights.taskProgressBeyond')
      : t('insights.taskProgressCopy', {
          done: insights.taskProgress.completedTasks,
          total: insights.taskProgress.totalTasks,
        });
  const bestFocusBlock = insights.bestFocusTime.strongestBlock?.block;
  const bestFocusBlockName = bestFocusBlock
    ? language === 'en'
      ? insights.timeBlockLabels[bestFocusBlock].toLowerCase()
      : insights.timeBlockLabels[bestFocusBlock]
    : '';
  const bestFocusCopy = insights.bestFocusTime.hasEnoughData && bestFocusBlock
    ? t('insights.bestFocusCopy', { block: bestFocusBlockName })
    : t('insights.bestFocusInsufficient');
  const hasInterruptions = insights.todaySummary.interruptions > 0;

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
          <Text style={[styles.kicker, { color: theme.colors.primaryHover }]}>
            {t('insights.todaySummary')}
          </Text>
          <Text style={[styles.heroMetricLabel, { color: theme.colors.muted }]}>
            {t('insights.focusTime')}
          </Text>
          <Text style={[styles.heroValue, { color: theme.colors.text }]}>
            {formatFocusTime(insights.todaySummary.focusSeconds, language)}
          </Text>
          <Text style={[styles.heroExplanation, { color: theme.colors.muted }]}>
            {t('insights.focusTimeExplanation')}
          </Text>

          <View style={styles.heroMetricGrid}>
            <HeroMetric
              label={t('insights.completedTomatoes')}
              value={String(insights.todaySummary.completedTomatoes)}
              hint={t('insights.completedTomatoesHint')}
            />
            <HeroMetric
              label={t('insights.completedTasks')}
              value={String(insights.todaySummary.completedTasks)}
              hint={t('insights.completedTasksHint')}
            />
            <HeroMetric
              label={t('insights.interruptions')}
              value={String(insights.todaySummary.interruptions)}
              hint={t('insights.interruptionsHint')}
            />
          </View>
        </View>

        <SectionCard>
          <SectionHeader
            title={t('insights.weeklyFocus')}
            meta={t('insights.weeklyFocusCopy')}
          />
          <WeeklyRoundedBarChart
            days={insights.weeklyFocus}
            legend={t('insights.weeklyFocusLegend')}
            theme={theme}
          />
        </SectionCard>

        <SectionCard isStrong>
          <SectionHeader
            title={t('insights.planningAccuracy')}
            meta={t('insights.planningSummary', {
              planned: insights.planningAccuracy.plannedTomatoes,
              actual: insights.planningAccuracy.actualTomatoes,
            })}
          />
          <ComparisonBars
            plannedLabel={t('insights.planned')}
            actualLabel={t('insights.actual')}
            planned={insights.planningAccuracy.plannedTomatoes}
            actual={insights.planningAccuracy.actualTomatoes}
            theme={theme}
          />
          <Text style={[styles.sectionLead, { color: theme.colors.text }]}>{planningCopy}</Text>
          <Text style={[styles.sectionCopy, { color: theme.colors.muted }]}>
            {t('insights.planningHelp')}
          </Text>
        </SectionCard>

        <SectionCard>
          <SectionHeader
            title={t('insights.taskProgressTitle')}
            meta={`${insights.taskProgress.percentage}%`}
          />
          <Text style={[styles.sectionLead, { color: theme.colors.text }]}>
            {taskProgressCopy}
          </Text>
          <TaskProgressBar percentage={insights.taskProgress.percentage} theme={theme} />
        </SectionCard>

        <SectionCard>
          <SectionHeader
            title={t('insights.interruptionBreakdown')}
            meta={t('insights.interruptionSupport')}
          />
          {hasInterruptions ? (
            <View style={styles.interruptionContent}>
              <InterruptionFlowList
                items={insights.interruptionBreakdown}
                labels={insights.interruptionLabels}
                theme={theme}
              />
            </View>
          ) : (
            <Text style={[styles.sectionCopy, { color: theme.colors.muted }]}>
              {t('insights.noInterruptions')}
            </Text>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader
            title={t('insights.bestFocusTime')}
            meta={bestFocusCopy}
          />
          <TimeBlockBars
            blocks={insights.bestFocusTime.blocks}
            labels={insights.timeBlockLabels}
            theme={theme}
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function getPlanningCopy(
  status: 'over' | 'under' | 'matched' | 'insufficient',
  difference: number,
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string
) {
  if (status === 'over') {
    return t('insights.planningOver', { count: difference });
  }

  if (status === 'under') {
    return t('insights.planningUnder', { count: difference });
  }

  if (status === 'matched') {
    return t('insights.planningMatched');
  }

  return t('insights.planningInsufficient');
}

function HeroMetric({ label, value, hint }: { label: string; value: string; hint: string }) {
  const theme = useAppTheme();

  return (
    <View style={styles.heroMetric}>
      <Text style={[styles.heroMetricValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.heroMetricName, { color: theme.colors.text }]}>{label}</Text>
      <Text style={[styles.heroMetricHint, { color: theme.colors.muted }]}>{hint}</Text>
    </View>
  );
}

function SectionCard({
  children,
  isStrong = false,
}: {
  children: React.ReactNode;
  isStrong?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.sectionCard,
        isStrong && styles.strongSectionCard,
        {
          backgroundColor: isStrong ? theme.colors.surface : theme.colors.cardTranslucent,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      {children}
    </View>
  );
}

function SectionHeader({ title, meta }: { title: string; meta: string }) {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.sectionMeta, { color: theme.colors.primaryHover }]}>{meta}</Text>
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
    top: -64,
    right: -52,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.78,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 82,
    left: -64,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.68,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 18,
  },
  header: {
    gap: 8,
    paddingBottom: 2,
  },
  title: {
    fontSize: tokens.typography.title,
    lineHeight: 38,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: tokens.typography.bodyFamily,
  },
  heroCard: {
    borderRadius: tokens.radius.hero,
    padding: 24,
    borderWidth: 1,
    gap: 10,
    ...tokens.shadow,
  },
  kicker: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  heroMetricLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: tokens.typography.bodyMediumFamily,
    fontWeight: '600',
  },
  heroValue: {
    fontSize: 46,
    lineHeight: 52,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  heroExplanation: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: tokens.typography.bodyFamily,
  },
  heroMetricGrid: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
  },
  heroMetric: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  heroMetricValue: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  heroMetricName: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  heroMetricHint: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: tokens.typography.bodyFamily,
  },
  sectionCard: {
    borderRadius: tokens.radius.modal,
    padding: 18,
    borderWidth: 1,
    gap: 15,
  },
  strongSectionCard: {
    padding: 20,
    ...tokens.shadow,
  },
  sectionHeader: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  sectionMeta: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  sectionLead: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  sectionCopy: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: tokens.typography.bodyFamily,
  },
  interruptionContent: {
    gap: 12,
  },
});
