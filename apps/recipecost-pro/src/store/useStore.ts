"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, UserSettings, Ingredient, Recipe } from "@/types";

const defaultSettings: UserSettings = {
  darkMode: false,
  currency: "CNY",
  defaultTaxRate: 0.06,
  defaultProfitMargin: 0.6,
  subscriptionTier: "free",
};

/**
 * @description 全局状态管理 Store，使用 Zustand + persist 持久化
 */
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ingredients: [],
      recipes: [],
      settings: defaultSettings,

      addIngredient: (ingredient: Ingredient) =>
        set((state) => ({
          ingredients: [...state.ingredients, ingredient],
        })),

      updateIngredient: (id: string, updates: Partial<Ingredient>) =>
        set((state) => ({
          ingredients: state.ingredients.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
          ),
        })),

      removeIngredient: (id: string) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i.id !== id),
        })),

      addRecipe: (recipe: Recipe) =>
        set((state) => ({
          recipes: [...state.recipes, recipe],
        })),

      updateRecipe: (id: string, updates: Partial<Recipe>) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        })),

      removeRecipe: (id: string) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),

      updateSettings: (newSettings: Partial<UserSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetStore: () =>
        set({
          ingredients: [],
          recipes: [],
          settings: defaultSettings,
        }),
    }),
    { name: "recipecost-pro-storage" }
  )
);
