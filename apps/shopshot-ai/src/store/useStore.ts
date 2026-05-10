"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GenerationJob,
  GeneratedImage,
  UserSettings,
  SubscriptionTier,
  UsageStats,
} from "@/types";
import { getCurrentMonth, getImageLimit } from "@/lib/utils";

/**
 * @typedef {Object} AppState
 * @description 应用全局状态
 */
interface AppState {
  jobs: GenerationJob[];
  settings: UserSettings;
  stats: UsageStats;

  addJob: (job: GenerationJob) => void;
  updateJob: (id: string, updates: Partial<GenerationJob>) => void;
  deleteJob: (id: string) => void;
  addImagesToJob: (jobId: string, images: GeneratedImage[]) => void;

  updateSettings: (updates: Partial<UserSettings>) => void;
  setSubscription: (tier: SubscriptionTier) => void;

  incrementUsage: (count?: number) => void;
  incrementExports: (count?: number) => void;
  resetMonthlyUsage: () => void;

  /** @returns 当前月是否还有可用额度 */
  canGenerate: () => boolean;
  /** @returns 剩余可生成张数（-1 表示无限） */
  getRemainingQuota: () => number;
}

const DEFAULT_SETTINGS: UserSettings = {
  subscription: "free",
  darkMode: false,
  defaultExportFormat: "shopify",
  watermarkEnabled: true,
  autoBackgroundRemoval: true,
  imagesGeneratedThisMonth: 0,
  lastResetDate: getCurrentMonth(),
};

const DEFAULT_STATS: UsageStats = {
  totalGenerated: 0,
  totalExported: 0,
  favoriteScene: null,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      jobs: [],
      settings: DEFAULT_SETTINGS,
      stats: DEFAULT_STATS,

      addJob: (job) =>
        set((state) => ({ jobs: [job, ...state.jobs] })),

      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
          ),
        })),

      deleteJob: (id) =>
        set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),

      addImagesToJob: (jobId, images) =>
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId
              ? { ...j, images: [...j.images, ...images], updatedAt: new Date().toISOString() }
              : j
          ),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      setSubscription: (tier) =>
        set((state) => ({
          settings: { ...state.settings, subscription: tier },
        })),

      incrementUsage: (count = 1) =>
        set((state) => {
          const currentMonth = getCurrentMonth();
          const needsReset = state.settings.lastResetDate !== currentMonth;
          return {
            settings: {
              ...state.settings,
              imagesGeneratedThisMonth: needsReset
                ? count
                : state.settings.imagesGeneratedThisMonth + count,
              lastResetDate: currentMonth,
            },
            stats: {
              ...state.stats,
              totalGenerated: state.stats.totalGenerated + count,
            },
          };
        }),

      incrementExports: (count = 1) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalExported: state.stats.totalExported + count,
          },
        })),

      resetMonthlyUsage: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            imagesGeneratedThisMonth: 0,
            lastResetDate: getCurrentMonth(),
          },
        })),

      canGenerate: () => {
        const state = get();
        const limit = getImageLimit(state.settings.subscription);
        if (limit === -1) return true;
        const currentMonth = getCurrentMonth();
        if (state.settings.lastResetDate !== currentMonth) return true;
        return state.settings.imagesGeneratedThisMonth < limit;
      },

      getRemainingQuota: () => {
        const state = get();
        const limit = getImageLimit(state.settings.subscription);
        if (limit === -1) return -1;
        const currentMonth = getCurrentMonth();
        if (state.settings.lastResetDate !== currentMonth) return limit;
        return Math.max(0, limit - state.settings.imagesGeneratedThisMonth);
      },
    }),
    { name: "shopshot-ai-storage" }
  )
);
