import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TomatoDots } from '../components/TomatoDots';
import { useAppTheme } from '../hooks/useAppTheme';
import { useTasks } from '../hooks/useTasks';
import { useTranslation } from '../hooks/useTranslation';
import { tokens } from '../theme/tokens';
import { Task } from '../types/task';
import { getTaskStateLabel } from '../utils/taskLabels';
import { formatTomatoProgress } from '../utils/tomatoProgress';

type TaskTab = 'today' | 'backlog' | 'completed';

export function TasksScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    currentTask,
    todayTasks,
    backlogTasks,
    completedTasks,
    addTask,
    updateTask,
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
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBloom, { backgroundColor: theme.colors.bloomTop }]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('tasks.title')}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.muted }]}>{t('tasks.subtitle')}</Text>
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
          <Text style={[styles.inputLabel, { color: theme.colors.muted }]}>{t('tasks.quickAdd')}</Text>
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
              placeholder={t('tasks.quickAddPlaceholder')}
              placeholderTextColor={theme.colors.muted}
              returnKeyType="done"
              onSubmitEditing={handleAddTask}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('tasks.add')}
              onPress={handleAddTask}
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.colors.primary },
                pressed && styles.quietPressed,
              ]}
            >
              <Text style={[styles.addButtonText, { color: theme.colors.onPrimary }]}>{t('tasks.add')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {(['today', 'backlog', 'completed'] as TaskTab[]).map(tab => {
            const isActive = tab === activeTab;
            const label = tab === 'today'
              ? t('task.today')
              : tab === 'backlog'
                ? t('tasks.backlog')
                : t('tasks.completed');

            return (
              <Pressable
                key={tab}
                accessibilityRole="button"
                accessibilityLabel={label}
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
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{t('tasks.emptyTitle')}</Text>
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>{t('tasks.emptyCopy')}</Text>
            </View>
          ) : (
            displayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                isCurrentTask={task.id === currentTask?.id || task.state === 'active'}
                activeTab={activeTab}
                onMoveToToday={moveTaskToToday}
                onSetCurrentTask={setCurrentTask}
                onUpdateTask={updateTask}
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
  isCurrentTask,
  activeTab,
  onMoveToToday,
  onSetCurrentTask,
  onUpdateTask,
  onCompleteTask,
  onArchiveTask,
}: {
  task: Task;
  isCurrentTask: boolean;
  activeTab: TaskTab;
  onMoveToToday: (id: string) => void;
  onSetCurrentTask: (id: string) => void;
  onUpdateTask: (id: string, patch: Partial<Task>) => void;
  onCompleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
}) {
  const theme = useAppTheme();
  const { language, t } = useTranslation();
  const stateLabel = isCurrentTask ? t('task.currentFocus') : getTaskStateLabel(task.state, language);

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
        {formatTomatoProgress(task.completedTomatoes, task.estimatedTomatoes, language)}
      </Text>

      <View
        style={[
          styles.tomatoInfoPanel,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
          },
        ]}
      >
        <View style={styles.tomatoInfoRow}>
          <View style={styles.tomatoInfoCopy}>
            <Text style={[styles.tomatoInfoLabel, { color: theme.colors.text }]}>
              {t('tasks.estimateLabel')}
            </Text>
            <Text style={[styles.tomatoInfoHint, { color: theme.colors.muted }]}>
              {t('tasks.estimateHint')}
            </Text>
          </View>
          <View
            style={[
              styles.estimateStepper,
              {
                backgroundColor: theme.colors.input,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <EstimateButton
              label={t('tasks.decreaseEstimate')}
              disabled={task.estimatedTomatoes <= 1}
              onPress={() => onUpdateTask(task.id, {
                estimatedTomatoes: Math.max(1, task.estimatedTomatoes - 1),
              })}
            >
              -
            </EstimateButton>
            <Text style={[styles.estimateValue, { color: theme.colors.text }]}>
              {task.estimatedTomatoes}
            </Text>
            <EstimateButton
              label={t('tasks.increaseEstimate')}
              disabled={task.estimatedTomatoes >= 12}
              onPress={() => onUpdateTask(task.id, {
                estimatedTomatoes: Math.min(12, task.estimatedTomatoes + 1),
              })}
            >
              +
            </EstimateButton>
          </View>
        </View>

        <View style={styles.tomatoInfoRow}>
          <View style={styles.tomatoInfoCopy}>
            <Text style={[styles.tomatoInfoLabel, { color: theme.colors.text }]}>
              {t('tasks.completedLabel')}
            </Text>
            <Text style={[styles.tomatoInfoHint, { color: theme.colors.muted }]}>
              {t('tasks.completedHint')}
            </Text>
          </View>
          <View style={[styles.completedCountPill, { backgroundColor: theme.colors.surfaceSoft }]}>
            <Text style={[styles.completedCountText, { color: theme.colors.primaryHover }]}>
              {task.completedTomatoes}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {activeTab === 'backlog' ? (
          <ActionChip label={t('tasks.moveToToday')} onPress={() => onMoveToToday(task.id)} />
        ) : null}

        {activeTab !== 'completed' && !isCurrentTask ? (
          <ActionChip label={t('tasks.setFocus')} onPress={() => onSetCurrentTask(task.id)} />
        ) : null}

        {activeTab !== 'completed' ? (
          <ActionChip label={t('tasks.markComplete')} onPress={() => onCompleteTask(task.id)} />
        ) : null}

        <ActionChip label={t('tasks.archive')} onPress={() => onArchiveTask(task.id)} quiet />
      </View>
    </View>
  );
}

function EstimateButton({
  children,
  disabled,
  label,
  onPress,
}: {
  children: string;
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.estimateButton,
        {
          backgroundColor: disabled
            ? theme.colors.disabled
            : pressed
              ? theme.colors.primarySoft
              : theme.colors.surfaceSoft,
        },
      ]}
    >
      <Text
        style={[
          styles.estimateButtonText,
          { color: disabled ? theme.colors.disabledText : theme.colors.primaryHover },
        ]}
      >
        {children}
      </Text>
    </Pressable>
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
    paddingBottom: 132,
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
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.cardTranslucent,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
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
  tomatoInfoPanel: {
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.surface,
    padding: 14,
    gap: 14,
    marginBottom: 14,
  },
  tomatoInfoRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tomatoInfoCopy: {
    flex: 1,
    gap: 3,
  },
  tomatoInfoLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.text,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  tomatoInfoHint: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
  },
  estimateStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    backgroundColor: tokens.colors.input,
    overflow: 'hidden',
  },
  estimateButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surfaceSoft,
  },
  estimateButtonText: {
    fontSize: 19,
    lineHeight: 22,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '700',
  },
  estimateValue: {
    minWidth: 38,
    fontSize: 17,
    lineHeight: 22,
    color: tokens.colors.text,
    textAlign: 'center',
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  completedCountPill: {
    minWidth: 48,
    minHeight: 36,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  completedCountText: {
    fontSize: 16,
    lineHeight: 20,
    color: tokens.colors.primaryHover,
    fontFamily: tokens.typography.headingFamily,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  actionChip: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.primarySoft,
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
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
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: tokens.radius.pill,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionChipQuietText: {
    fontSize: 12,
    color: tokens.colors.muted,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
});
