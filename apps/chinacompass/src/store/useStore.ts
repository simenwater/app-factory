"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Country, PolicyCategory, RiskLevel, ChatMessage } from "@/types";

/**
 * @description 全局状态管理
 */
interface AppState {
  /** 当前选中的国家筛选 */
  selectedCountries: Country[];
  /** 当前选中的分类筛选 */
  selectedCategories: PolicyCategory[];
  /** 当前选中的风险等级 */
  selectedRiskLevels: RiskLevel[];
  /** 搜索关键词 */
  searchQuery: string;
  /** 侧边栏折叠状态 */
  sidebarCollapsed: boolean;
  /** AI聊天历史 */
  chatHistory: ChatMessage[];

  setSelectedCountries: (countries: Country[]) => void;
  setSelectedCategories: (categories: PolicyCategory[]) => void;
  setSelectedRiskLevels: (levels: RiskLevel[]) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCountries: [],
      selectedCategories: [],
      selectedRiskLevels: [],
      searchQuery: "",
      sidebarCollapsed: false,
      chatHistory: [],

      setSelectedCountries: (countries) =>
        set({ selectedCountries: countries }),
      setSelectedCategories: (categories) =>
        set({ selectedCategories: categories }),
      setSelectedRiskLevels: (levels) =>
        set({ selectedRiskLevels: levels }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      addChatMessage: (message) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, message],
        })),
      clearChatHistory: () => set({ chatHistory: [] }),
    }),
    {
      name: "chinacompass-storage",
      partialize: (state) => ({
        selectedCountries: state.selectedCountries,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
