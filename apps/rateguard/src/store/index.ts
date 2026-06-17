/**
 * @fileoverview 全局状态管理 (Zustand)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  UserProfile,
  AnalysisRecord,
  SubscriptionStatus,
  ClientIntentAnalysis,
  PricingSuggestion,
  NegotiationTemplate,
} from "@/types";
import { analyzeClientMessage } from "@/lib/analyzer";
import { generatePricingSuggestion } from "@/lib/pricing";
import { generateTemplates } from "@/lib/templates";
import { createDefaultSubscription, canAnalyze } from "@/lib/subscription";

interface AppState {
  /** 用户配置 */
  profile: UserProfile;
  /** 分析历史记录 */
  history: AnalysisRecord[];
  /** 订阅状态 */
  subscription: SubscriptionStatus;
  /** 当前分析结果 */
  currentAnalysis: ClientIntentAnalysis | null;
  /** 当前定价建议 */
  currentPricing: PricingSuggestion | null;
  /** 当前话术模板 */
  currentTemplates: NegotiationTemplate[];
  /** 主题模式 */
  darkMode: boolean;

  /** 更新用户配置 */
  updateProfile: (profile: Partial<UserProfile>) => void;
  /** 执行消息分析 */
  analyzeMessage: (message: string) => boolean;
  /** 清除当前分析 */
  clearAnalysis: () => void;
  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 升级订阅 */
  upgradePlan: (plan: SubscriptionStatus["plan"]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: {
        industry: "web-development",
        experienceLevel: "mid",
        yearsOfExperience: 3,
        currency: "USD",
        minimumHourlyRate: 50,
      },
      history: [],
      subscription: createDefaultSubscription(),
      currentAnalysis: null,
      currentPricing: null,
      currentTemplates: [],
      darkMode: false,

      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),

      analyzeMessage: (message: string) => {
        const { subscription, profile } = get();

        if (!canAnalyze(subscription)) {
          return false;
        }

        const analysis = analyzeClientMessage(message);
        const pricing = generatePricingSuggestion(profile, analysis);
        const templates = generateTemplates(pricing, analysis);

        const record: AnalysisRecord = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          timestamp: Date.now(),
          clientMessage: message,
          analysis,
          pricing,
          templates,
        };

        set((state) => ({
          currentAnalysis: analysis,
          currentPricing: pricing,
          currentTemplates: templates,
          history: [record, ...state.history].slice(0, 50),
          subscription: {
            ...state.subscription,
            analysisCount: state.subscription.analysisCount + 1,
          },
        }));

        return true;
      },

      clearAnalysis: () =>
        set({
          currentAnalysis: null,
          currentPricing: null,
          currentTemplates: [],
        }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      upgradePlan: (plan) =>
        set((state) => ({
          subscription: {
            ...state.subscription,
            plan,
            maxAnalysis: plan === "free" ? 3 : 999,
            expiresAt:
              plan !== "free" ? Date.now() + 30 * 24 * 60 * 60 * 1000 : null,
          },
        })),
    }),
    {
      name: "rateguard-storage",
      partialize: (state) => ({
        profile: state.profile,
        history: state.history,
        subscription: state.subscription,
        darkMode: state.darkMode,
      }),
    }
  )
);
