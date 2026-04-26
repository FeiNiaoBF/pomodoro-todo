/**
 * useTodos Hook — 单元测试
 *
 * 测试范围：
 * - 初始加载（空列表）
 * - addTask 新增任务
 * - deleteTask 删除任务
 * - toggleTaskStatus 切换状态
 * - getActiveTasks / getCompletedTasks 过滤
 * - getActiveTasks 优先级排序（high > medium > low）
 * - getTotalCompleted 计数
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTodos } from '../../src/hooks/useTodos';

// 每个测试前清空 AsyncStorage mock 的内部 store
beforeEach(async () => {
  const AsyncStorage =
    require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('useTodos — 初始状态', () => {
  it('初始 tasks 为空数组，loading 结束后为 false', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toEqual([]);
  });
});

describe('useTodos — addTask', () => {
  it('addTask 后 tasks 增加 1 条', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTask('写代码', 'high');
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('写代码');
    expect(result.current.tasks[0].priority).toBe('high');
    expect(result.current.tasks[0].status).toBe('active');
  });

  it('addTask 不传 priority 默认为 medium', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.addTask('默认优先级'); });

    expect(result.current.tasks[0].priority).toBe('medium');
  });
});

describe('useTodos — deleteTask', () => {
  it('deleteTask 后 tasks 长度减 1', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.addTask('任务A'); });
    const taskId = result.current.tasks[0].id;

    await act(async () => { await result.current.deleteTask(taskId); });

    expect(result.current.tasks).toHaveLength(0);
  });
});

describe('useTodos — toggleTaskStatus', () => {
  it('active → completed', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.addTask('切换任务'); });
    const taskId = result.current.tasks[0].id;

    await act(async () => { await result.current.toggleTaskStatus(taskId); });

    expect(result.current.tasks[0].status).toBe('completed');
    expect(result.current.tasks[0].completedAt).toBeDefined();
  });

  it('completed → active', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.addTask('切换任务'); });
    const taskId = result.current.tasks[0].id;

    await act(async () => { await result.current.toggleTaskStatus(taskId); }); // → completed
    await act(async () => { await result.current.toggleTaskStatus(taskId); }); // → active

    expect(result.current.tasks[0].status).toBe('active');
  });
});

describe('useTodos — getActiveTasks / getCompletedTasks', () => {
  it('正确区分活跃与已完成任务', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTask('任务1');
      await result.current.addTask('任务2');
    });
    const id1 = result.current.tasks[0].id;

    await act(async () => { await result.current.toggleTaskStatus(id1); });

    expect(result.current.getActiveTasks()).toHaveLength(1);
    expect(result.current.getCompletedTasks()).toHaveLength(1);
  });
});

describe('useTodos — getActiveTasks 优先级排序', () => {
  it('high > medium > low 排序', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTask('低优先级', 'low');
      await result.current.addTask('高优先级', 'high');
      await result.current.addTask('中优先级', 'medium');
    });

    const active = result.current.getActiveTasks();
    expect(active[0].priority).toBe('high');
    expect(active[1].priority).toBe('medium');
    expect(active[2].priority).toBe('low');
  });
});

describe('useTodos — getTotalCompleted', () => {
  it('getTotalCompleted 返回已完成数量', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTask('T1');
      await result.current.addTask('T2');
      await result.current.addTask('T3');
    });

    const ids = result.current.tasks.map(t => t.id);
    await act(async () => {
      await result.current.toggleTaskStatus(ids[0]);
      await result.current.toggleTaskStatus(ids[2]);
    });

    expect(result.current.getTotalCompleted()).toBe(2);
  });
});
