/**
 * @fileoverview Zustand 状态管理
 * 管理客户、报价单、合同、付款和业务设置
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Client,
  Quote,
  Contract,
  Payment,
  BusinessSettings,
  Subscription,
  PaymentMethod,
} from "@/types";
import {
  generateId,
  generateQuoteNumber,
  generateContractNumber,
  calculateSubtotal,
  calculateTax,
  calculateDueDate,
  generateStripePaymentLink,
  generatePayPalPaymentLink,
} from "@/lib/utils";

/** Store 状态接口 */
interface AppState {
  clients: Client[];
  quotes: Quote[];
  contracts: Contract[];
  payments: Payment[];
  settings: BusinessSettings;
  subscription: Subscription;

  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt" | "status">) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;

  addQuote: (quote: Omit<Quote, "id" | "quoteNumber" | "createdAt" | "updatedAt" | "subtotal" | "taxAmount" | "total">) => Quote;
  updateQuote: (id: string, data: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  getQuote: (id: string) => Quote | undefined;

  addContract: (contract: Omit<Contract, "id" | "contractNumber" | "createdAt" | "updatedAt">) => Contract | null;
  updateContract: (id: string, data: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  getContract: (id: string) => Contract | undefined;

  addPayment: (contractId: string, method: PaymentMethod) => Payment;
  updatePayment: (id: string, data: Partial<Payment>) => void;
  markPaymentPaid: (id: string) => void;
  sendReminder: (id: string) => void;

  updateSettings: (settings: Partial<BusinessSettings>) => void;
  canCreateContract: () => boolean;
  upgradePlan: (plan: Subscription["plan"]) => void;
}

/** 默认业务设置 */
const defaultSettings: BusinessSettings = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  logo: "",
  taxRate: 0,
  currency: "USD",
  paymentTermsDays: 30,
  stripeEnabled: false,
  stripeAccountId: "",
  paypalEnabled: false,
  paypalEmail: "",
  autoReminderEnabled: true,
  reminderIntervalDays: 7,
  maxFreeContracts: 3,
};

/** 默认订阅信息 */
const defaultSubscription: Subscription = {
  plan: "free",
  contractsUsedThisMonth: 0,
  maxContractsPerMonth: 3,
  expiresAt: null,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      clients: [],
      quotes: [],
      contracts: [],
      payments: [],
      settings: defaultSettings,
      subscription: defaultSubscription,

      addClient: (data) => {
        const client: Client = {
          ...data,
          id: generateId(),
          status: "lead",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ clients: [...state.clients, client] }));
        return client;
      },

      updateClient: (id, data) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        }));
      },

      getClient: (id) => get().clients.find((c) => c.id === id),

      addQuote: (data) => {
        const subtotal = calculateSubtotal(data.lineItems);
        const taxAmount = calculateTax(subtotal, data.taxRate);
        const quote: Quote = {
          ...data,
          id: generateId(),
          quoteNumber: generateQuoteNumber(get().quotes.length),
          subtotal,
          taxAmount,
          total: subtotal + taxAmount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ quotes: [...state.quotes, quote] }));
        return quote;
      },

      updateQuote: (id, data) => {
        set((state) => ({
          quotes: state.quotes.map((q) => {
            if (q.id !== id) return q;
            const updated = { ...q, ...data, updatedAt: new Date().toISOString() };
            if (data.lineItems || data.taxRate !== undefined) {
              const items = data.lineItems || q.lineItems;
              const rate = data.taxRate !== undefined ? data.taxRate : q.taxRate;
              updated.subtotal = calculateSubtotal(items);
              updated.taxAmount = calculateTax(updated.subtotal, rate);
              updated.total = updated.subtotal + updated.taxAmount;
            }
            return updated;
          }),
        }));
      },

      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        }));
      },

      getQuote: (id) => get().quotes.find((q) => q.id === id),

      addContract: (data) => {
        if (!get().canCreateContract()) return null;
        const contract: Contract = {
          ...data,
          id: generateId(),
          contractNumber: generateContractNumber(get().contracts.length),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          contracts: [...state.contracts, contract],
          subscription: {
            ...state.subscription,
            contractsUsedThisMonth: state.subscription.contractsUsedThisMonth + 1,
          },
        }));
        if (data.clientId) {
          get().updateClient(data.clientId, { status: "active" });
        }
        return contract;
      },

      updateContract: (id, data) => {
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteContract: (id) => {
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
        }));
      },

      getContract: (id) => get().contracts.find((c) => c.id === id),

      addPayment: (contractId, method) => {
        const contract = get().getContract(contractId);
        const settings = get().settings;
        if (!contract) throw new Error("Contract not found");

        let paymentLink = "";
        if (method === "stripe") {
          paymentLink = generateStripePaymentLink(
            contract.totalAmount,
            settings.currency,
            contract.title
          );
        } else {
          paymentLink = generatePayPalPaymentLink(
            contract.totalAmount,
            settings.currency,
            settings.paypalEmail
          );
        }

        const payment: Payment = {
          id: generateId(),
          contractId,
          clientId: contract.clientId,
          amount: contract.totalAmount,
          currency: settings.currency,
          method,
          paymentLink,
          status: "pending",
          dueDate: calculateDueDate(settings.paymentTermsDays),
          paidAt: null,
          reminderSentAt: null,
          reminderCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ payments: [...state.payments, payment] }));
        return payment;
      },

      updatePayment: (id, data) => {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      markPaymentPaid: (id) => {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id
              ? { ...p, status: "paid" as const, paidAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      sendReminder: (id) => {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id
              ? {
                  ...p,
                  reminderSentAt: new Date().toISOString(),
                  reminderCount: p.reminderCount + 1,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateSettings: (data) => {
        set((state) => ({
          settings: { ...state.settings, ...data },
        }));
      },

      canCreateContract: () => {
        const { subscription } = get();
        if (subscription.plan !== "free") return true;
        return subscription.contractsUsedThisMonth < subscription.maxContractsPerMonth;
      },

      upgradePlan: (plan) => {
        set((state) => ({
          subscription: {
            ...state.subscription,
            plan,
            maxContractsPerMonth: plan === "free" ? 3 : Infinity,
            expiresAt:
              plan === "free"
                ? null
                : new Date(Date.now() + (plan === "annual" ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
          },
        }));
      },
    }),
    {
      name: "contractflow-storage",
    }
  )
);
