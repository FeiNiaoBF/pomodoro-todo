import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { AppTheme } from '../../theme/appTheme';
import { tokens } from '../../theme/tokens';
import { useSettings } from '../../hooks/useSettings';
import {
  InterruptionBreakdownItem,
  TimeBlockResult,
  WeeklyFocusDay,
} from '../../utils/insightsData';
import { InterruptionReason } from '../../types/pomodoro';

interface WeeklyRoundedBarChartProps {
  days: WeeklyFocusDay[];
  legend: string;
  theme: AppTheme;
}

interface ComparisonBarsProps {
  plannedLabel: string;
  actualLabel: string;
  planned: number;
  actual: number;
  theme: AppTheme;
}

interface TaskProgressBarProps {
  percentage: number;
  theme: AppTheme;
}

interface InterruptionBubbleClusterProps {
  items: InterruptionBreakdownItem[];
  labels: Record<InterruptionReason, string>;
  theme: AppTheme;
}

interface RankedInterruptionListProps {
  items: InterruptionBreakdownItem[];
  labels: Record<InterruptionReason, string>;
  theme: AppTheme;
}

interface InterruptionFlowListProps {
  items: InterruptionBreakdownItem[];
  labels: Record<InterruptionReason, string>;
  theme: AppTheme;
}

interface TimeBlockBarsProps {
  blocks: TimeBlockResult[];
  labels: Record<TimeBlockResult['block'], string>;
  theme: AppTheme;
}

function getPercent(value: number, max: number, min = 0) {
  if (value <= 0 || max <= 0) {
    return min;
  }

  return Math.max(min, Math.round((value / max) * 100));
}

