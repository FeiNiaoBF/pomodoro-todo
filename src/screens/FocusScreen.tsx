import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BreathingBackground } from '../components/BreathingBackground';
import { useAppTheme } from '../hooks/useAppTheme';
import { TomatoDots } from '../components/TomatoDots';
import { usePomodoro } from '../hooks/usePomodoro';
import { RootStackParamList } from '../navigation/types';
import { InterruptionReason } from '../types/pomodoro';
import { tokens } from '../theme/tokens';
import { shouldShowDevTimerControls } from '../utils/devControls';

const INTERRUPTION_OPTIONS: Array<{ label: string; value: InterruptionReason }> = [
  { label: 'Phone', value: 'phone' },
  { label: 'Message', value: 'message' },
  { label: 'People', value: 'people' },
  { label: 'Self-distraction', value: 'self_distraction' },
  { label: 'Other', value: 'other' },
];

export function FocusScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    currentTask,
    currentMode,
    status,
    remainingSeconds,
    focusSessionIndex,
    pause,
    resume,
    completeFocus,
    saveForLater,
    logInterruption,
  } = usePomodoro();
  const [interruptionVisible, setInterruptionVisible] = useState(false);
  const [selectedInterruption, setSelectedInterruption] = useState<InterruptionReason | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const allowExitRef = useRef(false);

  useEffect(() => {
    return navigation.addListener('beforeRemove', event => {
      if (allowExitRef.current) {
        return;
      }

      event.preventDefault();
    });
  }, [navigation]);

  useEffect(() => {
    if (currentMode !== 'focus' || status !== 'running' || remainingSeconds !== 0 || hasCompleted) {
      return;
    }

    setHasCompleted(true);
    allowExitRef.current = true;
    completeFocus();
    navigation.navigate('Break');
  }, [completeFocus, currentMode, hasCompleted, navigation, remainingSeconds, status]);

  useEffect(() => {
    if (currentMode === 'focus') {
      setHasCompleted(false);
    }
  }, [currentMode]);

  const displayTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const pauseLabel = status === 'running' ? 'Pause' : 'Resume';

  const handleSaveForLater = () => {
    allowExitRef.current = true;
    saveForLater();
    navigation.navigate('MainTabs', { screen: 'Today' });
  };

  const handleCompleteNow = () => {
    if (hasCompleted) {
      return;
    }

    setHasCompleted(true);
    allowExitRef.current = true;
    completeFocus();
    navigation.navigate('Break');
  };

  const handleResumeFromInterruption = () => {
    if (selectedInterruption) {
      logInterruption(selectedInterruption);
    }

    setSelectedInterruption(null);
    setInterruptionVisible(false);
    resume();
  };

  const handleSaveAfterInterruption = () => {
    if (selectedInterruption) {
      logInterruption(selectedInterruption);
    }

    setSelectedInterruption(null);
    setInterruptionVisible(false);
    handleSaveForLater();
  };

  if (!currentTask) {
    return null;
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBloom, { backgroundColor: theme.colors.bloomTop }]} pointerEvents="none" />
      <View style={[styles.bottomBloom, { backgroundColor: theme.colors.bloomBottom }]} pointerEvents="none" />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 18,
            paddingBottom: insets.bottom + 28,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.sessionLabel, { color: theme.colors.muted }]}>Focus session {focusSessionIndex} of 4</Text>
          <Text style={[styles.currentFocusLabel, { color: theme.colors.primaryHover }]}>Current focus</Text>
          <Text style={[styles.taskTitle, { color: theme.colors.text }]}>{currentTask.title}</Text>
          {currentTask.description ? (
            <Text style={[styles.taskDescription, { color: theme.colors.muted }]}>{currentTask.description}</Text>
          ) : null}
        </View>

        <View style={styles.timerSection}>
          <BreathingBackground size={316} innerScale={0.88} />
          <View style={styles.timerOverlay}>
            <Text style={[styles.timerText, { color: theme.colors.primary }]}>{displayTime}</Text>
            <View
              style={[
                styles.timerMeta,
                {
                  backgroundColor: theme.colors.cardTranslucent,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <TomatoDots
                total={currentTask.estimatedTomatoes}
                completed={currentTask.completedTomatoes}
                showLabel
              />
            </View>
          </View>
        </View>

        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={pauseLabel}
              onPress={status === 'running' ? pause : resume}
              style={({ pressed }) => [
                styles.secondaryControl,
                {
                  backgroundColor: theme.colors.cardTranslucent,
                  borderColor: theme.colors.outline,
                },
                pressed && styles.quietPressed,
              ]}
            >
              <Text style={[styles.secondaryControlText, { color: theme.colors.text }]}>{pauseLabel}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Interrupted"
              onPress={() => setInterruptionVisible(true)}
              style={({ pressed }) => [
                styles.secondaryControl,
                {
                  backgroundColor: theme.colors.cardTranslucent,
                  borderColor: theme.colors.outline,
                },
                pressed && styles.quietPressed,
              ]}
            >
              <Text style={[styles.secondaryControlText, { color: theme.colors.text }]}>Interrupted</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save for later"
            onPress={handleSaveForLater}
            style={({ pressed }) => [
              styles.tertiaryControl,
              { borderColor: theme.colors.outline },
              pressed && styles.quietPressed,
            ]}
          >
            <Text style={[styles.tertiaryControlText, { color: theme.colors.muted }]}>Save for later</Text>
          </Pressable>

          {shouldShowDevTimerControls() ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dev complete session now"
              onPress={handleCompleteNow}
              style={({ pressed }) => [
                styles.devControl,
                { borderColor: theme.colors.outline },
                pressed && styles.quietPressed,
              ]}
            >
              <Text style={[styles.devControlText, { color: theme.colors.muted }]}>Dev: Complete session</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={interruptionVisible}
        onRequestClose={() => setInterruptionVisible(false)}
      >
        <View
          style={[
            styles.modalBackdrop,
            {
              backgroundColor: theme.colors.overlay,
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>What interrupted your focus?</Text>
              <Text style={[styles.modalSupport, { color: theme.colors.muted }]}>This won&apos;t break your streak.</Text>
            </View>

            <View style={styles.optionsList}>
              {INTERRUPTION_OPTIONS.map(option => {
                const isSelected = selectedInterruption === option.value;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    onPress={() => setSelectedInterruption(option.value)}
                    style={({ pressed }) => [
                      styles.optionChip,
                      {
                        backgroundColor: isSelected ? theme.colors.primarySoft : theme.colors.cardStrong,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                      },
                      pressed && styles.quietPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: isSelected ? theme.colors.primaryHover : theme.colors.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Resume"
                onPress={handleResumeFromInterruption}
                style={({ pressed }) => [
                  styles.modalPrimaryAction,
                  { backgroundColor: theme.colors.primary },
                  pressed && styles.quietPressed,
                ]}
              >
                <Text style={[styles.modalPrimaryText, { color: theme.colors.onPrimary }]}>Resume</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save for later"
                onPress={handleSaveAfterInterruption}
                style={({ pressed }) => [
                  styles.modalSecondaryAction,
                  {
                    backgroundColor: theme.colors.cardTranslucent,
                    borderColor: theme.colors.outline,
                  },
                  pressed && styles.quietPressed,
                ]}
              >
                <Text style={[styles.modalSecondaryText, { color: theme.colors.text }]}>Save for later</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    top: -56,
    right: -38,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: tokens.colors.bloomTop,
    opacity: 0.78,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 40,
    left: -52,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: tokens.colors.bloomBottom,
    opacity: 0.72,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
  },
  sessionLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  currentFocusLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 30,
    lineHeight: 36,
    color: tokens.colors.text,
    textAlign: 'center',
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 10,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: tokens.colors.muted,
    textAlign: 'center',
    fontFamily: tokens.typography.bodyFamily,
    maxWidth: 310,
  },
  timerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: 20,
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    minWidth: 276,
    fontSize: 74,
    lineHeight: 80,
    color: tokens.colors.primary,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
    textAlign: 'center',
  },
  timerMeta: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  controlsSection: {
    gap: 14,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryControl: {
    flex: 1,
    minHeight: 52,
    borderRadius: tokens.radius.modal,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  secondaryControlText: {
    fontSize: 15,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  tertiaryControl: {
    minHeight: 52,
    borderRadius: tokens.radius.modal,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  tertiaryControlText: {
    fontSize: 15,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  devControl: {
    minHeight: 46,
    borderRadius: tokens.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  devControlText: {
    fontSize: 13,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  quietPressed: {
    opacity: 0.9,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: tokens.colors.overlay,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.hero,
    padding: 26,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    ...tokens.shadow,
  },
  modalHeader: {
    marginBottom: 22,
  },
  modalTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSupport: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 26,
  },
  optionChip: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.cardStrong,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipSelected: {
    backgroundColor: tokens.colors.primarySoft,
    borderColor: tokens.colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: tokens.colors.primaryHover,
  },
  modalActions: {
    gap: 10,
  },
  modalPrimaryAction: {
    minHeight: 56,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryActionPressed: {
    backgroundColor: tokens.colors.primaryHover,
  },
  modalPrimaryText: {
    fontSize: tokens.typography.button,
    color: tokens.colors.onPrimary,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  modalSecondaryAction: {
    minHeight: 52,
    borderRadius: tokens.radius.modal,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryText: {
    fontSize: 15,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
});
