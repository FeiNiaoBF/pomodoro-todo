import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';

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
  tint = tokens.colors.primary,
  showLabel = false,
}: TomatoDotsProps) {
  const dotSize = size === 'sm' ? 10 : 12;

  return (
    <View style={styles.row}>
      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, index) => {
          const isFilled = index < completed;
          return (
            <View
              key={`${size}-${index}`}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize,
                  borderColor: tint,
                  backgroundColor: isFilled ? tint : 'transparent',
                },
              ]}
            >
              <View
                style={[
                  styles.dotLeaf,
                  {
                    borderBottomColor: isFilled ? tint : tokens.colors.outline,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      {showLabel ? (
        <Text style={styles.label}>
          {completed}/{total} tomatoes
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
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
});
