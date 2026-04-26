import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CurrentTaskHeroCard } from '../components/CurrentTaskHeroCard';
import { SegmentedProgressBar } from '../components/SegmentedProgressBar';
import { TomatoDots } from '../components/TomatoDots';
import { tokens } from '../theme/tokens';

const currentTask = {
  label: 'Current Tomato',
  title: 'Draft Q3 Marketing Plan',
  description: 'Focus on the main story and campaign direction.',
  completedTomatoes: 2,
  totalTomatoes: 3,
};

const upNextTasks = [
  { id: 'emails', title: 'Reply to client emails', tomatoes: 1 },
  { id: 'pr', title: 'Review PR #42', tomatoes: 2 },
];

export function TodayScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundBloomTop} pointerEvents="none" />
      <View style={styles.backgroundBloomBottom} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Today&apos;s Focus</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Tomatoes completed today</Text>
            <Text style={styles.progressValue}>3/8</Text>
          </View>
          <SegmentedProgressBar total={8} completed={3} />
        </View>

        <CurrentTaskHeroCard
          label={currentTask.label}
          title={currentTask.title}
          description={currentTask.description}
          completedTomatoes={currentTask.completedTomatoes}
          totalTomatoes={currentTask.totalTomatoes}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityHint="Starts one pomodoro for the current task"
          accessibilityLabel="Start Tomato"
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <View style={styles.primaryButtonIndicator} />
          <Text style={styles.primaryButtonText}>Start Tomato</Text>
        </Pressable>

        <View style={styles.upNextSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <Text style={styles.sectionMeta}>Keep it light</Text>
          </View>

          <View style={styles.queue}>
            {upNextTasks.map((task, index) => (
              <View key={task.id} style={styles.queueCard}>
                <View style={styles.queueIndex}>
                  <Text style={styles.queueIndexText}>0{index + 1}</Text>
                </View>
                <View style={styles.queueTextWrap}>
                  <Text style={styles.queueTitle}>{task.title}</Text>
                  <TomatoDots
                    total={task.tomatoes}
                    completed={task.tomatoes}
                    size="sm"
                  />
                </View>
              </View>
            ))}
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
    paddingBottom: 36,
    gap: 20,
  },
  backgroundBloomTop: {
    position: 'absolute',
    top: -30,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FEE1D9',
    opacity: 0.85,
  },
  backgroundBloomBottom: {
    position: 'absolute',
    bottom: 120,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF0E2',
    opacity: 0.75,
  },
  header: {
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: 8,
  },
  title: {
    fontSize: tokens.typography.title,
    lineHeight: 38,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: '#FFF9F6',
    borderRadius: tokens.radius.modal,
    padding: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: '#F1D6D1',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  progressValue: {
    fontSize: 24,
    lineHeight: 28,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
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
    backgroundColor: tokens.colors.primaryHover,
  },
  primaryButtonIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FFF8F5',
  },
  primaryButtonText: {
    fontSize: tokens.typography.button,
    color: '#FFF8F5',
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
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255, 253, 249, 0.76)',
    borderRadius: tokens.radius.modal,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0E1DC',
  },
  queueIndex: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueIndexText: {
    fontSize: 13,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  queueTextWrap: {
    flex: 1,
    gap: 10,
  },
  queueTitle: {
    fontSize: 15,
    lineHeight: 21,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
});
