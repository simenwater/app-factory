import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { VoiceNote, NoteStatus, Settings, SubscriptionPlan } from "@/types";

/**
 * @description 全局状态接口
 */
interface AppState {
  notes: VoiceNote[];
  settings: Settings;
  addNote: (note: Omit<VoiceNote, "id" | "createdAt" | "updatedAt">) => string;
  updateNote: (id: string, updates: Partial<VoiceNote>) => void;
  deleteNote: (id: string) => void;
  updateNoteStatus: (id: string, status: NoteStatus) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  setSubscription: (plan: SubscriptionPlan) => void;
  incrementUsage: () => void;
  canUseService: () => boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  language: "zh-CN",
  defaultExportFormat: "markdown",
  subscription: "free",
  usageCount: 0,
  freeLimit: 3,
};

/**
 * @description Zustand 全局状态管理
 */
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      notes: [],
      settings: DEFAULT_SETTINGS,

      addNote: (noteData) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        const note: VoiceNote = {
          ...noteData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [note, ...state.notes] }));
        return id;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, ...updates, updatedAt: new Date().toISOString() }
              : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      updateNoteStatus: (id, status) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, status, updatedAt: new Date().toISOString() }
              : n
          ),
        }));
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      setSubscription: (plan) => {
        set((state) => ({
          settings: { ...state.settings, subscription: plan },
        }));
      },

      incrementUsage: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            usageCount: state.settings.usageCount + 1,
          },
        }));
      },

      canUseService: () => {
        const { settings } = get();
        if (settings.subscription !== "free") return true;
        return settings.usageCount < settings.freeLimit;
      },
    }),
    {
      name: "voiceflow-storage",
    }
  )
);
