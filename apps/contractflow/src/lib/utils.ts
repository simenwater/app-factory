/**
 * @fileoverview 通用工具函数
 */

import { v4 as uuidv4 } from "uuid";
import { format, addDays, isPast, differenceInDays } from "date-fns";
import type {
  Quote,
  Contract,
  Payment,
  QuoteLineItem,
  DashboardStats,
  Client,
} from "@/types";

/**
 * 生成唯一 ID
 * @returns {string} UUID v4 字符串
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 生成报价单编号
 * @param {number} count - 当前报价单计数
 * @returns {string} 格式如 QT-2026-0001
 */
export function generateQuoteNumber(count: number): string {
  const year = new Date().getFullYear();
  return `QT-${year}-${String(count + 1).padStart(4, "0")}`;
}

/**
 * 生成合同编号
 * @param {number} count - 当前合同计数
 * @returns {string} 格式如 CT-2026-0001
 */
export function generateContractNumber(count: number): string {
  const year = new Date().getFullYear();
  return `CT-${year}-${String(count + 1).padStart(4, "0")}`;
}

/**
 * 格式化货币显示
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * 格式化日期显示
 * @param {string} dateStr - ISO 日期字符串
 * @param {string} formatStr - 日期格式
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateStr: string, formatStr: string = "MMM dd, yyyy"): string {
  return format(new Date(dateStr), formatStr);
}

/**
 * 计算报价行项目合计
 * @param {QuoteLineItem[]} items - 报价行项目列表
 * @returns {number} 合计金额
 */
export function calculateSubtotal(items: QuoteLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/**
 * 计算税额
 * @param {number} subtotal - 小计
 * @param {number} taxRate - 税率（百分比）
 * @returns {number} 税额
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

/**
 * 计算到期日
 * @param {number} days - 付款期限天数
 * @returns {string} ISO 日期字符串
 */
export function calculateDueDate(days: number): string {
  return addDays(new Date(), days).toISOString();
}

/**
 * 检查日期是否已过期
 * @param {string} dateStr - ISO 日期字符串
 * @returns {boolean}
 */
export function isOverdue(dateStr: string): boolean {
  return isPast(new Date(dateStr));
}

/**
 * 计算距离到期的天数
 * @param {string} dateStr - ISO 日期字符串
 * @returns {number} 天数（负数表示已过期）
 */
export function daysUntilDue(dateStr: string): number {
  return differenceInDays(new Date(dateStr), new Date());
}

/**
 * 生成 Stripe 付款链接（模拟）
 * @param {number} amount - 金额
 * @param {string} currency - 货币
 * @param {string} description - 描述
 * @returns {string} 付款链接
 */
export function generateStripePaymentLink(
  amount: number,
  currency: string,
  description: string
): string {
  const params = new URLSearchParams({
    amount: Math.round(amount * 100).toString(),
    currency,
    description,
  });
  return `https://checkout.stripe.com/pay?${params.toString()}`;
}

/**
 * 生成 PayPal 付款链接（模拟）
 * @param {number} amount - 金额
 * @param {string} currency - 货币
 * @param {string} email - PayPal 收款邮箱
 * @returns {string} 付款链接
 */
export function generatePayPalPaymentLink(
  amount: number,
  currency: string,
  email: string
): string {
  const params = new URLSearchParams({
    business: email,
    amount: amount.toFixed(2),
    currency_code: currency,
    cmd: "_xclick",
  });
  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}

/**
 * 计算仪表盘统计数据
 * @param {Client[]} clients - 客户列表
 * @param {Quote[]} quotes - 报价单列表
 * @param {Contract[]} contracts - 合同列表
 * @param {Payment[]} payments - 付款记录列表
 * @returns {DashboardStats}
 */
export function calculateDashboardStats(
  clients: Client[],
  quotes: Quote[],
  contracts: Contract[],
  payments: Payment[]
): DashboardStats {
  return {
    totalClients: clients.length,
    activeQuotes: quotes.filter((q) => q.status === "sent" || q.status === "draft").length,
    activeContracts: contracts.filter((c) => c.status === "signed" || c.status === "sent").length,
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    totalRevenue: payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0),
    overduePayments: payments.filter((p) => p.status === "overdue").length,
  };
}

/**
 * 检查是否需要发送催款提醒
 * @param {Payment} payment - 付款记录
 * @param {number} intervalDays - 提醒间隔天数
 * @returns {boolean}
 */
export function shouldSendReminder(payment: Payment, intervalDays: number): boolean {
  if (payment.status !== "pending" && payment.status !== "overdue") return false;
  if (!payment.reminderSentAt) return isOverdue(payment.dueDate);

  const daysSinceLastReminder = differenceInDays(
    new Date(),
    new Date(payment.reminderSentAt)
  );
  return daysSinceLastReminder >= intervalDays;
}

/**
 * CSS 类名拼接
 * @param {...(string | boolean | undefined | null)} classes
 * @returns {string}
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
