"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Quote,
  Client,
  FollowUp,
  FollowUpTemplate,
  UserSettings,
  SubscriptionTier,
} from "@/types";
import { getDefaultTemplates } from "@/lib/templates";

/**
 * @typedef {Object} AppState
 * @description QuoteFlow AI 全局状态
 */
interface AppState {
  quotes: Quote[];
  clients: Client[];
  followUps: FollowUp[];
  templates: FollowUpTemplate[];
  settings: UserSettings;

  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addFollowUp: (followUp: FollowUp) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;

  addTemplate: (template: FollowUpTemplate) => void;
  updateTemplate: (id: string, updates: Partial<FollowUpTemplate>) => void;
  deleteTemplate: (id: string) => void;

  updateSettings: (updates: Partial<UserSettings>) => void;
  setSubscription: (tier: SubscriptionTier) => void;

  /** @returns 免费版是否已达用量上限 */
  isFreeLimitReached: () => boolean;

  /** @returns 获取客户的所有报价单 */
  getClientQuotes: (clientId: string) => Quote[];

  /** @returns 获取报价单的所有跟进记录 */
  getQuoteFollowUps: (quoteId: string) => FollowUp[];
}

/** @description 默认用户设置 */
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
  defaultPaymentTerms: 30,
};

const FREE_TIER_QUOTE_LIMIT = 5;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      quotes: [],
      clients: [],
      followUps: [],
      templates: getDefaultTemplates(),
      settings: DEFAULT_SETTINGS,

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

      addClient: (client) =>
        set((state) => ({ clients: [...state.clients, client] })),

      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id
              ? { ...c, ...updates, updatedAt: new Date().toISOString() }
              : c
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),

      addFollowUp: (followUp) =>
        set((state) => ({ followUps: [...state.followUps, followUp] })),

      updateFollowUp: (id, updates) =>
        set((state) => ({
          followUps: state.followUps.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      setSubscription: (tier) =>
        set((state) => ({
          settings: { ...state.settings, subscription: tier },
        })),

      isFreeLimitReached: () => {
        const state = get();
        if (state.settings.subscription === "pro") return false;
        const currentMonth = new Date().toISOString().slice(0, 7);
        const quotesThisMonth = state.quotes.filter((q) =>
          q.createdAt.startsWith(currentMonth)
        ).length;
        return quotesThisMonth >= FREE_TIER_QUOTE_LIMIT;
      },

      getClientQuotes: (clientId: string) => {
        return get().quotes.filter((q) => q.client.id === clientId);
      },

      getQuoteFollowUps: (quoteId: string) => {
        return get().followUps.filter((f) => f.quoteId === quoteId);
      },
    }),
    { name: "quoteflow-storage" }
  )
);
