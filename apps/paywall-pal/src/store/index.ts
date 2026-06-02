/**
 * @fileoverview 全局状态管理 (Zustand)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AnalysisResult,
  Quote,
  QuoteItem,
  RejectionConfig,
  RejectionMessage,
  Subscription,
  UsageRecord,
} from "@/types";
import { analyzeMessage } from "@/lib/analyzer";
import { generateRejection } from "@/lib/rejection-generator";
import { createDefaultQuoteItem } from "@/lib/quote-generator";

/** 应用活跃视图 */
export type ActiveView = "analyze" | "reject" | "quote";

interface AppState {
  /** 当前活跃视图 */
  activeView: ActiveView;
  /** 深色模式 */
  darkMode: boolean;
  /** 用户输入的消息 */
  inputMessage: string;
  /** 分析结果 */
  analysisResult: AnalysisResult | null;
  /** 拒绝配置 */
  rejectionConfig: RejectionConfig;
  /** 生成的拒绝消息 */
  rejectionMessage: RejectionMessage | null;
  /** 当前报价单 */
  quote: Quote;
  /** 订阅状态 */
  subscription: Subscription;
  /** 使用记录 */
  usageHistory: UsageRecord[];

  /** Actions */
  setActiveView: (view: ActiveView) => void;
  toggleDarkMode: () => void;
  setInputMessage: (msg: string) => void;
  runAnalysis: () => void;
  setRejectionConfig: (config: Partial<RejectionConfig>) => void;
  generateRejectionMsg: () => void;
  updateQuote: (updates: Partial<Quote>) => void;
  addQuoteItem: () => void;
  removeQuoteItem: (id: string) => void;
  updateQuoteItem: (id: string, updates: Partial<QuoteItem>) => void;
  loadPreset: (items: Omit<QuoteItem, "id">[]) => void;
  canUseFeature: () => boolean;
  recordUsage: (action: UsageRecord["action"], inputSummary: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeView: "analyze",
      darkMode: false,
      inputMessage: "",
      analysisResult: null,
      rejectionConfig: {
        tone: "professional",
        includeQuote: true,
        signature: "",
      },
      rejectionMessage: null,
      quote: {
        clientName: "",
        projectName: "",
        items: [createDefaultQuoteItem()],
        notes: "",
        validDays: 30,
        currency: "USD",
      },
      subscription: {
        plan: "free",
        freeUsesRemaining: 3,
        maxFreeUses: 3,
      },
      usageHistory: [],

      setActiveView: (view) => set({ activeView: view }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setInputMessage: (msg) => set({ inputMessage: msg }),

      runAnalysis: () => {
        const { inputMessage, canUseFeature, recordUsage } = get();
        if (!canUseFeature()) return;
        const result = analyzeMessage(inputMessage);
        recordUsage("analyze", inputMessage.slice(0, 50));
        set({ analysisResult: result });
      },

      setRejectionConfig: (config) =>
        set((state) => ({
          rejectionConfig: { ...state.rejectionConfig, ...config },
        })),

      generateRejectionMsg: () => {
        const { rejectionConfig, canUseFeature, recordUsage } = get();
        if (!canUseFeature()) return;
        const msg = generateRejection(rejectionConfig);
        recordUsage("reject", `Tone: ${rejectionConfig.tone}`);
        set({ rejectionMessage: msg });
      },

      updateQuote: (updates) =>
        set((state) => ({ quote: { ...state.quote, ...updates } })),

      addQuoteItem: () =>
        set((state) => ({
          quote: {
            ...state.quote,
            items: [...state.quote.items, createDefaultQuoteItem()],
          },
        })),

      removeQuoteItem: (id) =>
        set((state) => ({
          quote: {
            ...state.quote,
            items: state.quote.items.filter((item) => item.id !== id),
          },
        })),

      updateQuoteItem: (id, updates) =>
        set((state) => ({
          quote: {
            ...state.quote,
            items: state.quote.items.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          },
        })),

      loadPreset: (presetItems) =>
        set((state) => ({
          quote: {
            ...state.quote,
            items: presetItems.map((item) => ({
              ...item,
              id: crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            })),
          },
        })),

      canUseFeature: () => {
        const { subscription } = get();
        if (subscription.plan !== "free") return true;
        return subscription.freeUsesRemaining > 0;
      },

      recordUsage: (action, inputSummary) =>
        set((state) => {
          const newHistory = [
            ...state.usageHistory,
            { timestamp: Date.now(), action, inputSummary },
          ];
          const newSubscription =
            state.subscription.plan === "free"
              ? {
                  ...state.subscription,
                  freeUsesRemaining: Math.max(0, state.subscription.freeUsesRemaining - 1),
                }
              : state.subscription;
          return { usageHistory: newHistory, subscription: newSubscription };
        }),
    }),
    {
      name: "paywall-pal-storage",
      partialize: (state) => ({
        darkMode: state.darkMode,
        subscription: state.subscription,
        usageHistory: state.usageHistory,
        rejectionConfig: state.rejectionConfig,
        quote: state.quote,
      }),
    }
  )
);
