import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useTranslation } from '../hooks/useTranslation';
import { tokens } from '../theme/tokens';
import { TomatoDots } from './TomatoDots';

interface CurrentTaskHeroCardProps {
  label: string;
  title: string;
  description: string;
  completedTomatoes: number;
  totalTomatoes: number;
  badgeText?: string;
  footerNote?: string;
  onPress?: () => void;
}

export function CurrentTaskHeroCard({
  label,
  title,
  description,
  completedTomatoes,
  totalTomatoes,
  badgeText,
  footerNote,
  onPress,
}: CurrentTaskHeroCardProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const hasDescription = description.trim().length > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
        },
        pressed && onPress ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.labelPill, { backgroundColor: theme.colors.primarySoft }]}>
          <Text style={[styles.labelText, { color: theme.colors.primaryHover }]}>{label}</Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.cardStrong,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: theme.colors.muted }]}>{badgeText ?? t('task.readyNow')}</Text>
        </View>
      </View>

      <Text style={[styles.title, !hasDescription && styles.titleWithoutDescription, { color: theme.colors.text }]}>
        {title}
      </Text>
      {hasDescription ? (
        <Text style={[styles.description, { color: theme.colors.muted }]}>{description}</Text>
      ) : null}

      <View
        style={[
          styles.footer,
          hasDescription
            ? { borderTopColor: theme.colors.outline, borderTopWidth: 1, paddingTop: tokens.spacing.sm }
            : styles.footerWithoutDivider,
        ]}
      >
        <TomatoDots
          total={totalTomatoes}
          completed={completedTomatoes}
          showLabel
        />
        {footerNote ? (
          <Text style={[styles.footerNote, { color: theme.colors.primaryHover }]}>{footerNote}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: '100%',
    borderRadius: tokens.radius.hero,
    padding: tokens.spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...tokens.shadow,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: tokens.spacing.sm,
  },
  labelPill: {
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  labelText: {
    fontSize: tokens.typography.caption,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badge: {
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: tokens.typography.caption,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  title: {
    maxWidth: '100%',
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 30,
    lineHeight: 36,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 12,
  },
  titleWithoutDescription: {
    marginBottom: tokens.spacing.sm,
  },
  description: {
    maxWidth: '100%',
    flexShrink: 1,
    fontSize: tokens.typography.body,
    lineHeight: 23,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: tokens.spacing.md,
  },
  footer: {
    marginTop: 2,
    gap: 10,
  },
  footerWithoutDivider: {
    marginTop: 0,
  },
  footerNote: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
});
