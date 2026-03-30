/**
 * @typedef {'free' | 'pro'} SubscriptionTier
 * @description 订阅等级
 */
export type SubscriptionTier = "free" | "pro";

/**
 * @typedef {Object} UserSettings
 * @description 用户/商家配置
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

/**
 * @typedef {Object} ServiceItem
 * @description 可复用的服务项目（存储在服务库中）
 */
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: string;
  category: string;
  createdAt: string;
}

/**
 * @typedef {Object} QuoteLineItem
 * @description 报价单中的行项目
 */
export interface QuoteLineItem {
  id: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

/**
 * @typedef {Object} CustomerInfo
 * @description 客户信息
 */
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

/**
 * @typedef {'draft' | 'sent' | 'accepted' | 'declined' | 'expired'} QuoteStatus
 */
export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

/**
 * @typedef {Object} Quote
 * @description 报价单
 */
export interface Quote {
  id: string;
  quoteNumber: string;
  customer: CustomerInfo;
  items: QuoteLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  laborCost: number;
  materialCost: number;
  profitMargin: number;
  status: QuoteStatus;
  validUntil: string;
  notes: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @typedef {Object} QuoteTemplate
 * @description 报价单模板
 */
export interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultItems: Omit<QuoteLineItem, "id">[];
  isPremium: boolean;
}

/**
 * @typedef {Object} ProfitCalculation
 * @description 利润计算结果
 */
export interface ProfitCalculation {
  revenue: number;
  laborCost: number;
  materialCost: number;
  overhead: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
}
