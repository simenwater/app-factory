import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Review, Settings, TrackingStatus } from "@/types";

/**
 * @description 应用全局状态
 */
interface AppState {
  reviews: Review[];
  settings: Settings;
  addReview: (review: Review) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  updateTrackingStatus: (id: string, status: TrackingStatus, notes?: string) => void;
  selectReply: (reviewId: string, replyId: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  incrementRepliesGenerated: () => void;
  resetStore: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  plan: "free",
  businessName: "",
  businessType: "",
  language: "zh",
  totalRepliesGenerated: 0,
  freeRepliesRemaining: 3,
};

/**
 * @description 使用 Zustand 创建的全局状态管理
 */
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      reviews: [],
      settings: { ...DEFAULT_SETTINGS },

      addReview: (review) =>
        set((state) => ({
          reviews: [review, ...state.reviews],
        })),

      updateReview: (id, updates) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        })),

      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),

      updateTrackingStatus: (id, status, notes) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  trackingStatus: status,
                  trackingNotes: notes ?? r.trackingNotes,
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        })),

      selectReply: (reviewId, replyId) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId
              ? { ...r, selectedReplyId: replyId, updatedAt: new Date().toISOString() }
              : r
          ),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      incrementRepliesGenerated: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            totalRepliesGenerated: state.settings.totalRepliesGenerated + 1,
            freeRepliesRemaining: Math.max(0, state.settings.freeRepliesRemaining - 1),
          },
        })),

      resetStore: () =>
        set({
          reviews: [],
          settings: { ...DEFAULT_SETTINGS },
        }),
    }),
    {
      name: "replyguard-storage",
    }
  )
);
