/**
 * @description 通用工具函数
 */

/**
 * @description 格式化货币金额
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的金额字符串
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * @description 格式化日期
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * @description 生成发票编号
 * @param {number} sequence - 序号
 * @returns {string} 发票编号，如 INV-2026-0001
 */
export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(sequence).padStart(4, "0")}`;
}

/**
 * @description 计算行项小计
 * @param {number} quantity - 数量
 * @param {number} unitPrice - 单价
 * @returns {number} 小计金额
 */
export function calculateLineTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

/**
 * @description 计算含税总额
 * @param {number} subtotal - 小计
 * @param {number} taxRate - 税率（0-100）
 * @returns {{ taxAmount: number; total: number }} 税额和总额
 */
export function calculateTotals(subtotal: number, taxRate: number): { taxAmount: number; total: number } {
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { taxAmount, total };
}

/**
 * @description 估算季度税额（美国自雇税简化计算）
 * @param {number} annualIncome - 年收入
 * @param {number} expenses - 年支出
 * @returns {{ selfEmploymentTax: number; incomeTax: number; totalTax: number; quarterlyPayment: number }}
 */
export function estimateQuarterlyTax(annualIncome: number, expenses: number = 0) {
  const netIncome = annualIncome - expenses;
  const selfEmploymentTax = netIncome * 0.9235 * 0.153;
  const taxableIncome = netIncome - selfEmploymentTax / 2;

  let incomeTax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 11600) {
      incomeTax = taxableIncome * 0.10;
    } else if (taxableIncome <= 47150) {
      incomeTax = 1160 + (taxableIncome - 11600) * 0.12;
    } else if (taxableIncome <= 100525) {
      incomeTax = 5426 + (taxableIncome - 47150) * 0.22;
    } else {
      incomeTax = 17168.50 + (taxableIncome - 100525) * 0.24;
    }
  }

  const totalTax = Math.round((selfEmploymentTax + incomeTax) * 100) / 100;
  const quarterlyPayment = Math.round(totalTax / 4 * 100) / 100;

  return {
    selfEmploymentTax: Math.round(selfEmploymentTax * 100) / 100,
    incomeTax: Math.round(incomeTax * 100) / 100,
    totalTax,
    quarterlyPayment,
  };
}

/**
 * @description 生成 CSS 类名（简化版 clsx）
 * @param {...(string | boolean | undefined | null)[]} classes - 类名列表
 * @returns {string} 合并后的类名字符串
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
