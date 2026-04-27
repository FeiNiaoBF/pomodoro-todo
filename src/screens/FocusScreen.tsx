import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BreathingBackground } from '../components/BreathingBackground';
import { TomatoDots } from '../components/TomatoDots';
import { usePomodoro } from '../hooks/usePomodoro';
import { RootStackParamList } from '../navigation/types';
import { InterruptionReason } from '../types/pomodoro';
import { tokens } from '../theme/tokens';

const INTERRUPTION_OPTIONS: Array<{ label: string; value: InterruptionReason }> = [
  { label: 'Phone', value: 'phone' },
  { label: 'Message', value: 'message' },
  { label: 'People', value: 'people' },
  { label: 'Self-distraction', value: 'self_distraction' },
  { label: 'Other', value: 'other' },
];

export function FocusScreen() {
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

  useEffect(() => {
    if (currentMode !== 'focus' || status !== 'running' || remainingSeconds !== 0 || hasCompleted) {
      return;
    }

    setHasCompleted(true);
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
    saveForLater();
    navigation.navigate('MainTabs', { screen: 'Today' });
  };

  const handleCompleteNow = () => {
    if (hasCompleted) {
      return;
    }

    setHasCompleted(true);
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBloom} pointerEvents="none" />
      <View style={styles.bottomBloom} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sessionLabel}>Focus session {focusSessionIndex} of 4</Text>
          <Text style={styles.taskTitle}>{currentTask.title}</Text>
          <Text style={styles.taskDescription}>{currentTask.description}</Text>
        </View>

        <View style={styles.timerSection}>
          <BreathingBackground />
          <View style={styles.timerOverlay}>
            <Text style={styles.timerText}>{displayTime}</Text>
            <View style={styles.timerMeta}>
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
                pressed && styles.quietPressed,
              ]}
            >
              <Text style={styles.secondaryControlText}>{pauseLabel}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Interrupted"
              onPress={() => setInterruptionVisible(true)}
              style={({ pressed }) => [
                styles.secondaryControl,
                pressed && styles.quietPressed,
              ]}
            >
              <Text style={styles.secondaryControlText}>Interrupted</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save for later"
            onPress={handleSaveForLater}
            style={({ pressed }) => [
              styles.tertiaryControl,
              pressed && styles.quietPressed,
            ]}
          >
            <Text style={styles.tertiaryControlText}>Save for later</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Complete session now"
            onPress={handleCompleteNow}
            style={({ pressed }) => [
              styles.devControl,
              pressed && styles.quietPressed,
            ]}
          >
            <Text style={styles.devControlText}>Complete session</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={interruptionVisible}
        onRequestClose={() => setInterruptionVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>What interrupted your focus?</Text>
            <Text style={styles.modalSupport}>This won&apos;t break your streak.</Text>

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
                      isSelected && styles.optionChipSelected,
                      pressed && styles.quietPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
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
                  pressed && styles.modalPrimaryActionPressed,
                ]}
              >
                <Text style={styles.modalPrimaryText}>Resume</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save for later"
                onPress={handleSaveAfterInterruption}
                style={({ pressed }) => [
                  styles.modalSecondaryAction,
                  pressed && styles.quietPressed,
                ]}
              >
                <Text style={styles.modalSecondaryText}>Save for later</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    backgroundColor: '#FFE5DE',
    opacity: 0.78,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 40,
    left: -52,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF1E8',
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
    marginBottom: 14,
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
    fontSize: 82,
    lineHeight: 88,
    color: tokens.colors.primary,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    letterSpacing: -2,
  },
  timerMeta: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: 'rgba(255, 253, 249, 0.84)',
    borderWidth: 1,
    borderColor: '#F2DFDA',
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
    backgroundColor: 'rgba(255, 253, 249, 0.82)',
    borderWidth: 1,
    borderColor: '#ECD8D2',
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
    borderColor: '#E7D3CE',
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
    backgroundColor: 'rgba(255, 224, 220, 0.52)',
    borderWidth: 1,
    borderColor: '#EED2CC',
  },
  devControlText: {
    fontSize: 13,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  quietPressed: {
    opacity: 0.9,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(45, 36, 34, 0.18)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.hero,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0DBD6',
    ...tokens.shadow,
  },
  modalTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalSupport: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: 18,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: tokens.radius.pill,
    backgroundColor: '#FFF7F4',
    borderWidth: 1,
    borderColor: '#EED6D0',
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
    gap: 12,
  },
  modalPrimaryAction: {
    minHeight: 54,
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
    color: '#FFF8F5',
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  modalSecondaryAction: {
    minHeight: 52,
    borderRadius: tokens.radius.modal,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E7D3CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryText: {
    fontSize: 15,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
});
