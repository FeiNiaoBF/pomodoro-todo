import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { tokens } from '../theme/tokens';

interface BreathingBackgroundProps {
  outerColor?: string;
  innerColor?: string;
  borderColor?: string;
  size?: number;
  innerScale?: number;
}

export function BreathingBackground({
  outerColor = tokens.colors.primarySoft,
  innerColor = '#FFF7F4',
  borderColor = '#F3D9D4',
  size = 284,
  innerScale = 0.76,
}: BreathingBackgroundProps) {
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [breath]);

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
            backgroundColor: outerColor,
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
            backgroundColor: innerColor,
            borderColor,
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
