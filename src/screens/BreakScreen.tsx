import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BreathingBackground } from '../components/BreathingBackground';
import { usePomodoro } from '../hooks/usePomodoro';
import { RootStackParamList } from '../navigation/types';
import { tokens } from '../theme/tokens';

export function BreakScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    currentMode,
    remainingSeconds,
    status,
    focusSessionIndex,
    nextTaskPreview,
    completeBreak,
    startNextTomato,
  } = usePomodoro();

  const [hasCompletedBreak, setHasCompletedBreak] = useState(false);

  useEffect(() => {
    if (currentMode !== 'short_break' || status !== 'running' || remainingSeconds !== 0 || hasCompletedBreak) {
      return;
    }

    setHasCompletedBreak(true);
    completeBreak();
  }, [completeBreak, currentMode, hasCompletedBreak, remainingSeconds, status]);

  useEffect(() => {
    if (currentMode === 'short_break' && status === 'running' && remainingSeconds > 0) {
      setHasCompletedBreak(false);
    }
  }, [currentMode, remainingSeconds, status]);

  const displayTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const handleStartNextTomato = () => {
    startNextTomato();
    navigation.navigate('Focus');
  };

  const handleSkipBreak = () => {
    completeBreak();
    navigation.navigate('MainTabs', { screen: 'Today' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBloom} pointerEvents="none" />
      <View style={styles.bottomBloom} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.breakLabel}>Short Break</Text>
          <Text style={styles.breakContext}>After focus session {focusSessionIndex}</Text>
        </View>

        <View style={styles.centerSection}>
          <BreathingBackground
            outerColor={tokens.colors.accentSoft}
            innerColor="#FFF8EF"
            borderColor="#F2DEC7"
            size={304}
            innerScale={0.74}
          />

          <View style={styles.centerOverlay}>
            <Text style={styles.timerText}>{displayTime}</Text>
            <Text style={styles.headline}>Time to breathe.</Text>
            <Text style={styles.message}>Rest your eyes. You earned it.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Next</Text>
            <Text style={styles.previewText}>
              {nextTaskPreview ? nextTaskPreview.title : 'Start another focus session'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start Next Tomato"
            onPress={handleStartNextTomato}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Start Next Tomato</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip Break"
            onPress={handleSkipBreak}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.quietPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Skip Break</Text>
          </Pressable>
        </View>
      </View>
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
    top: -64,
    right: -36,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFEBD7',
    opacity: 0.82,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 24,
    left: -44,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF2E1',
    opacity: 0.76,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  breakLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.accent,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  breakContext: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 280,
  },
  timerText: {
    fontSize: 78,
    lineHeight: 84,
    color: tokens.colors.accent,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    letterSpacing: -2,
    marginBottom: 16,
  },
  headline: {
    fontSize: 32,
    lineHeight: 38,
    color: tokens.colors.text,
    textAlign: 'center',
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    lineHeight: 23,
    color: tokens.colors.muted,
    textAlign: 'center',
    fontFamily: tokens.typography.bodyFamily,
  },
  footer: {
    gap: 14,
  },
  previewCard: {
    backgroundColor: 'rgba(255, 253, 249, 0.82)',
    borderRadius: tokens.radius.modal,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEDFD0',
  },
  previewLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: 6,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 22,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...tokens.shadow,
  },
  primaryButtonPressed: {
    opacity: 0.94,
  },
  primaryButtonText: {
    fontSize: tokens.typography.button,
    color: '#FFF9F3',
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: tokens.radius.modal,
    borderWidth: 1,
    borderColor: '#E9D8C8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  quietPressed: {
    opacity: 0.9,
  },
});
