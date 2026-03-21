/**
 * @description 报价单状态管理 Store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Quote, QuoteLineItem, QuoteStatus } from "@/types";
import { calculateTotals } from "@/lib/utils";

/** @description 报价单 Store 接口 */
interface QuoteStore {
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, "id" | "subtotal" | "taxAmount" | "total" | "createdAt" | "updatedAt">) => Quote;
  updateQuote: (id: string, data: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
  recalculateQuote: (id: string) => void;
  getQuoteById: (id: string) => Quote | undefined;
  getQuotesByProject: (projectId: string) => Quote[];
  getQuotesByClient: (clientId: string) => Quote[];
}

/**
 * @description 计算报价单行项小计
 * @param {QuoteLineItem[]} items - 行项列表
 * @returns {number} 小计金额
 */
function calcSubtotal(items: QuoteLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: [],

      addQuote: (data) => {
        const now = new Date().toISOString();
        const subtotal = calcSubtotal(data.items);
        const { taxAmount, total } = calculateTotals(subtotal, data.taxRate);
        const quote: Quote = {
          ...data,
          id: crypto.randomUUID(),
          subtotal,
          taxAmount,
          total,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ quotes: [...state.quotes, quote] }));
        return quote;
      },

      updateQuote: (id, data) => {
        set((state) => ({
          quotes: state.quotes.map((q) => {
            if (q.id !== id) return q;
            const updated = { ...q, ...data, updatedAt: new Date().toISOString() };
            if (data.items || data.taxRate !== undefined) {
              const items = data.items || q.items;
              const taxRate = data.taxRate ?? q.taxRate;
              const subtotal = calcSubtotal(items);
              const { taxAmount, total } = calculateTotals(subtotal, taxRate);
              return { ...updated, subtotal, taxAmount, total };
            }
            return updated;
          }),
        }));
      },

      deleteQuote: (id) => {
        set((state) => ({ quotes: state.quotes.filter((q) => q.id !== id) }));
      },

      updateQuoteStatus: (id, status) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, status, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },

      recalculateQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.map((q) => {
            if (q.id !== id) return q;
            const subtotal = calcSubtotal(q.items);
            const { taxAmount, total } = calculateTotals(subtotal, q.taxRate);
            return { ...q, subtotal, taxAmount, total, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      getQuoteById: (id) => get().quotes.find((q) => q.id === id),

      getQuotesByProject: (projectId) => get().quotes.filter((q) => q.projectId === projectId),

      getQuotesByClient: (clientId) => get().quotes.filter((q) => q.clientId === clientId),
    }),
    { name: "soloflow-quotes" }
  )
);
