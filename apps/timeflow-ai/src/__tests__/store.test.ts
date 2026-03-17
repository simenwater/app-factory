import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/store/useStore';
import type { Timeline } from '@/types';

describe('useStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.user = {
        id: 'test-user',
        subscription: 'free',
        generationsUsed: 0,
        generationsLimit: 5,
      };
      result.current.timelines = [];
      result.current.currentTimeline = null;
    });
  });

  it('应该初始化默认状态', () => {
    const { result } = renderHook(() => useStore());

    expect(result.current.user.subscription).toBe('free');
    expect(result.current.user.generationsLimit).toBe(5);
    expect(result.current.timelines).toEqual([]);
    expect(result.current.currentTimeline).toBeNull();
  });

  it('应该添加时间线', () => {
    const { result } = renderHook(() => useStore());

    const timeline: Timeline = {
      id: 'test-1',
      title: '测试时间线',
      events: [],
      createdAt: new Date(),
    };

    act(() => {
      result.current.addTimeline(timeline);
    });

    expect(result.current.timelines).toHaveLength(1);
    expect(result.current.timelines[0]).toEqual(timeline);
    expect(result.current.currentTimeline).toEqual(timeline);
  });

  it('应该删除时间线', () => {
    const { result } = renderHook(() => useStore());

    const timeline: Timeline = {
      id: 'test-1',
      title: '测试时间线',
      events: [],
      createdAt: new Date(),
    };

    act(() => {
      result.current.addTimeline(timeline);
      result.current.deleteTimeline('test-1');
    });

    expect(result.current.timelines).toHaveLength(0);
    expect(result.current.currentTimeline).toBeNull();
  });

  it('应该增加生成次数', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.incrementGenerations();
    });

    expect(result.current.user.generationsUsed).toBe(1);
  });

  it('应该升级到 Pro 版本', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.upgradeToPro();
    });

    expect(result.current.user.subscription).toBe('pro');
    expect(result.current.user.generationsLimit).toBeGreaterThan(1000);
  });
});
