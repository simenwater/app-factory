/**
 * @fileoverview 乐谱库状态管理
 * 使用 Zustand 管理 LeadSheet 列表、分类、搜索等状态
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LeadSheet, Category, SubscriptionState, MusicStyle } from "@/types";
import { v4 as uuidv4 } from "uuid";

/** 排序方式 */
export type SortBy = "title" | "updatedAt" | "createdAt" | "composer";

/** 排序方向 */
export type SortOrder = "asc" | "desc";

/** 乐谱库 Store 接口 */
interface LibraryStore {
  sheets: LeadSheet[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedStyle: MusicStyle | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  showFavoritesOnly: boolean;
  subscription: SubscriptionState;

  addSheet: (sheet: LeadSheet) => void;
  removeSheet: (id: string) => void;
  updateSheet: (id: string, updates: Partial<LeadSheet>) => void;
  toggleFavorite: (id: string) => void;
  importSheets: (sheets: LeadSheet[]) => void;

  addCategory: (name: string, color: string) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (id: string | null) => void;
  setSelectedStyle: (style: MusicStyle | null) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  setShowFavoritesOnly: (show: boolean) => void;

  incrementSyncCount: () => void;
  setSubscription: (plan: SubscriptionState) => void;
  canSync: () => boolean;

  getFilteredSheets: () => LeadSheet[];
}

/** 默认分类 */
const DEFAULT_CATEGORIES: Category[] = [
  { id: "jazz-standards", name: "Jazz Standards", color: "#6366f1" },
  { id: "bossa-nova", name: "Bossa Nova", color: "#10b981" },
  { id: "blues", name: "Blues", color: "#f59e0b" },
  { id: "pop-rock", name: "Pop/Rock", color: "#ef4444" },
  { id: "originals", name: "Originals", color: "#8b5cf6" },
];

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      sheets: [],
      categories: DEFAULT_CATEGORIES,
      searchQuery: "",
      selectedCategory: null,
      selectedStyle: null,
      sortBy: "updatedAt",
      sortOrder: "desc",
      showFavoritesOnly: false,
      subscription: {
        plan: "free",
        syncCount: 0,
        maxFreeSync: 5,
      },

      addSheet: (sheet) =>
        set((state) => ({ sheets: [sheet, ...state.sheets] })),

      removeSheet: (id) =>
        set((state) => ({
          sheets: state.sheets.filter((s) => s.id !== id),
        })),

      updateSheet: (id, updates) =>
        set((state) => ({
          sheets: state.sheets.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
          ),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          sheets: state.sheets.map((s) =>
            s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
          ),
        })),

      importSheets: (newSheets) =>
        set((state) => {
          const existingTitles = new Set(state.sheets.map((s) => s.title));
          const unique = newSheets.filter((s) => !existingTitles.has(s.title));
          return { sheets: [...unique, ...state.sheets] };
        }),

      addCategory: (name, color) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { id: uuidv4(), name, color },
          ],
        })),

      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          sheets: state.sheets.map((s) =>
            s.categoryId === id ? { ...s, categoryId: undefined } : s
          ),
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (id) => set({ selectedCategory: id }),
      setSelectedStyle: (style) => set({ selectedStyle: style }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),

      incrementSyncCount: () =>
        set((state) => ({
          subscription: {
            ...state.subscription,
            syncCount: state.subscription.syncCount + 1,
          },
        })),

      setSubscription: (plan) => set({ subscription: plan }),

      canSync: () => {
        const { subscription } = get();
        if (subscription.plan !== "free") return true;
        return subscription.syncCount < subscription.maxFreeSync;
      },

      getFilteredSheets: () => {
        const state = get();
        let filtered = [...state.sheets];

        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              s.composer.toLowerCase().includes(q) ||
              s.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        if (state.selectedCategory) {
          filtered = filtered.filter(
            (s) => s.categoryId === state.selectedCategory
          );
        }

        if (state.selectedStyle) {
          filtered = filtered.filter(
            (s) => s.style === state.selectedStyle
          );
        }

        if (state.showFavoritesOnly) {
          filtered = filtered.filter((s) => s.isFavorite);
        }

        filtered.sort((a, b) => {
          const key = state.sortBy;
          const aVal = a[key] ?? "";
          const bVal = b[key] ?? "";

          const cmp =
            typeof aVal === "string"
              ? aVal.localeCompare(bVal as string)
              : 0;

          return state.sortOrder === "asc" ? cmp : -cmp;
        });

        return filtered;
      },
    }),
    {
      name: "leadsync-library",
    }
  )
);
