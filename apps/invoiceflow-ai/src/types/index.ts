/**
 * @fileoverview InvoiceFlow AI 核心类型定义
 */

/** 发票状态枚举 */
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

/** 订阅计划 */
export type SubscriptionPlan = "free" | "pro";

/** 收据 OCR 识别结果 */
export interface OCRResult {
  /** 商家/供应商名称 */
  vendorName: string;
  /** 金额 */
  amount: number;
  /** 货币类型 */
  currency: string;
  /** 日期 */
  date: string;
  /** 商品/服务描述列表 */
  items: OCRLineItem[];
  /** OCR 原始文本 */
  rawText: string;
  /** 识别置信度 (0-1) */
  confidence: number;
}

/** OCR 行项目 */
export interface OCRLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** 发票数据 */
export interface Invoice {
  id: string;
  /** 发票编号 */
  invoiceNumber: string;
  /** 发送方信息 */
  from: ContactInfo;
  /** 接收方信息 */
  to: ContactInfo;
  /** 发票项目 */
  items: InvoiceItem[];
  /** 小计 */
  subtotal: number;
  /** 税率 (百分比) */
  taxRate: number;
  /** 税额 */
  taxAmount: number;
  /** 总计 */
  total: number;
  /** 货币 */
  currency: string;
  /** 发票状态 */
  status: InvoiceStatus;
  /** 创建日期 */
  createdAt: string;
  /** 到期日期 */
  dueDate: string;
  /** 备注 */
  notes: string;
  /** 付款提醒发送记录 */
  reminders: ReminderRecord[];
}

/** 联系人信息 */
export interface ContactInfo {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  taxId?: string;
}

/** 发票行项目 */
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** 付款提醒记录 */
export interface ReminderRecord {
  sentAt: string;
  type: "initial" | "followup" | "overdue";
  status: "sent" | "failed";
}

/** 用户订阅信息 */
export interface UserSubscription {
  plan: SubscriptionPlan;
  /** 本月已使用发票数 */
  invoicesUsedThisMonth: number;
  /** 免费计划每月限制 */
  freeMonthlyLimit: number;
  /** 订阅开始日期 */
  startDate?: string;
  /** 订阅结束日期 */
  endDate?: string;
}

/** 应用全局状态 */
export interface AppState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  subscription: UserSubscription;
  darkMode: boolean;
  isLoading: boolean;
}
