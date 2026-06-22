/**
 * @fileoverview Zustand 全局状态管理
 *
 * 使用 localStorage 持久化存储分析历史、费率标准、合同条款和用户设置。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnalysisResult,
  GeneratedReply,
  RateStandard,
  ContractClause,
  UserSettings,
} from "@/types";

/** Store 状态与操作 */
interface StoreState {
  analyses: AnalysisResult[];
  replies: GeneratedReply[];
  rateStandards: RateStandard[];
  contractClauses: ContractClause[];
  settings: UserSettings;

  addAnalysis: (analysis: AnalysisResult) => void;
  removeAnalysis: (id: string) => void;
  addReply: (reply: GeneratedReply) => void;
  removeReply: (id: string) => void;

  addRateStandard: (rate: RateStandard) => void;
  updateRateStandard: (id: string, updates: Partial<RateStandard>) => void;
  removeRateStandard: (id: string) => void;

  addContractClause: (clause: ContractClause) => void;
  updateContractClause: (id: string, updates: Partial<ContractClause>) => void;
  removeContractClause: (id: string) => void;

  updateSettings: (updates: Partial<UserSettings>) => void;
  decrementFreeUses: () => void;
  resetStore: () => void;
}

/** 默认用户设置 */
const DEFAULT_SETTINGS: UserSettings = {
  darkMode: false,
  currency: "CNY",
  defaultTone: "formal",
  displayName: "",
  subscriptionTier: "free",
  freeUsesRemaining: 5,
};

/** 预置合同条款 */
const DEFAULT_CLAUSES: ContractClause[] = [
  {
    id: "default-1",
    title: "预付款条款",
    content: "项目启动前需支付总费用的 50% 作为预付款。",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-2",
    title: "修改次数",
    content: "报价包含 2 次免费修改，超出部分按时薪另行计费。",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-3",
    title: "交付时间",
    content: "项目交付时间以双方确认的排期为准，紧急项目加收 30% 加急费。",
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      analyses: [],
      replies: [],
      rateStandards: [],
      contractClauses: DEFAULT_CLAUSES,
      settings: DEFAULT_SETTINGS,

      addAnalysis: (analysis) =>
        set((state) => ({ analyses: [analysis, ...state.analyses] })),

      removeAnalysis: (id) =>
        set((state) => ({
          analyses: state.analyses.filter((a) => a.id !== id),
          replies: state.replies.filter((r) => r.analysisId !== id),
        })),

      addReply: (reply) =>
        set((state) => ({ replies: [reply, ...state.replies] })),

      removeReply: (id) =>
        set((state) => ({ replies: state.replies.filter((r) => r.id !== id) })),

      addRateStandard: (rate) =>
        set((state) => ({
          rateStandards: [...state.rateStandards, rate],
        })),

      updateRateStandard: (id, updates) =>
        set((state) => ({
          rateStandards: state.rateStandards.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      removeRateStandard: (id) =>
        set((state) => ({
          rateStandards: state.rateStandards.filter((r) => r.id !== id),
        })),

      addContractClause: (clause) =>
        set((state) => ({
          contractClauses: [...state.contractClauses, clause],
        })),

      updateContractClause: (id, updates) =>
        set((state) => ({
          contractClauses: state.contractClauses.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeContractClause: (id) =>
        set((state) => ({
          contractClauses: state.contractClauses.filter((c) => c.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      decrementFreeUses: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            freeUsesRemaining: Math.max(0, state.settings.freeUsesRemaining - 1),
          },
        })),

      resetStore: () =>
        set({
          analyses: [],
          replies: [],
          rateStandards: [],
          contractClauses: DEFAULT_CLAUSES,
          settings: DEFAULT_SETTINGS,
        }),
    }),
    {
      name: "rateguard-storage",
    }
  )
);
