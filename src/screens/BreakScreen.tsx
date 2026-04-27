import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BreathingBackground } from '../components/BreathingBackground';
import { useAppTheme } from '../hooks/useAppTheme';
import { usePomodoro } from '../hooks/usePomodoro';
import { RootStackParamList } from '../navigation/types';
import { tokens } from '../theme/tokens';

export function BreakScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBloom, { backgroundColor: theme.colors.bloomTop }]} pointerEvents="none" />
      <View style={[styles.bottomBloom, { backgroundColor: theme.colors.bloomBottom }]} pointerEvents="none" />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 28,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.breakLabel, { color: theme.colors.accent }]}>Short Break</Text>
          <Text style={[styles.breakContext, { color: theme.colors.muted }]}>After focus session {focusSessionIndex}</Text>
        </View>

        <View style={styles.centerSection}>
          <BreathingBackground
            outerColor={theme.colors.accentSoft}
            innerColor={theme.colors.cardStrong}
            borderColor={theme.colors.outline}
            size={304}
            innerScale={0.74}
          />

          <View style={styles.centerOverlay}>
            <Text style={[styles.timerText, { color: theme.colors.accent }]}>{displayTime}</Text>
            <Text style={[styles.headline, { color: theme.colors.text }]}>Time to breathe.</Text>
            <Text style={[styles.message, { color: theme.colors.muted }]}>Rest your eyes. You earned it.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: theme.colors.cardTranslucent,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text style={[styles.previewLabel, { color: theme.colors.muted }]}>Next</Text>
            <Text style={[styles.previewText, { color: theme.colors.text }]}>
              {nextTaskPreview ? nextTaskPreview.title : 'Start another focus session'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start Next Tomato"
            onPress={handleStartNextTomato}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.colors.accent },
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={[styles.primaryButtonText, { color: theme.colors.onAccent }]}>Start Next Tomato</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip Break"
            onPress={handleSkipBreak}
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: theme.colors.outline },
              pressed && styles.quietPressed,
            ]}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.muted }]}>Skip Break</Text>
          </Pressable>
        </View>
      </View>
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
    right: -36,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: tokens.colors.bloomTop,
    opacity: 0.82,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 24,
    left: -44,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: tokens.colors.bloomBottom,
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
    backgroundColor: tokens.colors.cardTranslucent,
    borderRadius: tokens.radius.modal,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
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
    color: tokens.colors.onAccent,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: tokens.radius.modal,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
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
