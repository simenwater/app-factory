/**
 * @typedef {Object} Customer
 * @description 客户信息
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
}

/**
 * @typedef {'scheduled' | 'in_progress' | 'completed' | 'cancelled'} JobStatus
 */
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

/**
 * @typedef {Object} Job
 * @description 工作任务
 */
export interface Job {
  id: string;
  title: string;
  description: string;
  customer: Customer;
  location: string;
  status: JobStatus;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @typedef {'draft' | 'sent' | 'accepted' | 'declined'} InvoiceStatus
 */
export type InvoiceStatus = "draft" | "sent" | "accepted" | "declined";

/**
 * @typedef {'unpaid' | 'paid' | 'partial' | 'overdue'} PaymentStatus
 */
export type PaymentStatus = "unpaid" | "paid" | "partial" | "overdue";

/**
 * @typedef {Object} LineItem
 * @description 发票行项目
 */
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

/**
 * @typedef {Object} Invoice
 * @description 报价单/发票
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobId?: string;
  customer: Customer;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  invoiceStatus: InvoiceStatus;
  paymentStatus: PaymentStatus;
  dueDate: string;
  paidAmount: number;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @typedef {'free' | 'pro'} SubscriptionTier
 */
export type SubscriptionTier = "free" | "pro";

/**
 * @typedef {Object} User
 * @description 用户账号信息
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  lastSyncAt?: string;
}

/**
 * @typedef {Object} UserSettings
 * @description 用户配置
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
}
