import React from 'react';
import { StyleSheet, View } from 'react-native';
import { tokens } from '../theme/tokens';

interface SegmentedProgressBarProps {
  total: number;
  completed: number;
}

export function SegmentedProgressBar({
  total,
  completed,
}: SegmentedProgressBarProps) {
  return (
    <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: completed }}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < completed;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              isActive ? styles.segmentActive : styles.segmentInactive,
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
  segmentActive: {
    backgroundColor: tokens.colors.primary,
  },
  segmentInactive: {
    backgroundColor: tokens.colors.primarySoft,
  },
});
