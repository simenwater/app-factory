import { v4 as uuidv4 } from "uuid";

/**
 * @description 生成唯一ID
 * @returns {string} UUID v4
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * @description 生成报价单编号 (QF-YYYYMM-XXXX)
 * @returns {string} 报价单编号
 */
export function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `QF-${year}${month}-${random}`;
}

/**
 * @description 格式化货币
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * @description 格式化日期
 * @param {string} dateString - ISO 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @description 计算行项目小计
 * @param {Array<{quantity: number, unitPrice: number}>} items - 行项目列表
 * @returns {number} 小计金额
 */
export function calculateSubtotal(
  items: { quantity: number; unitPrice: number }[]
): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/**
 * @description 计算税额
 * @param {number} subtotal - 小计
 * @param {number} taxRate - 税率（百分比）
 * @returns {number} 税额
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

/**
 * @description 获取状态对应的颜色类名
 * @param {string} status - 状态字符串
 * @returns {string} Tailwind CSS 类名
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    expired: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    unpaid: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

/**
 * @description 获取相对时间描述
 * @param {string} dateString - ISO 日期字符串
 * @returns {string} 相对时间（如 "3 days ago"）
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

/**
 * @description 计算报价单转化率
 * @param {number} total - 总报价数
 * @param {number} accepted - 已接受数
 * @returns {number} 转化率百分比
 */
export function calculateConversionRate(total: number, accepted: number): number {
  if (total === 0) return 0;
  return Math.round((accepted / total) * 100);
}
