import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSettings } from '../hooks/useSettings';

interface BreathingBackgroundProps {
  outerColor?: string;
  innerColor?: string;
  borderColor?: string;
  size?: number;
  innerScale?: number;
}

export function BreathingBackground({
  outerColor,
  innerColor,
  borderColor,
  size = 284,
  innerScale = 0.76,
}: BreathingBackgroundProps) {
  const theme = useAppTheme();
  const { settings } = useSettings();
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (settings.reducedMotion) {
      breath.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [breath, settings.reducedMotion]);

  const scale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.04],
  });

  const opacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.38, 0.56],
  });

  const outerRadius = size / 2;
  const innerSize = size * innerScale;
  const innerRadius = innerSize / 2;

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
        },
      ]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          styles.outerBloom,
          {
            width: size,
            height: size,
            borderRadius: outerRadius,
            backgroundColor: outerColor ?? theme.colors.primarySoft,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      <View
        style={[
          styles.innerBloom,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerRadius,
            backgroundColor: innerColor ?? theme.colors.cardStrong,
            borderColor: borderColor ?? theme.colors.outline,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerBloom: {
    position: 'absolute',
  },
  innerBloom: {
    borderWidth: 1,
  },
});
