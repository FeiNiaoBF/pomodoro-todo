import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { tokens } from '../theme/tokens';
import { formatTomatoProgress, getTomatoDotCounts } from '../utils/tomatoProgress';

interface TomatoDotsProps {
  total: number;
  completed: number;
  size?: 'sm' | 'md';
  tint?: string;
  showLabel?: boolean;
}

export function TomatoDots({
  total,
  completed,
  size = 'md',
  tint,
  showLabel = false,
}: TomatoDotsProps) {
  const theme = useAppTheme();
  const dotSize = size === 'sm' ? 10 : 12;
  const dotTint = tint ?? theme.colors.primary;
  const dotCounts = getTomatoDotCounts(completed, total);

  return (
    <View style={styles.row}>
      <View style={styles.dots}>
        {Array.from({ length: dotCounts.total }).map((_, index) => {
          const isFilled = index < dotCounts.completed;
          return (
            <View
              key={`${size}-${index}`}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize,
                  borderColor: dotTint,
                  backgroundColor: isFilled ? dotTint : 'transparent',
                },
              ]}
            >
              <View
                style={[
                  styles.dotLeaf,
                  {
                    borderBottomColor: isFilled ? dotTint : theme.colors.outline,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      {showLabel ? (
        <Text style={[styles.label, { color: theme.colors.muted }]}>
          {formatTomatoProgress(completed, total)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    borderWidth: 1.5,
    position: 'relative',
  },
  dotLeaf: {
    position: 'absolute',
    top: -4,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '-18deg' }],
  },
  label: {
    fontSize: tokens.typography.caption,
    fontFamily: tokens.typography.bodyFamily,
  },
});
