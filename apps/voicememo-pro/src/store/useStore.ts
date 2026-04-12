"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  VoiceMemo,
  UserSettings,
  ToneStyle,
  PlatformFormat,
} from "@/types";

/**
 * @interface VoiceMemoState
 * @description 应用全局状态
 */
interface VoiceMemoState {
  memos: VoiceMemo[];
  currentMemo: VoiceMemo | null;
  settings: UserSettings;
  isRecording: boolean;
  isTranscribing: boolean;
  isRewriting: boolean;
  recordingDuration: number;

  addMemo: (memo: VoiceMemo) => void;
  updateMemo: (id: string, updates: Partial<VoiceMemo>) => void;
  deleteMemo: (id: string) => void;
  setCurrentMemo: (memo: VoiceMemo | null) => void;
  setRecording: (recording: boolean) => void;
  setTranscribing: (transcribing: boolean) => void;
  setRewriting: (rewriting: boolean) => void;
  setRecordingDuration: (duration: number) => void;
  toggleDarkMode: () => void;
  setDefaultTone: (tone: ToneStyle) => void;
  setDefaultPlatform: (platform: PlatformFormat) => void;
  incrementMinutesUsed: (minutes: number) => void;
  setSubscriptionTier: (tier: UserSettings["subscriptionTier"]) => void;
}

/**
 * @description 全局状态管理 store (Zustand + persist)
 */
export const useStore = create<VoiceMemoState>()(
  persist(
    (set) => ({
      memos: [],
      currentMemo: null,
      settings: {
        darkMode: false,
        subscriptionTier: "free",
        language: "zh",
        defaultTone: "professional",
        defaultPlatform: "general",
        monthlyMinutesUsed: 0,
        monthlyMinutesLimit: 10,
      },
      isRecording: false,
      isTranscribing: false,
      isRewriting: false,
      recordingDuration: 0,

      addMemo: (memo) =>
        set((state) => ({ memos: [memo, ...state.memos] })),

      updateMemo: (id, updates) =>
        set((state) => ({
          memos: state.memos.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
          currentMemo:
            state.currentMemo?.id === id
              ? { ...state.currentMemo, ...updates, updatedAt: new Date().toISOString() }
              : state.currentMemo,
        })),

      deleteMemo: (id) =>
        set((state) => ({
          memos: state.memos.filter((m) => m.id !== id),
          currentMemo: state.currentMemo?.id === id ? null : state.currentMemo,
        })),

      setCurrentMemo: (memo) => set({ currentMemo: memo }),
      setRecording: (recording) => set({ isRecording: recording }),
      setTranscribing: (transcribing) => set({ isTranscribing: transcribing }),
      setRewriting: (rewriting) => set({ isRewriting: rewriting }),
      setRecordingDuration: (duration) => set({ recordingDuration: duration }),

      toggleDarkMode: () =>
        set((state) => ({
          settings: { ...state.settings, darkMode: !state.settings.darkMode },
        })),

      setDefaultTone: (tone) =>
        set((state) => ({
          settings: { ...state.settings, defaultTone: tone },
        })),

      setDefaultPlatform: (platform) =>
        set((state) => ({
          settings: { ...state.settings, defaultPlatform: platform },
        })),

      incrementMinutesUsed: (minutes) =>
        set((state) => ({
          settings: {
            ...state.settings,
            monthlyMinutesUsed: state.settings.monthlyMinutesUsed + minutes,
          },
        })),

      setSubscriptionTier: (tier) =>
        set((state) => ({
          settings: {
            ...state.settings,
            subscriptionTier: tier,
            monthlyMinutesLimit: tier === "free" ? 10 : 500,
          },
        })),
    }),
    {
      name: "voicememo-pro-storage",
      partialize: (state) => ({
        memos: state.memos,
        settings: state.settings,
      }),
    }
  )
);
