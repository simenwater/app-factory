"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ServiceItem,
  Quote,
  QuoteTemplate,
  UserSettings,
  SubscriptionTier,
} from "@/types";
import { QUOTE_TEMPLATES } from "@/lib/templates";

/**
 * @typedef {Object} AppState
 * @description QuoteSwift 应用全局状态
 */
interface AppState {
  services: ServiceItem[];
  quotes: Quote[];
  settings: UserSettings;

  addService: (service: ServiceItem) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  updateSettings: (updates: Partial<UserSettings>) => void;
  setSubscription: (tier: SubscriptionTier) => void;

  /** @returns 获取可用模板（根据订阅等级） */
  getAvailableTemplates: () => QuoteTemplate[];
  /** @returns 免费版是否已达报价单数量上限 */
  isFreeLimitReached: () => boolean;
  /** @returns 下一个报价单序号 */
  getNextQuoteIndex: () => number;
}

const DEFAULT_SETTINGS: UserSettings = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  subscription: "free",
  darkMode: false,
  currency: "USD",
  taxRate: 0,
};

const FREE_TIER_QUOTE_LIMIT = 10;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      services: [],
      quotes: [],
      settings: DEFAULT_SETTINGS,

      addService: (service) =>
        set((state) => ({ services: [...state.services, service] })),

      updateService: (id, updates) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      addQuote: (quote) =>
        set((state) => ({ quotes: [...state.quotes, quote] })),

      updateQuote: (id, updates) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id
              ? { ...q, ...updates, updatedAt: new Date().toISOString() }
              : q
          ),
        })),

      deleteQuote: (id) =>
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      setSubscription: (tier) =>
        set((state) => ({
          settings: { ...state.settings, subscription: tier },
        })),

      getAvailableTemplates: () => {
        const state = get();
        if (state.settings.subscription === "pro") return QUOTE_TEMPLATES;
        return QUOTE_TEMPLATES.filter((t) => !t.isPremium);
      },

      isFreeLimitReached: () => {
        const state = get();
        if (state.settings.subscription === "pro") return false;
        return state.quotes.length >= FREE_TIER_QUOTE_LIMIT;
      },

      getNextQuoteIndex: () => {
        const state = get();
        return state.quotes.length + 1;
      },
    }),
    { name: "quoteswift-storage" }
  )
);
