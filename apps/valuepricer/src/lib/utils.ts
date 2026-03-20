/**
 * @description 生成简易唯一 ID
 * @returns {string} 唯一标识符
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/**
 * @description 格式化货币数值
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * @description 格式化百分比数值
 * @param {number} value - 百分比值（如 0.15 表示 15%）
 * @returns {string} 格式化后的百分比字符串
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * @description 格式化日期字符串
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 格式化的日期
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @description 将客户规模枚举转为可读标签
 */
export function customerSizeLabel(size: string): string {
  const labels: Record<string, string> = {
    startup: "初创公司",
    smb: "中小企业",
    mid_market: "中型企业",
    enterprise: "大型企业",
  };
  return labels[size] || size;
}
