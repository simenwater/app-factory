"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Recording,
  UserSettings,
  SubscriptionTier,
  TemplateType,
  RecordingStatus,
} from "@/types";
import { FREE_TRIAL_LIMIT } from "@/lib/templates";
import { getCurrentMonthResetDate } from "@/lib/utils";

/**
 * @interface AppState
 * @description VoiceStruct 应用全局状态
 */
interface AppState {
  recordings: Recording[];
  settings: UserSettings;
  currentStatus: RecordingStatus;
  currentTranscript: string;
  currentFormatted: string;
  selectedTemplate: TemplateType;
  recordingDuration: number;
  errorMessage: string;

  addRecording: (recording: Recording) => void;
  deleteRecording: (id: string) => void;
  clearRecordings: () => void;

  setStatus: (status: RecordingStatus) => void;
  setCurrentTranscript: (transcript: string) => void;
  setCurrentFormatted: (formatted: string) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  setRecordingDuration: (duration: number) => void;
  setErrorMessage: (message: string) => void;
  resetCurrent: () => void;

  updateSettings: (updates: Partial<UserSettings>) => void;
  setSubscription: (tier: SubscriptionTier) => void;
  incrementUsage: () => void;

  /** @returns {boolean} 免费版是否已达用量上限 */
  isFreeLimitReached: () => boolean;
  /** @returns {number} 剩余免费次数 */
  getRemainingFreeUses: () => number;
}

/** @description 默认用户设置 */
const DEFAULT_SETTINGS: UserSettings = {
  subscription: "free",
  darkMode: false,
  language: "auto",
  email: "",
  usageCount: 0,
  usageResetDate: getCurrentMonthResetDate(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      recordings: [],
      settings: DEFAULT_SETTINGS,
      currentStatus: "idle",
      currentTranscript: "",
      currentFormatted: "",
      selectedTemplate: "email",
      recordingDuration: 0,
      errorMessage: "",

      addRecording: (recording) =>
        set((state) => ({
          recordings: [recording, ...state.recordings],
        })),

      deleteRecording: (id) =>
        set((state) => ({
          recordings: state.recordings.filter((r) => r.id !== id),
        })),

      clearRecordings: () => set({ recordings: [] }),

      setStatus: (status) => set({ currentStatus: status }),
      setCurrentTranscript: (transcript) =>
        set({ currentTranscript: transcript }),
      setCurrentFormatted: (formatted) =>
        set({ currentFormatted: formatted }),
      setSelectedTemplate: (template) =>
        set({ selectedTemplate: template }),
      setRecordingDuration: (duration) =>
        set({ recordingDuration: duration }),
      setErrorMessage: (message) => set({ errorMessage: message }),

      resetCurrent: () =>
        set({
          currentStatus: "idle",
          currentTranscript: "",
          currentFormatted: "",
          recordingDuration: 0,
          errorMessage: "",
        }),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      setSubscription: (tier) =>
        set((state) => ({
          settings: { ...state.settings, subscription: tier },
        })),

      incrementUsage: () =>
        set((state) => {
          const currentReset = getCurrentMonthResetDate();
          const needsReset =
            state.settings.usageResetDate !== currentReset;
          return {
            settings: {
              ...state.settings,
              usageCount: needsReset ? 1 : state.settings.usageCount + 1,
              usageResetDate: currentReset,
            },
          };
        }),

      isFreeLimitReached: () => {
        const state = get();
        if (state.settings.subscription === "pro") return false;
        const currentReset = getCurrentMonthResetDate();
        if (state.settings.usageResetDate !== currentReset) return false;
        return state.settings.usageCount >= FREE_TRIAL_LIMIT;
      },

      getRemainingFreeUses: () => {
        const state = get();
        if (state.settings.subscription === "pro") return Infinity;
        const currentReset = getCurrentMonthResetDate();
        if (state.settings.usageResetDate !== currentReset)
          return FREE_TRIAL_LIMIT;
        return Math.max(0, FREE_TRIAL_LIMIT - state.settings.usageCount);
      },
    }),
    {
      name: "voicestruct-storage",
      partialize: (state) => ({
        recordings: state.recordings,
        settings: state.settings,
      }),
    }
  )
);
