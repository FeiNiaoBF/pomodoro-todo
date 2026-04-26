/**
 * useTimer Hook — 单元测试
 *
 * 测试范围：
 * - 初始状态
 * - start / pause / resume / reset
 * - skip 切换阶段
 * - 计时进度 & displayTime 格式化
 * - longBreak 按 longBreakInterval 触发
 * - setConfig 修改配置
 */
import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from '../../src/hooks/useTimer';

// 使用 Jest fake timers 控制 setInterval
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useTimer — 初始状态', () => {
  it('默认 phase=focus, status=idle, elapsed=0', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.phase).toBe('focus');
    expect(result.current.status).toBe('idle');
    expect(result.current.elapsed).toBe(0);
    expect(result.current.completedPomodoros).toBe(0);
  });

  it('默认 totalSeconds = 25 * 60 = 1500', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.totalSeconds).toBe(1500);
  });

  it('displayTime 初始为 25:00', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.displayTime).toBe('25:00');
  });

  it('progress 初始为 0', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.progress).toBe(0);
  });
});

describe('useTimer — start / pause / resume', () => {
  it('start 后 status=running', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    expect(result.current.status).toBe('running');
  });

  it('经过 5 秒 elapsed=5', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(5000); });
    expect(result.current.elapsed).toBe(5);
  });

  it('pause 后 status=paused，不再增加 elapsed', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(3000); });
    act(() => { result.current.pause(); });
    const elapsed = result.current.elapsed;
    act(() => { jest.advanceTimersByTime(5000); });
    expect(result.current.status).toBe('paused');
    expect(result.current.elapsed).toBe(elapsed); // 不变
  });

  it('resume 后继续计时', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(3000); });
    act(() => { result.current.pause(); });
    act(() => { result.current.resume(); });
    act(() => { jest.advanceTimersByTime(2000); });
    expect(result.current.status).toBe('running');
    expect(result.current.elapsed).toBe(5);
  });
});

describe('useTimer — reset', () => {
  it('reset 后 elapsed=0, status=idle', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(10000); });
    act(() => { result.current.reset(); });
    expect(result.current.elapsed).toBe(0);
    expect(result.current.status).toBe('idle');
  });
});

describe('useTimer — skip & phase rotation', () => {
  it('skip 从 focus → shortBreak（第1次）', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    act(() => { result.current.skip(); });
    expect(result.current.phase).toBe('shortBreak');
    expect(result.current.completedPomodoros).toBe(1);
  });

  it('第 4 次 skip 后 phase → longBreak', () => {
    const { result } = renderHook(() => useTimer());
    // focus→shortBreak→focus→shortBreak→focus→shortBreak→focus→longBreak
    for (let i = 0; i < 7; i++) {
      act(() => {
        result.current.start();
        result.current.skip();
      });
    }
    expect(result.current.phase).toBe('longBreak');
  });
});

describe('useTimer — setConfig', () => {
  it('setConfig 修改 focusDuration 后 totalSeconds 更新', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.setConfig({ focusDuration: 50 }); });
    expect(result.current.totalSeconds).toBe(50 * 60);
  });

  it('setConfig 修改 shortBreakDuration', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); result.current.skip(); }); // → shortBreak
    act(() => { result.current.setConfig({ shortBreakDuration: 10 }); });
    expect(result.current.totalSeconds).toBe(10 * 60);
  });
});

describe('useTimer — progress & displayTime', () => {
  it('progress 随 elapsed 增加', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(750000); }); // 750秒 = 50% of 25min
    expect(result.current.progress).toBeCloseTo(0.5, 1);
  });

  it('displayTime 在 1 分钟后显示 24:00', () => {
    const { result } = renderHook(() => useTimer());
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(60000); }); // 60秒
    expect(result.current.displayTime).toBe('24:00');
  });
});
