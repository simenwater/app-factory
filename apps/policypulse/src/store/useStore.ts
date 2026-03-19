"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PolicyAlert,
  UserSettings,
  IndustryType,
  RiskLevel,
} from "@/types";

/**
 * @interface PolicyPulseState
 * 应用全局状态
 */
interface PolicyPulseState {
  alerts: PolicyAlert[];
  settings: UserSettings;
  selectedIndustries: IndustryType[];
  selectedRiskLevels: RiskLevel[];
  searchQuery: string;
  isLoading: boolean;
  dataSource: "live" | "cache" | "initializing";
  lastFetchedAt: string | null;

  setAlerts: (alerts: PolicyAlert[]) => void;
  fetchAlerts: () => Promise<void>;
  toggleDarkMode: () => void;
  setSubscribedIndustries: (industries: IndustryType[]) => void;
  toggleIndustryFilter: (industry: IndustryType) => void;
  toggleRiskLevelFilter: (level: RiskLevel) => void;
  setSearchQuery: (query: string) => void;
  setSubscriptionTier: (tier: "free" | "pro") => void;
  setLanguage: (lang: "zh" | "en") => void;
  toggleEmailNotifications: () => void;
  setLoading: (loading: boolean) => void;
  resetFilters: () => void;
}

/**
 * 全局状态管理 store
 */
export const useStore = create<PolicyPulseState>()(
  persist(
    (set, get) => ({
      alerts: [],
      settings: {
        darkMode: false,
        subscribedIndustries: [],
        subscriptionTier: "free",
        emailNotifications: true,
        language: "zh",
      },
      selectedIndustries: [],
      selectedRiskLevels: [],
      searchQuery: "",
      isLoading: false,
      dataSource: "initializing",
      lastFetchedAt: null,

      setAlerts: (alerts) => set({ alerts }),

      /**
       * 从API获取真实政策数据
       */
      fetchAlerts: async () => {
        const state = get();
        if (state.isLoading) return;

        set({ isLoading: true });
        try {
          const params = new URLSearchParams();
          if (state.searchQuery) {
            params.set("search", state.searchQuery);
          }

          const response = await fetch(`/api/policies?${params.toString()}`);
          if (!response.ok) throw new Error("API request failed");

          const result = await response.json();
          set({
            alerts: result.data,
            dataSource: result.source || "live",
            lastFetchedAt: new Date().toISOString(),
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to fetch alerts:", error);
          set({ isLoading: false, dataSource: "cache" });
        }
      },

      toggleDarkMode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            darkMode: !state.settings.darkMode,
          },
        })),

      setSubscribedIndustries: (industries) =>
        set((state) => ({
          settings: { ...state.settings, subscribedIndustries: industries },
        })),

      toggleIndustryFilter: (industry) =>
        set((state) => {
          const current = state.selectedIndustries;
          const next = current.includes(industry)
            ? current.filter((i) => i !== industry)
            : [...current, industry];
          return { selectedIndustries: next };
        }),

      toggleRiskLevelFilter: (level) =>
        set((state) => {
          const current = state.selectedRiskLevels;
          const next = current.includes(level)
            ? current.filter((l) => l !== level)
            : [...current, level];
          return { selectedRiskLevels: next };
        }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSubscriptionTier: (tier) =>
        set((state) => ({
          settings: { ...state.settings, subscriptionTier: tier },
        })),

      setLanguage: (lang) =>
        set((state) => ({
          settings: { ...state.settings, language: lang },
        })),

      toggleEmailNotifications: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            emailNotifications: !state.settings.emailNotifications,
          },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      resetFilters: () =>
        set({
          selectedIndustries: [],
          selectedRiskLevels: [],
          searchQuery: "",
        }),
    }),
    {
      name: "policypulse-storage",
      partialize: (state) => ({
        settings: state.settings,
        selectedIndustries: state.selectedIndustries,
      }),
    }
  )
);
