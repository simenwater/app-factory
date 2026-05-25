import { create } from 'zustand';
import type {
  CompanyInfo,
  Position,
  SimulationResult,
} from '@/types';
import { generateCompensationPlan } from '@/lib/salary-engine';
import { simulateProfitImpact } from '@/lib/profit-simulator';
import { predictRetention } from '@/lib/retention-predictor';

/**
 * @interface AppState
 * @description 应用全局状态
 */
interface AppState {
  step: number;
  companyInfo: CompanyInfo;
  positions: Position[];
  simulationResult: SimulationResult | null;
  isDarkMode: boolean;
  isSimulating: boolean;

  setStep: (step: number) => void;
  setCompanyInfo: (info: Partial<CompanyInfo>) => void;
  addPosition: (position: Position) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, data: Partial<Position>) => void;
  runSimulation: () => void;
  toggleDarkMode: () => void;
  reset: () => void;
}

const DEFAULT_COMPANY: CompanyInfo = {
  name: '',
  industry: 'technology',
  region: 'us_west',
  annualRevenue: 1000000,
  employeeCount: 10,
  annualBudgetForSalaries: 500000,
};

/**
 * @description 生成模拟结果摘要
 */
function generateSummary(result: Omit<SimulationResult, 'summary' | 'overallScore' | 'createdAt'>): {
  summary: string;
  overallScore: number;
} {
  const { profitImpact, retentionPrediction, recommendations } = result;
  const avgIncrease = recommendations.length > 0
    ? recommendations.reduce((s, r) => s + r.salaryIncreasePercent, 0) / recommendations.length
    : 0;

  let score = 70;
  if (profitImpact.projectedProfitMargin > 10) score += 10;
  else if (profitImpact.projectedProfitMargin > 5) score += 5;
  if (retentionPrediction.retentionImprovement > 5) score += 10;
  else if (retentionPrediction.retentionImprovement > 2) score += 5;
  if (profitImpact.breakEvenMonths <= 6) score += 10;
  else if (profitImpact.breakEvenMonths <= 12) score += 5;
  score = Math.min(100, Math.max(0, score));

  const summary = `By increasing average compensation by ${avgIncrease.toFixed(1)}%, your projected profit margin shifts from ${profitImpact.currentProfitMargin}% to ${profitImpact.projectedProfitMargin}%. Employee retention is expected to improve by ${retentionPrediction.retentionImprovement} percentage points, potentially saving $${retentionPrediction.estimatedTurnoverCostSaved.toLocaleString()} in turnover costs annually. The investment breaks even in approximately ${profitImpact.breakEvenMonths} months.`;

  return { summary, overallScore: score };
}

export const useStore = create<AppState>((set, get) => ({
  step: 0,
  companyInfo: { ...DEFAULT_COMPANY },
  positions: [],
  simulationResult: null,
  isDarkMode: false,
  isSimulating: false,

  setStep: (step) => set({ step }),

  setCompanyInfo: (info) =>
    set((state) => ({
      companyInfo: { ...state.companyInfo, ...info },
    })),

  addPosition: (position) =>
    set((state) => ({
      positions: [...state.positions, position],
    })),

  removePosition: (id) =>
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== id),
    })),

  updatePosition: (id, data) =>
    set((state) => ({
      positions: state.positions.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  runSimulation: () => {
    const { companyInfo, positions } = get();
    set({ isSimulating: true });

    setTimeout(() => {
      const recommendations = generateCompensationPlan(companyInfo, positions);
      const retentionPrediction = predictRetention(companyInfo, positions, recommendations);
      const profitImpact = simulateProfitImpact(
        companyInfo,
        positions,
        recommendations,
        retentionPrediction.retentionImprovement
      );

      const partial = { companyInfo, positions, recommendations, profitImpact, retentionPrediction };
      const { summary, overallScore } = generateSummary(partial);

      set({
        simulationResult: {
          ...partial,
          summary,
          overallScore,
          createdAt: new Date().toISOString(),
        },
        isSimulating: false,
        step: 2,
      });
    }, 1200);
  },

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  reset: () =>
    set({
      step: 0,
      companyInfo: { ...DEFAULT_COMPANY },
      positions: [],
      simulationResult: null,
      isSimulating: false,
    }),
}));
