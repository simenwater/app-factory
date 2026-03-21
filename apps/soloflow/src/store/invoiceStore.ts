/**
 * @description 发票状态管理 Store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Invoice, InvoiceStatus, QuoteLineItem } from "@/types";
import { calculateTotals, generateInvoiceNumber } from "@/lib/utils";

/** @description 发票 Store 接口 */
interface InvoiceStore {
  invoices: Invoice[];
  nextSequence: number;
  addInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber" | "subtotal" | "taxAmount" | "total" | "createdAt" | "updatedAt">) => Invoice;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  markAsPaid: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByClient: (clientId: string) => Invoice[];
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
  getTotalRevenue: () => number;
  getPaidInvoices: () => Invoice[];
}

/**
 * @description 计算行项小计
 */
function calcSubtotal(items: QuoteLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      nextSequence: 1,

      addInvoice: (data) => {
        const now = new Date().toISOString();
        const subtotal = calcSubtotal(data.items);
        const { taxAmount, total } = calculateTotals(subtotal, data.taxRate);
        const seq = get().nextSequence;
        const invoice: Invoice = {
          ...data,
          id: crypto.randomUUID(),
          invoiceNumber: generateInvoiceNumber(seq),
          subtotal,
          taxAmount,
          total,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          invoices: [...state.invoices, invoice],
          nextSequence: state.nextSequence + 1,
        }));
        return invoice;
      },

      updateInvoice: (id, data) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id !== id) return inv;
            const updated = { ...inv, ...data, updatedAt: new Date().toISOString() };
            if (data.items || data.taxRate !== undefined) {
              const items = data.items || inv.items;
              const taxRate = data.taxRate ?? inv.taxRate;
              const subtotal = calcSubtotal(items);
              const { taxAmount, total } = calculateTotals(subtotal, taxRate);
              return { ...updated, subtotal, taxAmount, total };
            }
            return updated;
          }),
        }));
      },

      deleteInvoice: (id) => {
        set((state) => ({ invoices: state.invoices.filter((inv) => inv.id !== id) }));
      },

      updateInvoiceStatus: (id, status) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
          ),
        }));
      },

      markAsPaid: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: "paid" as InvoiceStatus, paidDate: now, updatedAt: now } : inv
          ),
        }));
      },

      getInvoiceById: (id) => get().invoices.find((inv) => inv.id === id),

      getInvoicesByClient: (clientId) => get().invoices.filter((inv) => inv.clientId === clientId),

      getInvoicesByStatus: (status) => get().invoices.filter((inv) => inv.status === status),

      getTotalRevenue: () => {
        return get().invoices
          .filter((inv) => inv.status === "paid")
          .reduce((sum, inv) => sum + inv.total, 0);
      },

      getPaidInvoices: () => get().invoices.filter((inv) => inv.status === "paid"),
    }),
    { name: "soloflow-invoices" }
  )
);
