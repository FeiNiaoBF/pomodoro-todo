import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { SessionStorage } from '../utils/StorageService';
import { useEffect, useState } from 'react';
import { PomodoroSession } from '../types';

/**
 * StatsScreen - 统计仪表板
 *
 * 显示：
 * - 今日统计
 * - 周统计
 * - 任务完成率
 */
export function StatsScreen() {
  const { tasks } = useTodos();
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  // 初始化加载会话
  useEffect(() => {
    SessionStorage.getSessions().then(setSessions);
  }, []);

  // 计算统计数据
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.startedAt.startsWith(today));

    const completedPomodoros = todaySessions.filter(
      s => s.completed && s.phase === 'focus'
    ).length;
    const totalFocusTime = todaySessions
      .filter(s => s.phase === 'focus')
      .reduce((sum, s) => sum + s.durationSeconds, 0);

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;

    return {
      completedPomodoros,
      totalFocusTime,
      completedTasks,
      totalTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }, [sessions, tasks]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 数据统计</Text>
        </View>

        {/* 今日统计卡片 */}
        <View style={styles.statGrid}>
          {/* 番茄数 */}
          <View style={[styles.statCard, styles.cardPrimary]}>
            <Text style={styles.statValue}>🍅</Text>
            <Text style={styles.statNumber}>{stats.completedPomodoros}</Text>
            <Text style={styles.statLabel}>今日番茄</Text>
          </View>

          {/* 专注时间 */}
          <View style={[styles.statCard, styles.cardAccent]}>
            <Text style={styles.statValue}>⏱️</Text>
            <Text style={styles.statNumber}>
              {formatTime(stats.totalFocusTime)}
            </Text>
            <Text style={styles.statLabel}>专注时间</Text>
          </View>

          {/* 完成率 */}
          <View style={[styles.statCard, styles.cardSuccess]}>
            <Text style={styles.statValue}>✓</Text>
            <Text style={styles.statNumber}>{stats.completionRate}%</Text>
            <Text style={styles.statLabel}>完成率</Text>
          </View>

          {/* 任务数 */}
          <View style={[styles.statCard, styles.cardInfo]}>
            <Text style={styles.statValue}>📋</Text>
            <Text style={styles.statNumber}>
              {stats.completedTasks}/{stats.totalTasks}
            </Text>
            <Text style={styles.statLabel}>任务完成</Text>
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 建议</Text>
          <Text style={styles.infoText}>
            {stats.completedPomodoros === 0
              ? '今天还没有开始番茄呢，赶快开始吧！'
              : stats.completedPomodoros < 8
              ? `继续努力，今天已完成 ${stats.completedPomodoros} 个番茄，加油！`
              : '太棒了！今天已经完成了很多番茄！'}
          </Text>
        </View>

        {/* 周统计预留 */}
        <View style={styles.sectionPlaceholder}>
          <Text style={styles.placeholderText}>
            📈 周统计和详细报告敬请期待...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: cardWidth,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPrimary: {
    backgroundColor: '#FFEBEE',
  },
  cardAccent: {
    backgroundColor: '#FFF8E1',
  },
  cardSuccess: {
    backgroundColor: '#F1F8E9',
  },
  cardInfo: {
    backgroundColor: '#E3F2FD',
  },
  statValue: {
    fontSize: 32,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB300',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFB300',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  sectionPlaceholder: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 13,
    color: '#999',
  },
});
