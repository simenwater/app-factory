"use client";

import { create } from "zustand";
import type { AppState, AgentFormat } from "@/types";

/**
 * @description 全局状态管理 store
 */
export const useStore = create<AppState>((set) => ({
  repoUrl: "",
  repoInfo: null,
  format: "cursor" as AgentFormat,
  options: {
    includeCodeStyle: true,
    includeArchitecture: true,
    includeDependencies: true,
    includeTestingGuide: true,
    includeContributing: false,
    customInstructions: "",
  },
  result: null,
  loading: false,
  error: null,
  darkMode: false,
  generationCount: 0,

  setRepoUrl: (url) => set({ repoUrl: url }),
  setFormat: (format) => set({ format }),
  setOptions: (options) =>
    set((state) => ({ options: { ...state.options, ...options } })),
  setResult: (result) => set({ result }),
  setRepoInfo: (info) => set({ repoInfo: info }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  incrementGeneration: () =>
    set((state) => ({ generationCount: state.generationCount + 1 })),
  reset: () =>
    set({
      repoUrl: "",
      repoInfo: null,
      result: null,
      loading: false,
      error: null,
    }),
}));
