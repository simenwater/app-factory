/**
 * @fileoverview ContractFlow 核心类型定义
 * 定义报价单、合同、客户、付款等业务实体
 */

/** 报价单状态 */
export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

/** 合同状态 */
export type ContractStatus = "draft" | "sent" | "signed" | "completed" | "cancelled";

/** 付款状态 */
export type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled";

/** 客户状态 */
export type ClientStatus = "lead" | "active" | "inactive";

/** 订阅计划 */
export type SubscriptionPlan = "free" | "pro" | "annual";

/** 付款方式 */
export type PaymentMethod = "stripe" | "paypal";

/** 报价行项目 */
export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** 客户信息 */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: ClientStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** 报价单 */
export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  title: string;
  description: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: QuoteStatus;
  validUntil: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** 合同 */
export interface Contract {
  id: string;
  contractNumber: string;
  quoteId: string | null;
  clientId: string;
  title: string;
  description: string;
  scope: string;
  terms: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 付款记录 */
export interface Payment {
  id: string;
  contractId: string;
  clientId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  paymentLink: string;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string | null;
  reminderSentAt: string | null;
  reminderCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 业务设置 */
export interface BusinessSettings {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  taxRate: number;
  currency: string;
  paymentTermsDays: number;
  stripeEnabled: boolean;
  stripeAccountId: string;
  paypalEnabled: boolean;
  paypalEmail: string;
  autoReminderEnabled: boolean;
  reminderIntervalDays: number;
  maxFreeContracts: number;
}

/** 用户订阅信息 */
export interface Subscription {
  plan: SubscriptionPlan;
  contractsUsedThisMonth: number;
  maxContractsPerMonth: number;
  expiresAt: string | null;
}

/** 仪表盘统计 */
export interface DashboardStats {
  totalClients: number;
  activeQuotes: number;
  activeContracts: number;
  pendingPayments: number;
  totalRevenue: number;
  overduePayments: number;
}