export function WeeklyRoundedBarChart({ days, legend, theme }: WeeklyRoundedBarChartProps) {
  const maxCount = Math.max(1, ...days.map(day => day.count));

  return (
    <View style={styles.weeklyChart}>
      <View style={styles.weeklyRows}>
        {days.map((day, index) => {
          const isToday = index === days.length - 1;
          const height = day.count === 0 ? 6 : getPercent(day.count, maxCount, 12);

          return (
            <View key={day.key} style={styles.weeklyItem}>
              <View
                style={[
                  styles.weeklyTrack,
                  {
                    backgroundColor: theme.colors.surfaceSoft,
                    borderColor: isToday ? theme.colors.primary : theme.colors.outline,
                  },
                ]}
              >
                <View
                  style={[
                    styles.weeklyFill,
                    {
                      height: `${height}%`,
                      backgroundColor: day.count === 0
                        ? theme.colors.primarySoft
                        : isToday
                          ? theme.colors.primary
                          : theme.colors.accent,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.weeklyCount, { color: theme.colors.text }]}>{day.count}</Text>
              <Text style={[styles.weeklyLabel, { color: theme.colors.muted }]}>{day.label}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
        <Text style={[styles.legendText, { color: theme.colors.muted }]}>{legend}</Text>
      </View>
    </View>
  );
}

export function ComparisonBars({
  plannedLabel,
  actualLabel,
  planned,
  actual,
  theme,
}: ComparisonBarsProps) {
  const maxValue = Math.max(1, planned, actual);

  return (
    <View style={styles.comparison}>
      <ComparisonRow
        label={plannedLabel}
        value={planned}
        percent={getPercent(planned, maxValue)}
        fillColor={theme.colors.primarySoft}
        textColor={theme.colors.text}
        mutedColor={theme.colors.muted}
        trackColor={theme.colors.surfaceSoft}
      />
      <ComparisonRow
        label={actualLabel}
        value={actual}
        percent={getPercent(actual, maxValue)}
        fillColor={theme.colors.primary}
        textColor={theme.colors.text}
        mutedColor={theme.colors.muted}
        trackColor={theme.colors.surfaceSoft}
      />
    </View>
  );
}

function ComparisonRow({
  label,
  value,
  percent,
  fillColor,
  textColor,
  mutedColor,
  trackColor,
}: {
  label: string;
  value: number;
  percent: number;
  fillColor: string;
  textColor: string;
  mutedColor: string;
  trackColor: string;
}) {
  return (
    <View style={styles.comparisonRow}>
      <Text style={[styles.comparisonLabel, { color: mutedColor }]}>{label}</Text>
      <View style={[styles.comparisonTrack, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.comparisonFill,
            {
              width: `${percent}%`,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
      <Text style={[styles.comparisonValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

export function TaskProgressBar({ percentage, theme }: TaskProgressBarProps) {
  return (
    <View style={[styles.taskProgressTrack, { backgroundColor: theme.colors.surfaceSoft }]}>
      <View
        style={[
          styles.taskProgressFill,
          {
            width: `${Math.max(0, Math.min(100, percentage))}%`,
            backgroundColor: theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}

export function InterruptionBubbleCluster({
  items,
  labels,
  theme,
}: InterruptionBubbleClusterProps) {
  const maxCount = Math.max(1, ...items.map(item => item.count));
  const positions = [
    { left: 0, top: 28 },
    { left: 96, top: 0 },
    { left: 178, top: 52 },
    { left: 44, top: 104 },
    { left: 150, top: 126 },
  ];

  return (
    <View style={styles.bubbleStage}>
      {items.map((item, index) => {
        const size = item.count === 0
          ? 34
          : 42 + Math.round((item.count / maxCount) * 38);
        const isLargest = item.count === maxCount && item.count > 0;

        return (
          <View
            key={item.reason}
            style={[
              styles.bubble,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                left: positions[index].left,
                top: positions[index].top,
                backgroundColor: isLargest ? theme.colors.primary : theme.colors.surfaceSoft,
                borderColor: item.count === 0 ? theme.colors.outline : theme.colors.primarySoft,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.bubbleCount,
                { color: isLargest ? theme.colors.onPrimary : theme.colors.text },
              ]}
            >
              {item.count}
            </Text>
            {size >= 60 ? (
              <Text
                numberOfLines={1}
                style={[
                  styles.bubbleLabel,
                  { color: isLargest ? theme.colors.onPrimary : theme.colors.muted },
                ]}
              >
                {labels[item.reason]}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export function RankedInterruptionList({ items, labels, theme }: RankedInterruptionListProps) {
  const rankedItems = [...items].sort((a, b) => b.count - a.count);

  return (
    <View style={styles.rankedList}>
      {rankedItems.map(item => (
        <View key={item.reason} style={styles.rankedRow}>
          <Text style={[styles.rankedLabel, { color: theme.colors.text }]} numberOfLines={1}>
            {labels[item.reason]}
          </Text>
          <Text style={[styles.rankedValue, { color: theme.colors.muted }]}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
}

export function InterruptionFlowList({ items, labels, theme }: InterruptionFlowListProps) {
  const { settings } = useSettings();
  const breath = useRef(new Animated.Value(0)).current;
  const maxCount = Math.max(1, ...items.map(item => item.count));
  const rankedItems = [...items].sort((a, b) => b.count - a.count);

  useEffect(() => {
    if (settings.reducedMotion) {
      breath.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [breath, settings.reducedMotion]);

  const scale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.05],
  });
  const opacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.58, 0.9],
  });

  return (
    <View style={styles.flowList}>
      {rankedItems.map((item, index) => {
        const isTopReason = index === 0 && item.count > 0;
        const percent = getPercent(item.count, maxCount, item.count > 0 ? 8 : 0);

        return (
          <View key={item.reason} style={styles.flowRow}>
            <Animated.View
              style={[
                styles.flowPulse,
                {
                  backgroundColor: item.count > 0 ? theme.colors.primary : theme.colors.surfaceSoft,
                  opacity: isTopReason ? opacity : 0.72,
                  transform: [{ scale: isTopReason ? scale : 1 }],
                },
              ]}
            />
            <View style={styles.flowContent}>
              <View style={styles.flowHeader}>
                <Text style={[styles.flowLabel, { color: theme.colors.text }]} numberOfLines={1}>
                  {labels[item.reason]}
                </Text>
                <Text style={[styles.flowValue, { color: theme.colors.muted }]}>{item.count}</Text>
              </View>
              <View style={[styles.flowTrack, { backgroundColor: theme.colors.surfaceSoft }]}>
                <View
                  style={[
                    styles.flowFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: item.count > 0 ? theme.colors.primary : theme.colors.outline,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function TimeBlockBars({ blocks, labels, theme }: TimeBlockBarsProps) {
  const maxCount = Math.max(1, ...blocks.map(item => item.count));

  return (
    <View style={styles.timeBars}>
      {blocks.map(item => (
        <View key={item.block} style={styles.timeRow}>
          <Text style={[styles.timeLabel, { color: theme.colors.text }]}>{labels[item.block]}</Text>
          <View style={[styles.timeTrack, { backgroundColor: theme.colors.surfaceSoft }]}>
            <View
              style={[
                styles.timeFill,
                {
                  width: `${getPercent(item.count, maxCount, item.count > 0 ? 10 : 0)}%`,
                  backgroundColor: theme.colors.accent,
                },
              ]}
            />
          </View>
          <Text style={[styles.timeValue, { color: theme.colors.muted }]}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weeklyChart: {
    gap: 12,
  },
  weeklyRows: {
    height: 154,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 9,
  },
  weeklyItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  weeklyTrack: {
    width: '100%',
    height: 104,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weeklyFill: {
    width: '100%',
    borderRadius: tokens.radius.pill,
  },
  weeklyCount: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  weeklyLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: tokens.typography.bodyMediumFamily,
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 9,
  },
  legendText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: tokens.typography.bodyFamily,
  },
  comparison: {
    gap: 14,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  comparisonLabel: {
    width: 62,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  comparisonTrack: {
    flex: 1,
    height: 18,
    borderRadius: tokens.radius.pill,
    overflow: 'hidden',
  },
  comparisonFill: {
    height: '100%',
    borderRadius: tokens.radius.pill,
  },
  comparisonValue: {
    width: 28,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  taskProgressTrack: {
    height: 16,
    borderRadius: tokens.radius.pill,
    overflow: 'hidden',
  },
  taskProgressFill: {
    height: '100%',
    borderRadius: tokens.radius.pill,
  },
  bubbleStage: {
    position: 'relative',
    alignSelf: 'center',
    width: 260,
    height: 190,
  },
  bubble: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  bubbleCount: {
    fontSize: 17,
    lineHeight: 20,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  bubbleLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  rankedList: {
    gap: 8,
  },
  rankedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rankedLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: tokens.typography.bodyMediumFamily,
    fontWeight: '600',
  },
  rankedValue: {
    width: 32,
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  timeBars: {
    gap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeLabel: {
    width: 72,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  timeTrack: {
    flex: 1,
    height: 13,
    borderRadius: tokens.radius.pill,
    overflow: 'hidden',
  },
  timeFill: {
    height: '100%',
    borderRadius: tokens.radius.pill,
  },
  timeValue: {
    width: 24,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  flowList: {
    gap: 13,
  },
  flowRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flowPulse: {
    width: 18,
    height: 18,
    borderRadius: 18,
  },
  flowContent: {
    flex: 1,
    gap: 7,
  },
  flowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  flowLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  flowValue: {
    width: 30,
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: tokens.typography.bodyBoldFamily,
    fontWeight: '700',
  },
  flowTrack: {
    height: 10,
    borderRadius: tokens.radius.pill,
    overflow: 'hidden',
  },
  flowFill: {
    height: '100%',
    borderRadius: tokens.radius.pill,
  },
});
