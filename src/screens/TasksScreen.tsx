import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TomatoDots } from '../components/TomatoDots';
import { useAppTheme } from '../hooks/useAppTheme';
import { useTasks } from '../hooks/useTasks';
import { tokens } from '../theme/tokens';
import { Task } from '../types/task';

type TaskTab = 'today' | 'backlog' | 'completed';

export function TasksScreen() {
  const theme = useAppTheme();
  const {
    todayTasks,
    backlogTasks,
    completedTasks,
    addTask,
    moveTaskToToday,
    setCurrentTask,
    completeTask,
    archiveTask,
  } = useTasks();

  const [activeTab, setActiveTab] = useState<TaskTab>('today');
  const [inputValue, setInputValue] = useState('');

  const displayTasks = useMemo(() => {
    switch (activeTab) {
      case 'backlog':
        return backlogTasks;
      case 'completed':
        return completedTasks;
      default:
        return todayTasks;
    }
  }, [activeTab, backlogTasks, completedTasks, todayTasks]);

  const handleAddTask = () => {
    const title = inputValue.trim();
    if (!title) {
      return;
    }

    addTask({
      title,
      state: activeTab === 'today' ? 'today' : 'backlog',
    });
    setInputValue('');
  };

  const tabCounts = {
    today: todayTasks.length,
    backlog: backlogTasks.length,
    completed: completedTasks.length,
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBloom, { backgroundColor: theme.colors.bloomTop }]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Tasks</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.muted }]}>Plan lightly. Focus clearly.</Text>
        </View>

        <View
          style={[
            styles.quickAddCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <Text style={[styles.inputLabel, { color: theme.colors.muted }]}>What needs your focus?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.input,
                  borderColor: theme.colors.outline,
                  color: theme.colors.text,
                },
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="What needs your focus?"
              placeholderTextColor={theme.colors.muted}
              returnKeyType="done"
              onSubmitEditing={handleAddTask}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add task"
              onPress={handleAddTask}
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.colors.primary },
                pressed && styles.quietPressed,
              ]}
            >
              <Text style={[styles.addButtonText, { color: theme.colors.onPrimary }]}>Add</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {(['today', 'backlog', 'completed'] as TaskTab[]).map(tab => {
            const isActive = tab === activeTab;
            const label = tab[0].toUpperCase() + tab.slice(1);

            return (
              <Pressable
                key={tab}
                accessibilityRole="button"
                accessibilityLabel={`${label} tasks`}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isActive ? theme.colors.primarySoft : theme.colors.cardTranslucent,
                    borderColor: isActive ? theme.colors.primary : theme.colors.outline,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    { color: isActive ? theme.colors.primaryHover : theme.colors.muted },
                  ]}
                >
                  {label} ({tabCounts[tab]})
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.list}>
          {displayTasks.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: theme.colors.cardTranslucent,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Nothing here yet.</Text>
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>Add a small task and keep the plan light.</Text>
            </View>
          ) : (
            displayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                activeTab={activeTab}
                onMoveToToday={moveTaskToToday}
                onSetCurrentTask={setCurrentTask}
                onCompleteTask={completeTask}
                onArchiveTask={archiveTask}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskCard({
  task,
  activeTab,
  onMoveToToday,
  onSetCurrentTask,
  onCompleteTask,
  onArchiveTask,
}: {
  task: Task;
  activeTab: TaskTab;
  onMoveToToday: (id: string) => void;
  onSetCurrentTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
}) {
  const theme = useAppTheme();
  const stateLabel = task.state === 'active' ? 'Current focus' : task.state;

  return (
    <View
      style={[
        styles.taskCard,
        {
          backgroundColor: theme.colors.cardTranslucent,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <View style={styles.taskCardHeader}>
        <View style={[styles.statePill, { backgroundColor: theme.colors.surfaceSoft }]}>
          <Text style={[styles.statePillText, { color: theme.colors.primaryHover }]}>{stateLabel}</Text>
        </View>
        <TomatoDots
          total={task.estimatedTomatoes}
          completed={Math.min(task.completedTomatoes, task.estimatedTomatoes)}
          size="sm"
        />
      </View>

      <Text style={[styles.taskTitle, { color: theme.colors.text }]}>{task.title}</Text>
      {task.description ? (
        <Text style={[styles.taskDescription, { color: theme.colors.muted }]}>{task.description}</Text>
      ) : null}

      <Text style={[styles.taskMeta, { color: theme.colors.muted }]}>
        {task.completedTomatoes}/{task.estimatedTomatoes} tomatoes
      </Text>

      <View style={styles.actionRow}>
        {activeTab === 'backlog' ? (
          <ActionChip label="Move to Today" onPress={() => onMoveToToday(task.id)} />
        ) : null}

        {activeTab !== 'completed' ? (
          <ActionChip label="Set Focus" onPress={() => onSetCurrentTask(task.id)} />
        ) : null}

        {activeTab !== 'completed' ? (
          <ActionChip label="Mark Complete" onPress={() => onCompleteTask(task.id)} />
        ) : null}

        <ActionChip label="Archive" onPress={() => onArchiveTask(task.id)} quiet />
      </View>
    </View>
  );
}

function ActionChip({
  label,
  onPress,
  quiet = false,
}: {
  label: string;
  onPress: () => void;
  quiet?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        quiet ? styles.actionChipQuiet : styles.actionChip,
        quiet
          ? { borderColor: theme.colors.outline }
          : {
              backgroundColor: theme.colors.primarySoft,
              borderColor: theme.colors.outline,
            },
        pressed && styles.actionChipPressed,
      ]}
    >
      <Text
        style={[
          quiet ? styles.actionChipQuietText : styles.actionChipText,
          { color: quiet ? theme.colors.muted : theme.colors.primaryHover },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  topBloom: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: tokens.colors.bloomTop,
    opacity: 0.8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 18,
  },
  header: {
    gap: 8,
  },
  headerTitle: {
    fontSize: tokens.typography.title,
    lineHeight: 38,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  quickAddCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.modal,
    padding: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    ...tokens.shadow,
  },
  inputLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 52,
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.input,
    paddingHorizontal: 16,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontSize: 15,
  },
  addButton: {
    minWidth: 74,
    minHeight: 52,
    borderRadius: tokens.radius.card,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  addButtonPressed: {
    backgroundColor: tokens.colors.primaryHover,
  },
  addButtonText: {
    color: tokens.colors.onPrimary,
    fontSize: 15,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  tabChipActive: {
    backgroundColor: tokens.colors.primarySoft,
    borderColor: tokens.colors.primary,
  },
  tabChipText: {
    fontSize: 13,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: tokens.colors.primaryHover,
  },
  list: {
    gap: 14,
  },
  emptyState: {
    backgroundColor: tokens.colors.cardTranslucent,
    borderRadius: tokens.radius.modal,
    padding: 24,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 26,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  taskCard: {
    backgroundColor: tokens.colors.cardTranslucent,
    borderRadius: tokens.radius.modal,
    padding: 18,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statePill: {
    backgroundColor: tokens.colors.surfaceSoft,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statePillText: {
    fontSize: 12,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  taskTitle: {
    fontSize: 20,
    lineHeight: 26,
    color: tokens.colors.text,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: 10,
  },
  taskMeta: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.primarySoft,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  actionChipPressed: {
    opacity: 0.9,
  },
  quietPressed: {
    opacity: 0.9,
  },
  actionChipText: {
    fontSize: 12,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  actionChipQuiet: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.outline,
  },
  actionChipQuietText: {
    fontSize: 12,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
});
