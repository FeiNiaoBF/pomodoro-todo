import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { tokens } from '../theme/tokens';

interface SegmentedProgressBarProps {
  total: number;
  completed: number;
}

export function SegmentedProgressBar({
  total,
  completed,
}: SegmentedProgressBarProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: completed }}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < completed;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                backgroundColor: isActive
                  ? theme.colors.primary
                  : theme.colors.primarySoft,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    height: 10,
    borderRadius: tokens.radius.pill,
  },
});
