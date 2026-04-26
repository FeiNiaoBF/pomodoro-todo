import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';
import { TomatoDots } from './TomatoDots';

interface CurrentTaskHeroCardProps {
  label: string;
  title: string;
  description: string;
  completedTomatoes: number;
  totalTomatoes: number;
  onPress?: () => void;
}

export function CurrentTaskHeroCard({
  label,
  title,
  description,
  completedTomatoes,
  totalTomatoes,
  onPress,
}: CurrentTaskHeroCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.labelPill}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Ready now</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.footer}>
        <TomatoDots
          total={totalTomatoes}
          completed={completedTomatoes}
          showLabel
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.hero,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: '#F0D5D0',
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
    marginBottom: tokens.spacing.sm,
  },
  labelPill: {
    backgroundColor: tokens.colors.primarySoft,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  labelText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: '#FFF7EF',
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#F2DACA',
  },
  badgeText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: tokens.typography.body,
    lineHeight: 23,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: tokens.spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3E6E1',
    paddingTop: tokens.spacing.sm,
  },
});
