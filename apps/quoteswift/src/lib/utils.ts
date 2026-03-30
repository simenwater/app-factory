import type { QuoteLineItem, ProfitCalculation } from "@/types";

/**
 * @description 格式化货币金额
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的字符串
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * @description 计算行项目小计
 * @param {QuoteLineItem[]} items - 行项目列表
 * @returns {number} 小计金额
 */
export function calculateSubtotal(items: QuoteLineItem[]): number {
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
 * @description 计算总计
 * @param {number} subtotal - 小计
 * @param {number} tax - 税额
 * @returns {number} 总计
 */
export function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

/**
 * @description 计算利润
 * @param {Object} params - 计算参数
 * @returns {ProfitCalculation} 利润计算结果
 */
export function calculateProfit(params: {
  revenue: number;
  laborCost: number;
  materialCost: number;
  overhead: number;
}): ProfitCalculation {
  const totalCost = params.laborCost + params.materialCost + params.overhead;
  const profit = params.revenue - totalCost;
  const profitMargin = params.revenue > 0 ? (profit / params.revenue) * 100 : 0;

  return {
    revenue: params.revenue,
    laborCost: params.laborCost,
    materialCost: params.materialCost,
    overhead: params.overhead,
    totalCost,
    profit,
    profitMargin,
  };
}

/**
 * @description 生成报价单编号
 * @param {number} index - 序号
 * @returns {string} 报价单编号
 */
export function generateQuoteNumber(index: number): string {
  const date = new Date();
  const prefix = `QS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `${prefix}-${String(index).padStart(4, "0")}`;
}

/**
 * @description 格式化日期
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 格式化日期
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @description 获取报价单有效期（默认30天）
 * @returns {string} ISO 日期字符串
 */
export function getDefaultValidUntil(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}
