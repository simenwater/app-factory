/**
 * @fileoverview 全局状态管理 (Zustand)
 */

import { create } from 'zustand';
import type {
  ValueMetrics,
  CostMetrics,
  PricingResult,
  Competitor,
  CompetitorMatrix,
  CopywritingInput,
  CopywritingResult,
  UserState,
} from '@/types';
import { calculatePricing } from '@/lib/pricing-engine';
import { generateCompetitorMatrix, calculateAveragePrice } from '@/lib/competitor-engine';
import { generateCopywriting } from '@/lib/copywriting-engine';

interface AppState {
  /** 价值指标 */
  valueMetrics: ValueMetrics;
  /** 成本指标 */
  costMetrics: CostMetrics;
  /** 定价结果 */
  pricingResult: PricingResult | null;
  /** 竞品列表 */
  competitors: Competitor[];
  /** 竞品矩阵 */
  competitorMatrix: CompetitorMatrix | null;
  /** 文案输入 */
  copywritingInput: CopywritingInput;
  /** 文案结果 */
  copywritingResult: CopywritingResult | null;
  /** 用户状态 */
  user: UserState;
  /** 当前活跃标签页 */
  activeTab: 'pricing' | 'competitors' | 'copywriting';

  /** 更新价值指标 */
  setValueMetrics: (metrics: Partial<ValueMetrics>) => void;
  /** 更新成本指标 */
  setCostMetrics: (metrics: Partial<CostMetrics>) => void;
  /** 执行定价计算 */
  runPricingCalculation: () => void;
  /** 添加竞品 */
  addCompetitor: (competitor: Competitor) => void;
  /** 删除竞品 */
  removeCompetitor: (index: number) => void;
  /** 生成竞品矩阵 */
  generateMatrix: (yourPrice: number, yourFeatures: string[]) => void;
  /** 更新文案输入 */
  setCopywritingInput: (input: Partial<CopywritingInput>) => void;
  /** 生成文案 */
  generateCopy: () => void;
  /** 切换标签页 */
  setActiveTab: (tab: AppState['activeTab']) => void;
}

const defaultValueMetrics: ValueMetrics = {
  hoursSavedPerUse: 2,
  engineerHourlyRate: 75,
  usageFrequencyPerMonth: 20,
  reliabilityImprovement: 15,
  alternativeCost: 50,
};

const defaultCostMetrics: CostMetrics = {
  infrastructureCost: 200,
  apiCost: 100,
  customerAcquisitionCost: 50,
  targetMargin: 70,
};

const defaultCopywritingInput: CopywritingInput = {
  productName: 'My SaaS Tool',
  productDescription: '一款帮助开发者提升效率的工具',
  targetAudience: '独立开发者和小型技术团队',
  valueProposition: '节省 80% 的重复工作时间',
  pricingTiers: [
    { name: '免费版', price: 0, features: ['基础功能', '社区支持', '3 个项目'], isRecommended: false },
    { name: '专业版', price: 19, features: ['全部功能', '优先支持', '无限项目', 'API 访问', '团队协作'], isRecommended: true, badge: '最受欢迎' },
    { name: '企业版', price: 49, features: ['全部专业版功能', '专属客服', 'SLA 保证', '自定义集成', '数据导出', '审计日志'], isRecommended: false },
  ],
};

export const useAppStore = create<AppState>((set, get) => ({
  valueMetrics: defaultValueMetrics,
  costMetrics: defaultCostMetrics,
  pricingResult: null,
  competitors: [],
  competitorMatrix: null,
  copywritingInput: defaultCopywritingInput,
  copywritingResult: null,
  user: { plan: 'free', usageCount: 0, freeLimit: 5 },
  activeTab: 'pricing',

  setValueMetrics: (metrics) =>
    set((state) => ({ valueMetrics: { ...state.valueMetrics, ...metrics } })),

  setCostMetrics: (metrics) =>
    set((state) => ({ costMetrics: { ...state.costMetrics, ...metrics } })),

  runPricingCalculation: () => {
    const { valueMetrics, costMetrics, competitors } = get();
    const avgPrice = calculateAveragePrice(competitors);
    const result = calculatePricing(valueMetrics, costMetrics, avgPrice);
    set({ pricingResult: result });
  },

  addCompetitor: (competitor) =>
    set((state) => ({ competitors: [...state.competitors, competitor] })),

  removeCompetitor: (index) =>
    set((state) => ({
      competitors: state.competitors.filter((_, i) => i !== index),
    })),

  generateMatrix: (yourPrice, yourFeatures) => {
    const { competitors } = get();
    const matrix = generateCompetitorMatrix(competitors, yourPrice, yourFeatures);
    set({ competitorMatrix: matrix });
  },

  setCopywritingInput: (input) =>
    set((state) => ({ copywritingInput: { ...state.copywritingInput, ...input } })),

  generateCopy: () => {
    const { copywritingInput } = get();
    const result = generateCopywriting(copywritingInput);
    set({ copywritingResult: result });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}));
