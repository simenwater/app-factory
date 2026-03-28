import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/store/useStore';
import type { Chart } from '@/types';

describe('useStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => {
      useStore.setState({
        user: {
          id: 'test-user',
          subscription: 'free',
          generationsUsed: 0,
          generationsLimit: 10,
          exportsUsed: 0,
          exportsLimit: 5,
        },
        charts: [],
        currentChart: null,
        activeFormat: 'mermaid',
      });
    });
    void result;
  });

  it('应该初始化默认状态', () => {
    const { result } = renderHook(() => useStore());

    expect(result.current.user.subscription).toBe('free');
    expect(result.current.user.generationsLimit).toBe(10);
    expect(result.current.user.exportsLimit).toBe(5);
    expect(result.current.charts).toEqual([]);
    expect(result.current.currentChart).toBeNull();
    expect(result.current.activeFormat).toBe('mermaid');
  });

  it('应该添加图表', () => {
    const { result } = renderHook(() => useStore());

    const chart: Chart = {
      id: 'test-1',
      title: '测试图表',
      description: '测试描述',
      chartType: 'flowchart',
      renderFormat: 'mermaid',
      code: 'flowchart TD\n  A-->B',
      createdAt: new Date(),
    };

    act(() => {
      result.current.addChart(chart);
    });

    expect(result.current.charts).toHaveLength(1);
    expect(result.current.charts[0]).toEqual(chart);
    expect(result.current.currentChart).toEqual(chart);
  });

  it('应该删除图表', () => {
    const { result } = renderHook(() => useStore());

    const chart: Chart = {
      id: 'test-1',
      title: '测试图表',
      description: '测试',
      chartType: 'flowchart',
      renderFormat: 'mermaid',
      code: 'flowchart TD\n  A-->B',
      createdAt: new Date(),
    };

    act(() => {
      result.current.addChart(chart);
      result.current.deleteChart('test-1');
    });

    expect(result.current.charts).toHaveLength(0);
    expect(result.current.currentChart).toBeNull();
  });

  it('应该更新图表代码', () => {
    const { result } = renderHook(() => useStore());

    const chart: Chart = {
      id: 'test-1',
      title: '测试图表',
      description: '测试',
      chartType: 'flowchart',
      renderFormat: 'mermaid',
      code: 'flowchart TD\n  A-->B',
      createdAt: new Date(),
    };

    act(() => {
      result.current.addChart(chart);
      result.current.updateChartCode('test-1', 'flowchart LR\n  X-->Y');
    });

    expect(result.current.charts[0].code).toBe('flowchart LR\n  X-->Y');
    expect(result.current.currentChart?.code).toBe('flowchart LR\n  X-->Y');
  });

  it('应该切换渲染格式', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.setActiveFormat('plantuml');
    });

    expect(result.current.activeFormat).toBe('plantuml');
  });

  it('应该增加生成次数', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.incrementGenerations();
    });

    expect(result.current.user.generationsUsed).toBe(1);
  });

  it('应该增加导出次数', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.incrementExports();
    });

    expect(result.current.user.exportsUsed).toBe(1);
  });

  it('应该升级到 Pro 版本', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.upgradeToPro();
    });

    expect(result.current.user.subscription).toBe('pro');
    expect(result.current.user.generationsLimit).toBeGreaterThan(1000);
    expect(result.current.user.exportsLimit).toBeGreaterThan(1000);
  });
});
