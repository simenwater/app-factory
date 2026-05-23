/**
 * @fileoverview Zustand 全局状态管理
 * 管理乐谱列表、播放状态和用户设置。
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  LeadSheet,
  PlaybackState,
  UserSettings,
  MusicStyle,
  SubscriptionTier,
} from "@/types";

interface AppState {
  /** 当前加载的乐谱列表 */
  sheets: LeadSheet[];
  /** 当前选中的乐谱 */
  activeSheet: LeadSheet | null;
  /** 播放状态 */
  playback: PlaybackState;
  /** 用户设置 */
  settings: UserSettings;
  /** 本月已生成次数 */
  generationsThisMonth: number;

  /** 乐谱操作 */
  setSheets: (sheets: LeadSheet[]) => void;
  addSheet: (sheet: LeadSheet) => void;
  removeSheet: (id: string) => void;
  updateSheet: (id: string, updates: Partial<LeadSheet>) => void;
  setActiveSheet: (sheet: LeadSheet | null) => void;
  toggleFavorite: (id: string) => void;

  /** 播放控制 */
  setPlayback: (updates: Partial<PlaybackState>) => void;
  togglePlayback: () => void;
  setCurrentPosition: (measure: number, beat: number) => void;

  /** 设置操作 */
  updateSettings: (updates: Partial<UserSettings>) => void;

  /** 生成计数 */
  incrementGenerations: () => void;
  canGenerate: () => boolean;
}

/** 各订阅等级的每月生成限制 */
const GENERATION_LIMITS: Record<SubscriptionTier, number> = {
  free: 5,
  pro: 100,
  premium: Infinity,
};

/**
 * @description 全局应用状态 Store
 */
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      sheets: [],
      activeSheet: null,
      generationsThisMonth: 0,

      playback: {
        isPlaying: false,
        currentMeasure: 0,
        currentBeat: 0,
        tempo: 140,
        loop: true,
        style: "jazz-swing" as MusicStyle,
        volume: 0.8,
      },

      settings: {
        theme: "dark",
        defaultTempo: 140,
        defaultStyle: "jazz-swing" as MusicStyle,
        defaultKey: "C",
        defaultTimeSignature: [4, 4] as [number, number],
        metronomeEnabled: false,
        countInBars: 0,
        subscription: "free" as SubscriptionTier,
      },

      setSheets: (sheets) => set({ sheets }),

      addSheet: (sheet) =>
        set((state) => ({ sheets: [sheet, ...state.sheets] })),

      removeSheet: (id) =>
        set((state) => ({
          sheets: state.sheets.filter((s) => s.id !== id),
          activeSheet:
            state.activeSheet?.id === id ? null : state.activeSheet,
        })),

      updateSheet: (id, updates) =>
        set((state) => ({
          sheets: state.sheets.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
          ),
          activeSheet:
            state.activeSheet?.id === id
              ? { ...state.activeSheet, ...updates, updatedAt: new Date().toISOString() }
              : state.activeSheet,
        })),

      setActiveSheet: (sheet) => set({ activeSheet: sheet }),

      toggleFavorite: (id) =>
        set((state) => ({
          sheets: state.sheets.map((s) =>
            s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
          ),
        })),

      setPlayback: (updates) =>
        set((state) => ({
          playback: { ...state.playback, ...updates },
        })),

      togglePlayback: () =>
        set((state) => ({
          playback: { ...state.playback, isPlaying: !state.playback.isPlaying },
        })),

      setCurrentPosition: (measure, beat) =>
        set((state) => ({
          playback: {
            ...state.playback,
            currentMeasure: measure,
            currentBeat: beat,
          },
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      incrementGenerations: () =>
        set((state) => ({
          generationsThisMonth: state.generationsThisMonth + 1,
        })),

      canGenerate: () => {
        const state = get();
        const limit = GENERATION_LIMITS[state.settings.subscription];
        return state.generationsThisMonth < limit;
      },
    }),
    {
      name: "leadsheet-ai-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => ({
        sheets: state.sheets,
        settings: state.settings,
        generationsThisMonth: state.generationsThisMonth,
      }),
    }
  )
);
