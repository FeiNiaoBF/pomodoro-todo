import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ListRenderItem,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { Task } from '../types';

/**
 * TodoScreen - 任务管理屏幕
 *
 * 设计理念：
 * - 清晰的任务列表，优先级用左边框颜色表示
 * - FlatList 性能优化，避免长列表卡顿
 * - 上方输入框快速添加任务
 * - 任务可滑动操作（后续实现）
 */
export function TodoScreen() {
  const { tasks, addTask, toggleTaskStatus, deleteTask, getActiveTasks } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTasks = useMemo(() => getActiveTasks(), [getActiveTasks]);
  const completedTasks = useMemo(
    () => tasks.filter(t => t.status === 'completed'),
    [tasks]
  );

  const displayTasks = useMemo(
    () => (showCompleted ? completedTasks : activeTasks),
    [showCompleted, completedTasks, activeTasks]
  );

  // 添加新任务
  const handleAddTask = useCallback(async () => {
    if (inputValue.trim().length === 0) return;
    try {
      await addTask(inputValue.trim());
      setInputValue('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }, [inputValue, addTask]);

  // 任务卡片渲染
  const renderTaskCard: ListRenderItem<Task> = useCallback(
    ({ item: task }) => (
      <TouchableOpacity
        style={[
          styles.taskCard,
          task.status === 'completed' && styles.taskCardCompleted,
        ]}
        onPress={() => toggleTaskStatus(task.id)}
      >
        {/* 优先级指示器 */}
        <View
          style={[
            styles.priorityBar,
            {
              backgroundColor:
                task.priority === 'high'
                  ? '#E53935'
                  : task.priority === 'medium'
                  ? '#FFB300'
                  : '#999',
            },
          ]}
        />

        {/* 任务内容 */}
        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              task.status === 'completed' && styles.taskTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.status === 'completed' ? '✓ ' : '○ '}
            {task.title}
          </Text>

          {/* 元数据 */}
          {task.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {task.tags.map(tag => (
                <Text key={tag} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.taskMeta}>
            {task.actualPomodoros} / {task.estimatedPomodoros} 番茄
          </Text>
        </View>

        {/* 删除按钮 */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteTask(task.id)}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [toggleTaskStatus, deleteTask]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 我的任务</Text>
        <Text style={styles.headerSubtitle}>
          {activeTasks.length} 个待完成
        </Text>
      </View>

      {/* 输入框 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="添加新任务..."
          placeholderTextColor="#CCC"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTask}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 筛选标签 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTag,
            !showCompleted && styles.filterTagActive,
          ]}
          onPress={() => setShowCompleted(false)}
        >
          <Text
            style={[
              styles.filterTagText,
              !showCompleted && styles.filterTagTextActive,
            ]}
          >
            进行中 ({activeTasks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTag,
            showCompleted && styles.filterTagActive,
          ]}
          onPress={() => setShowCompleted(true)}
        >
          <Text
            style={[
              styles.filterTagText,
              showCompleted && styles.filterTagTextActive,
            ]}
          >
            已完成 ({completedTasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 任务列表 */}
      {displayTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {showCompleted ? '还没有完成任务呢' : '没有待办任务，休息一下吧！'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayTasks}
          renderItem={renderTaskCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '300',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  filterTagActive: {
    backgroundColor: '#E53935',
  },
  filterTagText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  filterTagTextActive: {
    color: '#FFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  taskCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#999',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  priorityBar: {
    width: 3,
    height: '100%',
    borderRadius: 1.5,
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  tag: {
    fontSize: 10,
    color: '#FFB300',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskMeta: {
    fontSize: 11,
    color: '#999',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#FFEBEE',
  },
  deleteBtnText: {
    fontSize: 18,
    color: '#E53935',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
});
