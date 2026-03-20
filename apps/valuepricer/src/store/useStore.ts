"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, UserSettings, ValueInput, PricingRecommendation } from "@/types";

const defaultSettings: UserSettings = {
  darkMode: false,
  currency: "USD",
  subscriptionTier: "free",
};

/**
 * @description 全局状态管理 Store，使用 Zustand + persist 持久化
 */
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      inputs: [],
      recommendations: [],
      settings: defaultSettings,

      addInput: (input: ValueInput) =>
        set((state) => ({ inputs: [...state.inputs, input] })),

      removeInput: (id: string) =>
        set((state) => ({
          inputs: state.inputs.filter((i) => i.id !== id),
          recommendations: state.recommendations.filter((r) => r.inputId !== id),
        })),

      addRecommendation: (rec: PricingRecommendation) =>
        set((state) => ({
          recommendations: [...state.recommendations, rec],
        })),

      removeRecommendation: (id: string) =>
        set((state) => ({
          recommendations: state.recommendations.filter((r) => r.id !== id),
        })),

      updateSettings: (newSettings: Partial<UserSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetStore: () =>
        set({
          inputs: [],
          recommendations: [],
          settings: defaultSettings,
        }),
    }),
    { name: "valuepricer-storage" }
  )
);
