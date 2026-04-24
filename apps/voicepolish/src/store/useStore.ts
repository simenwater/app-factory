"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  VoiceNote,
  PolishedOutput,
  UserSettings,
  OutputFormat,
  RecordingStatus,
} from "@/types";
import { FREE_MONTHLY_MINUTES } from "@/types";

/**
 * @interface VoicePolishState
 * 应用全局状态
 */
interface VoicePolishState {
  notes: VoiceNote[];
  currentTranscript: string;
  recordingStatus: RecordingStatus;
  recordingDuration: number;
  selectedFormat: OutputFormat;
  settings: UserSettings;
  isPolishing: boolean;
  error: string | null;

  addNote: (note: VoiceNote) => void;
  removeNote: (id: string) => void;
  setCurrentTranscript: (transcript: string) => void;
  setRecordingStatus: (status: RecordingStatus) => void;
  setRecordingDuration: (duration: number) => void;
  setSelectedFormat: (format: OutputFormat) => void;
  addPolishedOutput: (noteId: string, output: PolishedOutput) => void;
  toggleDarkMode: () => void;
  setSubscriptionTier: (tier: "free" | "pro") => void;
  setLanguage: (lang: "zh" | "en") => void;
  setIsPolishing: (polishing: boolean) => void;
  setError: (error: string | null) => void;
  addMinutesUsed: (minutes: number) => void;
  resetMonthlyUsage: () => void;
}

/**
 * @function useStore
 * 全局状态管理 store，使用 zustand + persist 中间件
 */
export const useStore = create<VoicePolishState>()(
  persist(
    (set) => ({
      notes: [],
      currentTranscript: "",
      recordingStatus: "idle" as RecordingStatus,
      recordingDuration: 0,
      selectedFormat: "summary" as OutputFormat,
      settings: {
        darkMode: false,
        subscriptionTier: "free" as const,
        language: "zh" as const,
        defaultFormat: "summary" as OutputFormat,
        monthlyMinutesUsed: 0,
        monthlyMinutesLimit: FREE_MONTHLY_MINUTES,
      },
      isPolishing: false,
      error: null,

      addNote: (note) =>
        set((state) => ({ notes: [note, ...state.notes] })),

      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      setCurrentTranscript: (transcript) =>
        set({ currentTranscript: transcript }),

      setRecordingStatus: (status) => set({ recordingStatus: status }),

      setRecordingDuration: (duration) =>
        set({ recordingDuration: duration }),

      setSelectedFormat: (format) => set({ selectedFormat: format }),

      addPolishedOutput: (noteId, output) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId
              ? { ...n, polishedOutputs: [...n.polishedOutputs, output] }
              : n
          ),
        })),

      toggleDarkMode: () =>
        set((state) => ({
          settings: { ...state.settings, darkMode: !state.settings.darkMode },
        })),

      setSubscriptionTier: (tier) =>
        set((state) => ({
          settings: {
            ...state.settings,
            subscriptionTier: tier,
            monthlyMinutesLimit: tier === "pro" ? 600 : FREE_MONTHLY_MINUTES,
          },
        })),

      setLanguage: (lang) =>
        set((state) => ({
          settings: { ...state.settings, language: lang },
        })),

      setIsPolishing: (polishing) => set({ isPolishing: polishing }),

      setError: (error) => set({ error }),

      addMinutesUsed: (minutes) =>
        set((state) => ({
          settings: {
            ...state.settings,
            monthlyMinutesUsed: state.settings.monthlyMinutesUsed + minutes,
          },
        })),

      resetMonthlyUsage: () =>
        set((state) => ({
          settings: { ...state.settings, monthlyMinutesUsed: 0 },
        })),
    }),
    {
      name: "voicepolish-storage",
      partialize: (state) => ({
        notes: state.notes,
        settings: state.settings,
      }),
    }
  )
);
