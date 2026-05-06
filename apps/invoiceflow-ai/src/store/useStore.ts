/**
 * @fileoverview Zustand 状态管理
 */

import { create } from "zustand";
import type {
  Invoice,
  InvoiceStatus,
  UserSubscription,
  AppState,
} from "@/types";

interface AppActions {
  /** 添加发票 */
  addInvoice: (invoice: Invoice) => void;
  /** 更新发票 */
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  /** 删除发票 */
  deleteInvoice: (id: string) => void;
  /** 更新发票状态 */
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  /** 设置当前编辑发票 */
  setCurrentInvoice: (invoice: Invoice | null) => void;
  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 更新订阅 */
  updateSubscription: (sub: Partial<UserSubscription>) => void;
  /** 增加本月使用计数 */
  incrementUsage: () => void;
}

const initialSubscription: UserSubscription = {
  plan: "free",
  invoicesUsedThisMonth: 0,
  freeMonthlyLimit: 3,
};

export const useStore = create<AppState & AppActions>((set) => ({
  invoices: [],
  currentInvoice: null,
  subscription: initialSubscription,
  darkMode: false,
  isLoading: false,

  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),

  updateInvoice: (id, updates) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...updates } : inv
      ),
    })),

  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
    })),

  updateInvoiceStatus: (id, status) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status } : inv
      ),
    })),

  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  setLoading: (isLoading) => set({ isLoading }),

  updateSubscription: (sub) =>
    set((state) => ({
      subscription: { ...state.subscription, ...sub },
    })),

  incrementUsage: () =>
    set((state) => ({
      subscription: {
        ...state.subscription,
        invoicesUsedThisMonth: state.subscription.invoicesUsedThisMonth + 1,
      },
    })),
}));
