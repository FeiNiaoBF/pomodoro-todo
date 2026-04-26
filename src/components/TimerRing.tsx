import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TimerPhase } from '../types';

interface TimerRingProps {
  progress: number;           // 0~1
  phase: TimerPhase;
  displayTime: string;        // mm:ss format
  phaseLabel: string;
}

const { width } = Dimensions.get('window');
const RING_SIZE = Math.min(width * 0.65, 300);

/**
 * TimerRing - 环形进度条组件
 *
 * 设计特点：
 * - 简洁的环形进度条
 * - 中心大号显示倒计时
 * - 颜色随阶段动态变化
 * - 性能优化：简单的 View 组合
 */
export function TimerRing({ progress, phase, displayTime, phaseLabel }: TimerRingProps) {
  // 阶段对应的颜色
  const colors = useMemo(() => {
    switch (phase) {
      case 'focus':
        return { primary: '#E53935', light: '#FFEBEE' };
      case 'shortBreak':
        return { primary: '#FFB300', light: '#FFF8E1' };
      case 'longBreak':
        return { primary: '#43A047', light: '#F1F8E9' };
    }
  }, [phase]);

  // 计算旋转角度（0-360）
  const rotationDegree = progress * 360;

  return (
    <View style={styles.container}>
      {/* 外部环形容器 */}
      <View
        style={[
          styles.ringOuter,
          {
            width: RING_SIZE,
            height: RING_SIZE,
            borderRadius: RING_SIZE / 2,
            backgroundColor: colors.light,
          },
        ]}
      >
        {/* 进度指示器（通过旋转和渐变模拟） */}
        <View
          style={[
            styles.progressRing,
            {
              width: RING_SIZE - 20,
              height: RING_SIZE - 20,
              borderRadius: (RING_SIZE - 20) / 2,
              borderWidth: 10,
              borderColor: colors.primary,
              opacity: 0.15,
            },
          ]}
        />

        {/* 中心圆形内容 */}
        <View
          style={[
            styles.center,
            {
              width: RING_SIZE - 60,
              height: RING_SIZE - 60,
              borderRadius: (RING_SIZE - 60) / 2,
              backgroundColor: '#FFFFFF',
            },
          ]}
        >
          <Text style={[styles.displayTime, { color: colors.primary }]}>
            {displayTime}
          </Text>
          <Text style={styles.phaseInfo}>
            {phaseLabel}
          </Text>
        </View>

        {/* 进度条指示点 */}
        <View
          style={[
            styles.progressIndicator,
            {
              backgroundColor: colors.primary,
              transform: [
                {
                  rotate: `${rotationDegree}deg`,
                },
              ],
            },
          ]}
        />
      </View>

      {/* 下方进度百分比 */}
      <Text style={styles.progressText}>
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  displayTime: {
    fontSize: 56,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  phaseInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  progressIndicator: {
    position: 'absolute',
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 20,
  },
  progressText: {
    marginTop: 16,
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
});
