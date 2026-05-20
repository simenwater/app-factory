/**
 * @typedef {'free' | 'pro'} SubscriptionTier
 */
export type SubscriptionTier = "free" | "pro";

/**
 * @typedef {Object} UserSettings
 * @description 用户配置信息
 */
export interface UserSettings {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  subscription: SubscriptionTier;
  darkMode: boolean;
  currency: string;
  taxRate: number;
  defaultPaymentTerms: number;
}

/**
 * @typedef {Object} Client
 * @description 客户信息
 */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * @typedef {Object} LineItem
 * @description 报价单行项目
 */
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

/**
 * @typedef {'draft' | 'sent' | 'accepted' | 'declined' | 'expired'} QuoteStatus
 */
export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

/**
 * @typedef {'unpaid' | 'paid' | 'partial' | 'overdue'} PaymentStatus
 */
export type PaymentStatus = "unpaid" | "paid" | "partial" | "overdue";

/**
 * @typedef {Object} Quote
 * @description 报价单
 */
export interface Quote {
  id: string;
  quoteNumber: string;
  client: Client;
  serviceDescription: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  quoteStatus: QuoteStatus;
  paymentStatus: PaymentStatus;
  validUntil: string;
  paidAmount: number;
  paidDate?: string;
  notes?: string;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @typedef {'email' | 'sms'} FollowUpChannel
 */
export type FollowUpChannel = "email" | "sms";

/**
 * @typedef {'pending' | 'sent' | 'cancelled'} FollowUpStatus
 */
export type FollowUpStatus = "pending" | "sent" | "cancelled";

/**
 * @typedef {Object} FollowUp
 * @description 客户跟进记录
 */
export interface FollowUp {
  id: string;
  quoteId: string;
  clientId: string;
  channel: FollowUpChannel;
  subject: string;
  body: string;
  scheduledAt: string;
  sentAt?: string;
  status: FollowUpStatus;
  createdAt: string;
}

/**
 * @typedef {Object} FollowUpTemplate
 * @description 跟进模板
 */
export interface FollowUpTemplate {
  id: string;
  name: string;
  channel: FollowUpChannel;
  subject: string;
  body: string;
  daysAfterQuote: number;
}

/**
 * @typedef {Object} RevenueEntry
 * @description 收入记录
 */
export interface RevenueEntry {
  month: string;
  revenue: number;
  quoteCount: number;
  acceptedCount: number;
}
