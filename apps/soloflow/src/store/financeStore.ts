/**
 * @description 财务/收入追踪状态管理 Store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IncomeRecord } from "@/types";

/** @description 财务 Store 接口 */
interface FinanceStore {
  records: IncomeRecord[];
  expenses: number;
  addRecord: (record: Omit<IncomeRecord, "id">) => void;
  deleteRecord: (id: string) => void;
  setExpenses: (amount: number) => void;
  getTotalIncome: () => number;
  getIncomeByMonth: (year: number, month: number) => number;
  getMonthlyBreakdown: (year: number) => { month: number; income: number }[];
  getIncomeByCategory: () => Record<string, number>;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      records: [],
      expenses: 0,

      addRecord: (data) => {
        const record: IncomeRecord = {
          ...data,
          id: crypto.randomUUID(),
        };
        set((state) => ({ records: [...state.records, record] }));
      },

      deleteRecord: (id) => {
        set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
      },

      setExpenses: (amount) => {
        set({ expenses: amount });
      },

      getTotalIncome: () => {
        return get().records.reduce((sum, r) => sum + r.amount, 0);
      },

      getIncomeByMonth: (year, month) => {
        return get().records
          .filter((r) => {
            const d = new Date(r.date);
            return d.getFullYear() === year && d.getMonth() === month;
          })
          .reduce((sum, r) => sum + r.amount, 0);
      },

      getMonthlyBreakdown: (year) => {
        const months = Array.from({ length: 12 }, (_, i) => ({
          month: i,
          income: get().getIncomeByMonth(year, i),
        }));
        return months;
      },

      getIncomeByCategory: () => {
        const categories: Record<string, number> = {};
        get().records.forEach((r) => {
          categories[r.category] = (categories[r.category] || 0) + r.amount;
        });
        return categories;
      },
    }),
    { name: "soloflow-finance" }
  )
);
