/**
 * @description SoloFlow 核心类型定义
 */

/** @description 客户状态枚举 */
export type ClientStatus = "lead" | "active" | "completed" | "archived";

/** @description 项目状态枚举 */
export type ProjectStatus = "inquiry" | "quoted" | "in_progress" | "review" | "completed" | "cancelled";

/** @description 报价单状态 */
export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

/** @description 发票状态 */
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

/** @description 订阅计划类型 */
export type PlanType = "free" | "pro" | "lifetime";

/** @description 客户信息 */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** @description 项目信息 */
export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** @description 报价单行项 */
export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

/** @description 报价单 */
export interface Quote {
  id: string;
  projectId: string;
  clientId: string;
  items: QuoteLineItem[];
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

/** @description 发票 */
export interface Invoice {
  id: string;
  quoteId?: string;
  projectId: string;
  clientId: string;
  invoiceNumber: string;
  items: QuoteLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** @description 收入记录 */
export interface IncomeRecord {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

/** @description 税务信息 */
export interface TaxInfo {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  estimatedTax: number;
  taxRate: number;
}

/** @description 用户订阅信息 */
export interface Subscription {
  plan: PlanType;
  expiresAt?: string;
  features: string[];
}

/** @description 看板列定义 */
export interface KanbanColumn<T extends string> {
  id: T;
  title: string;
  color: string;
}

/** @description 客户状态列配置 */
export const CLIENT_COLUMNS: KanbanColumn<ClientStatus>[] = [
  { id: "lead", title: "潜在客户", color: "#f59e0b" },
  { id: "active", title: "活跃客户", color: "#3b82f6" },
  { id: "completed", title: "已完成", color: "#10b981" },
  { id: "archived", title: "已归档", color: "#6b7280" },
];

/** @description 项目状态列配置 */
export const PROJECT_COLUMNS: KanbanColumn<ProjectStatus>[] = [
  { id: "inquiry", title: "咨询中", color: "#8b5cf6" },
  { id: "quoted", title: "已报价", color: "#f59e0b" },
  { id: "in_progress", title: "进行中", color: "#3b82f6" },
  { id: "review", title: "审核中", color: "#f97316" },
  { id: "completed", title: "已完成", color: "#10b981" },
  { id: "cancelled", title: "已取消", color: "#ef4444" },
];
