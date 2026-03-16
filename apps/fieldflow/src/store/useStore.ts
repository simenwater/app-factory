"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Job,
  Invoice,
  Customer,
  UserSettings,
  SubscriptionTier,
} from "@/types";

/**
 * @typedef {Object} AppState
 * @description 应用全局状态
 */
interface AppState {
  jobs: Job[];
  invoices: Invoice[];
  customers: Customer[];
  settings: UserSettings;

  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  updateSettings: (updates: Partial<UserSettings>) => void;
  setSubscription: (tier: SubscriptionTier) => void;

  /** @returns 免费版是否已达用量上限 */
  isFreeLimitReached: () => boolean;
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

const FREE_TIER_JOB_LIMIT = 5;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      jobs: [],
      invoices: [],
      customers: [],
      settings: DEFAULT_SETTINGS,

      addJob: (job) =>
        set((state) => ({ jobs: [...state.jobs, job] })),

      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
          ),
        })),

      deleteJob: (id) =>
        set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),

      addInvoice: (invoice) =>
        set((state) => ({ invoices: [...state.invoices, invoice] })),

      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? { ...inv, ...updates, updatedAt: new Date().toISOString() }
              : inv
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),

      addCustomer: (customer) =>
        set((state) => ({ customers: [...state.customers, customer] })),

      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
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
        const jobsThisMonth = state.jobs.filter((j) =>
          j.createdAt.startsWith(currentMonth)
        ).length;
        return jobsThisMonth >= FREE_TIER_JOB_LIMIT;
      },
    }),
    { name: "fieldflow-storage" }
  )
);
