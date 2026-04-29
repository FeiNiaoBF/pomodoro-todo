import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import {
  OneTomatoLanguage,
  OneTomatoTheme,
  settingsLimits,
} from '../storage/settingsStorage';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from '../hooks/useTranslation';
import { tokens } from '../theme/tokens';

type NumericSettingKey =
  | 'focusDurationMinutes'
  | 'shortBreakDurationMinutes'
  | 'longBreakDurationMinutes'
  | 'longBreakInterval';

const THEME_OPTIONS: Array<{ labelKey: 'settings.theme.system' | 'settings.theme.light' | 'settings.theme.dark'; value: OneTomatoTheme }> = [
  { labelKey: 'settings.theme.system', value: 'system' },
  { labelKey: 'settings.theme.light', value: 'light' },
  { labelKey: 'settings.theme.dark', value: 'dark' },
];

const LANGUAGE_OPTIONS: Array<{ labelKey: 'settings.language.system' | 'settings.language.en' | 'settings.language.zhCN'; value: OneTomatoLanguage }> = [
  { labelKey: 'settings.language.system', value: 'system' },
  { labelKey: 'settings.language.en', value: 'en' },
  { labelKey: 'settings.language.zhCN', value: 'zh-CN' },
];

export function SettingsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBloom, { backgroundColor: theme.colors.bloomTop }]} pointerEvents="none" />
      <View style={[styles.bottomBloom, { backgroundColor: theme.colors.bloomBottom }]} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: theme.colors.cardTranslucent,
                borderColor: theme.colors.outline,
              },
              pressed && styles.quietPressed,
            ]}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.muted }]}>{t('common.back')}</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings.title')}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{t('settings.subtitle')}</Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardTranslucent,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t('settings.focusRhythm')}</Text>
          <SettingStepper
            label={t('settings.focusDuration')}
            value={settings.focusDurationMinutes}
            unit={t('settings.unit.min')}
            settingKey="focusDurationMinutes"
            onChange={value => updateSettings({ focusDurationMinutes: value })}
          />
          <SettingStepper
            label={t('settings.shortBreak')}
            value={settings.shortBreakDurationMinutes}
            unit={t('settings.unit.min')}
            settingKey="shortBreakDurationMinutes"
            onChange={value => updateSettings({ shortBreakDurationMinutes: value })}
          />
          <SettingStepper
            label={t('settings.longBreak')}
            value={settings.longBreakDurationMinutes}
            unit={t('settings.unit.min')}
            settingKey="longBreakDurationMinutes"
            onChange={value => updateSettings({ longBreakDurationMinutes: value })}
          />
          <SettingStepper
            label={t('settings.longBreakInterval')}
            value={settings.longBreakInterval}
            unit={t('settings.unit.tomatoes')}
            settingKey="longBreakInterval"
            onChange={value => updateSettings({ longBreakInterval: value })}
          />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardTranslucent,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t('settings.experience')}</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{t('settings.reducedMotion')}</Text>
              <Text style={[styles.settingHint, { color: theme.colors.muted }]}>{t('settings.reducedMotionHint')}</Text>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={value => updateSettings({ reducedMotion: value })}
              trackColor={{
                false: theme.colors.surfaceSoft,
                true: theme.colors.primarySoft,
              }}
              thumbColor={settings.reducedMotion ? theme.colors.primary : theme.colors.muted}
              ios_backgroundColor={theme.colors.surfaceSoft}
            />
          </View>

          <View style={styles.themeSection}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{t('settings.theme')}</Text>
            <View style={styles.themeOptions}>
              {THEME_OPTIONS.map(option => {
                const isSelected = settings.theme === option.value;
                const label = t(option.labelKey);

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    onPress={() => updateSettings({ theme: option.value })}
                    style={({ pressed }) => [
                      styles.themeOption,
                      {
                        backgroundColor: isSelected ? theme.colors.primarySoft : theme.colors.input,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                      },
                      pressed && styles.quietPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeOptionText,
                        { color: isSelected ? theme.colors.primaryHover : theme.colors.muted },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.themeSection}>
            <View style={styles.settingCopy}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{t('settings.language')}</Text>
              <Text style={[styles.settingHint, { color: theme.colors.muted }]}>{t('settings.languageHint')}</Text>
            </View>
            <View style={styles.themeOptions}>
              {LANGUAGE_OPTIONS.map(option => {
                const isSelected = settings.language === option.value;
                const label = t(option.labelKey);

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    onPress={() => updateSettings({ language: option.value })}
                    style={({ pressed }) => [
                      styles.themeOption,
                      {
                        backgroundColor: isSelected ? theme.colors.primarySoft : theme.colors.input,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                      },
                      pressed && styles.quietPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeOptionText,
                        { color: isSelected ? theme.colors.primaryHover : theme.colors.muted },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.reset')}
          onPress={resetSettings}
          style={({ pressed }) => [
            styles.resetButton,
            {
              backgroundColor: theme.colors.cardTranslucent,
              borderColor: theme.colors.outline,
            },
            pressed && styles.quietPressed,
          ]}
        >
          <Text style={[styles.resetButtonText, { color: theme.colors.muted }]}>{t('settings.reset')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingStepper({
  label,
  value,
  unit,
  settingKey,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  settingKey: NumericSettingKey;
  onChange: (value: number) => void;
}) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const limit = settingsLimits[settingKey];

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingCopy}>
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{label}</Text>
        <Text style={[styles.settingHint, { color: theme.colors.muted }]}>
          {limit.min}-{limit.max} {unit}
        </Text>
      </View>

      <View
        style={[
          styles.stepper,
          {
            backgroundColor: theme.colors.input,
            borderColor: theme.colors.outline,
          },
        ]}
      >
        <StepButton
          label={t('settings.decrease')}
          disabled={value <= limit.min}
          onPress={() => onChange(value - 1)}
        >
          -
        </StepButton>
        <View style={styles.stepperValue}>
          <Text style={[styles.stepperNumber, { color: theme.colors.text }]}>{value}</Text>
          <Text style={[styles.stepperUnit, { color: theme.colors.muted }]}>{unit}</Text>
        </View>
        <StepButton
          label={t('settings.increase')}
          disabled={value >= limit.max}
          onPress={() => onChange(value + 1)}
        >
          +
        </StepButton>
      </View>
    </View>
  );
}

function StepButton({
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
        styles.stepButton,
        {
          backgroundColor: disabled
            ? theme.colors.disabled
            : pressed
              ? theme.colors.primarySoft
              : theme.colors.surfaceSoft,
        },
      ]}
    >
      <Text
        style={[
          styles.stepButtonText,
          { color: disabled ? theme.colors.disabledText : theme.colors.primaryHover },
        ]}
      >
        {children}
      </Text>
    </Pressable>
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
    right: -48,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: tokens.colors.bloomTop,
    opacity: 0.76,
  },
  bottomBloom: {
    position: 'absolute',
    bottom: 70,
    left: -62,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: tokens.colors.bloomBottom,
    opacity: 0.72,
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
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.cardTranslucent,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  backButtonText: {
    fontSize: 13,
    lineHeight: 18,
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
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  card: {
    backgroundColor: tokens.colors.cardTranslucent,
    borderRadius: tokens.radius.modal,
    padding: 18,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    gap: 14,
    ...tokens.shadow,
  },
  cardTitle: {
    fontSize: 21,
    lineHeight: 27,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  settingCopy: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  settingHint: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.input,
    overflow: 'hidden',
  },
  stepButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surfaceSoft,
  },
  stepButtonPressed: {
    backgroundColor: tokens.colors.primarySoft,
  },
  stepButtonDisabled: {
    backgroundColor: tokens.colors.disabled,
  },
  stepButtonText: {
    fontSize: 20,
    lineHeight: 24,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  stepButtonTextDisabled: {
    color: tokens.colors.disabledText,
  },
  stepperValue: {
    minWidth: 72,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  stepperNumber: {
    fontSize: 17,
    lineHeight: 20,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  stepperUnit: {
    fontSize: 10,
    lineHeight: 13,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  themeSection: {
    gap: 10,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.input,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  themeOptionSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primarySoft,
  },
  themeOptionText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  themeOptionTextSelected: {
    color: tokens.colors.primaryHover,
  },
  resetButton: {
    minHeight: 52,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.cardTranslucent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  resetButtonText: {
    fontSize: 15,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  quietPressed: {
    opacity: 0.9,
  },
});
