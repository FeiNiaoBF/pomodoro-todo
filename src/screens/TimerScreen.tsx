import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTimer } from '../hooks/useTimer';
import { useTodos } from '../hooks/useTodos';
import { TimerRing } from '../components/TimerRing';

/**
 * TimerScreen - 计时器主屏幕
 *
 * 设计理念：
 * - 计时器是绝对视觉焦点
 * - 番茄红色主色调传达专注仪式感
 * - 动画流畅但不过度
 * - 交互清晰，触摸区域充足 (>44px)
 */
export function TimerScreen() {
  const timer = useTimer();
  const { getActiveTasks } = useTodos();
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  const activeTasks = useMemo(() => getActiveTasks(), [getActiveTasks]);
  const selectedTask = useMemo(
    () => activeTasks.find(t => t.id === selectedTaskId),
    [selectedTaskId, activeTasks]
  );

  // 获取当前阶段显示信息
  const phaseInfo = useMemo(() => {
    switch (timer.phase) {
      case 'focus':
        return {
          label: '番茄专注',
          color: '#E53935',
          bgColor: '#FFF3E0',
        };
      case 'shortBreak':
        return {
          label: '短休息',
          color: '#FFB300',
          bgColor: '#FFF8E1',
        };
      case 'longBreak':
        return {
          label: '长休息',
          color: '#43A047',
          bgColor: '#F1F8E9',
        };
    }
  }, [timer.phase]);

  const handleStart = () => {
    timer.start(selectedTaskId);
  };

  const handlePause = () => {
    timer.pause();
  };

  const handleResume = () => {
    timer.resume();
  };

  const handleReset = () => {
    timer.reset();
  };

  const handleSkip = () => {
    timer.skip();
  };

  // 状态判断
  const isIdle = timer.status === 'idle';
  const isRunning = timer.status === 'running';
  const isPaused = timer.status === 'paused';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: phaseInfo.bgColor }]}>
      {/* 顶部：阶段标题和统计 */}
      <View style={styles.header}>
        <Text style={styles.phaseLabel}>{phaseInfo.label}</Text>
        <Text style={styles.completedCount}>
          今日完成: {timer.completedPomodoros} 🍅
        </Text>
      </View>

      {/* 中心：环形进度条 + 倒计时 */}
      <View style={styles.timerSection}>
        <TimerRing
          progress={timer.progress}
          phase={timer.phase}
          displayTime={timer.displayTime}
          phaseLabel={phaseInfo.label}
        />
      </View>

      {/* 任务选择 */}
      {timer.phase === 'focus' && isIdle && (
        <View style={styles.taskSelector}>
          <Text style={styles.taskLabel}>绑定任务 (可选)</Text>
          <TouchableOpacity
            style={[
              styles.taskOption,
              !selectedTaskId && styles.taskOptionActive,
            ]}
            onPress={() => setSelectedTaskId(undefined)}
          >
            <Text style={styles.taskOptionText}>
              {!selectedTaskId ? '✓' : ''} 无绑定
            </Text>
          </TouchableOpacity>
          {activeTasks.slice(0, 3).map(task => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskOption,
                selectedTaskId === task.id && styles.taskOptionActive,
              ]}
              onPress={() => setSelectedTaskId(task.id)}
            >
              <Text
                style={[
                  styles.taskOptionText,
                  selectedTaskId === task.id && styles.taskOptionTextActive,
                ]}
                numberOfLines={1}
              >
                {selectedTaskId === task.id ? '✓' : ''} {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 当前任务显示 */}
      {selectedTask && timer.status !== 'idle' && (
        <View style={styles.currentTask}>
          <Text style={styles.currentTaskText} numberOfLines={1}>
            当前任务: {selectedTask.title}
          </Text>
        </View>
      )}

      {/* 控制按钮 */}
      <View style={styles.controls}>
        {isIdle ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonStart]}
            onPress={handleStart}
          >
            <Text style={styles.buttonText}>开始</Text>
          </TouchableOpacity>
        ) : (
          <>
            {isRunning && (
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handlePause}
              >
                <Text style={styles.buttonText}>暂停</Text>
              </TouchableOpacity>
            )}
            {isPaused && (
              <TouchableOpacity
                style={[styles.button, styles.buttonStart]}
                onPress={handleResume}
              >
                <Text style={styles.buttonText}>继续</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>重置</Text>
            </TouchableOpacity>
          </>
        )}
        {!isIdle && (
          <TouchableOpacity
            style={[styles.button, styles.buttonTertiary]}
            onPress={handleSkip}
          >
            <Text style={styles.buttonText}>跳过</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  phaseLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  completedCount: {
    fontSize: 14,
    color: '#666',
  },
  timerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  taskSelector: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  taskLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  taskOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DDD',
  },
  taskOptionActive: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#E53935',
  },
  taskOptionText: {
    fontSize: 13,
    color: '#666',
  },
  taskOptionTextActive: {
    color: '#E53935',
    fontWeight: '500',
  },
  currentTask: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(229, 57, 53, 0.08)',
    borderRadius: 8,
    marginBottom: 16,
  },
  currentTaskText: {
    fontSize: 13,
    color: '#AB000D',
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    minWidth: 80,
  },
  buttonStart: {
    backgroundColor: '#E53935',
  },
  buttonSecondary: {
    backgroundColor: '#FFB300',
  },
  buttonTertiary: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});
