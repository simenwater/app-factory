import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chart, User, RenderFormat } from '@/types';

interface AppState {
  user: User;
  charts: Chart[];
  currentChart: Chart | null;
  activeFormat: RenderFormat;

  /**
   * @description 设置当前图表
   */
  setCurrentChart: (chart: Chart | null) => void;

  /**
   * @description 添加新图表
   */
  addChart: (chart: Chart) => void;

  /**
   * @description 删除图表
   */
  deleteChart: (id: string) => void;

  /**
   * @description 更新图表代码
   */
  updateChartCode: (id: string, code: string) => void;

  /**
   * @description 切换渲染格式
   */
  setActiveFormat: (format: RenderFormat) => void;

  /**
   * @description 增加生成次数
   */
  incrementGenerations: () => void;

  /**
   * @description 增加导出次数
   */
  incrementExports: () => void;

  /**
   * @description 升级订阅
   */
  upgradeToPro: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        id: 'demo-user',
        subscription: 'free',
        generationsUsed: 0,
        generationsLimit: 10,
        exportsUsed: 0,
        exportsLimit: 5,
      },
      charts: [],
      currentChart: null,
      activeFormat: 'mermaid',

      setCurrentChart: (chart) => set({ currentChart: chart }),

      addChart: (chart) =>
        set((state) => ({
          charts: [chart, ...state.charts],
          currentChart: chart,
        })),

      deleteChart: (id) =>
        set((state) => ({
          charts: state.charts.filter((c) => c.id !== id),
          currentChart:
            state.currentChart?.id === id ? null : state.currentChart,
        })),

      updateChartCode: (id, code) =>
        set((state) => ({
          charts: state.charts.map((c) =>
            c.id === id ? { ...c, code } : c
          ),
          currentChart:
            state.currentChart?.id === id
              ? { ...state.currentChart, code }
              : state.currentChart,
        })),

      setActiveFormat: (format) => set({ activeFormat: format }),

      incrementGenerations: () =>
        set((state) => ({
          user: {
            ...state.user,
            generationsUsed: state.user.generationsUsed + 1,
          },
        })),

      incrementExports: () =>
        set((state) => ({
          user: {
            ...state.user,
            exportsUsed: state.user.exportsUsed + 1,
          },
        })),

      upgradeToPro: () =>
        set((state) => ({
          user: {
            ...state.user,
            subscription: 'pro',
            generationsLimit: 999999,
            exportsLimit: 999999,
          },
        })),
    }),
    {
      name: 'chartflow-storage',
    }
  )
);
