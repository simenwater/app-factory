"use client";

import { create } from "zustand";
import type {
  VoiceNote,
  RecordingStatus,
  SubscriptionStatus,
} from "@/types";

/**
 * @description 应用全局状态
 */
interface AppState {
  /** 录音状态 */
  recordingStatus: RecordingStatus;
  /** 笔记列表 */
  notes: VoiceNote[];
  /** 当前选中笔记 */
  currentNote: VoiceNote | null;
  /** 深色模式 */
  darkMode: boolean;
  /** 订阅状态 */
  subscription: SubscriptionStatus;
  /** 设置录音状态 */
  setRecordingStatus: (status: RecordingStatus) => void;
  /** 添加笔记 */
  addNote: (note: VoiceNote) => void;
  /** 更新笔记 */
  updateNote: (id: string, note: Partial<VoiceNote>) => void;
  /** 删除笔记 */
  deleteNote: (id: string) => void;
  /** 选中笔记 */
  setCurrentNote: (note: VoiceNote | null) => void;
  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 更新订阅 */
  updateSubscription: (sub: Partial<SubscriptionStatus>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  recordingStatus: "idle",
  notes: [],
  currentNote: null,
  darkMode: true,
  subscription: {
    plan: "free",
    usedTranscriptions: 0,
    maxFreeTranscriptions: 3,
    isActive: true,
  },

  setRecordingStatus: (status) => set({ recordingStatus: status }),

  addNote: (note) =>
    set((state) => ({
      notes: [note, ...state.notes],
      currentNote: note,
    })),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
      ),
      currentNote:
        state.currentNote?.id === id
          ? { ...state.currentNote, ...updates, updatedAt: new Date() }
          : state.currentNote,
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      currentNote: state.currentNote?.id === id ? null : state.currentNote,
    })),

  setCurrentNote: (note) => set({ currentNote: note }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  updateSubscription: (sub) =>
    set((state) => ({
      subscription: { ...state.subscription, ...sub },
    })),
}));
