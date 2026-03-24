/**
 * @description 生成唯一 ID
 * @returns {string} 唯一标识符
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * @description 格式化货币
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  const localeMap: Record<string, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    CNY: "zh-CN",
    JPY: "ja-JP",
  };
  const locale = localeMap[currency] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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
    month: "short",
    day: "numeric",
  });
}

/**
 * @description 计算报价单总金额
 * @param {Array<{quantity: number, unitPrice: number}>} items - 行项目
 * @returns {number} 总金额
 */
export function calculateTotal(
  items: Array<{ quantity: number; unitPrice: number }>
): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/**
 * @description 获取服务类别的中文标签
 * @param {string} category - 服务类别键
 * @returns {string} 中文标签
 */
export function getServiceLabel(category: string): string {
  const labels: Record<string, string> = {
    design: "设计",
    development: "开发",
    consulting: "咨询",
    writing: "写作",
    marketing: "营销",
    photography: "摄影",
    video: "视频",
    translation: "翻译",
    teaching: "教学",
    other: "其他",
  };
  return labels[category] || category;
}

/**
 * @description 获取拒绝场景的中文标签
 * @param {string} scenario - 拒绝场景
 * @returns {string} 中文标签
 */
export function getScenarioLabel(scenario: string): string {
  const labels: Record<string, string> = {
    free_work: "免费工作请求",
    scope_creep: "范围蔓延",
    low_budget: "预算过低",
    unreasonable_deadline: "不合理截止日",
    outside_expertise: "超出专业范围",
    general: "通用婉拒",
  };
  return labels[scenario] || scenario;
}

/**
 * @description 获取语气的中文标签
 * @param {string} tone - 语气
 * @returns {string} 中文标签
 */
export function getToneLabel(tone: string): string {
  const labels: Record<string, string> = {
    professional: "专业",
    friendly: "友好",
    firm: "坚定",
    empathetic: "共情",
  };
  return labels[tone] || tone;
}

/**
 * @description 获取清单类别中文标签
 * @param {string} category - 清单类别
 * @returns {string} 中文标签
 */
export function getChecklistCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    scope: "项目范围",
    timeline: "时间进度",
    payment: "付款条件",
    communication: "沟通方式",
    deliverables: "交付物",
    revision: "修改次数",
  };
  return labels[category] || category;
}

/**
 * @description 计算清单完成率
 * @param {Array<{checked: boolean}>} items - 清单项
 * @returns {number} 完成百分比 (0-100)
 */
export function getChecklistProgress(
  items: Array<{ checked: boolean }>
): number {
  if (items.length === 0) return 0;
  const checked = items.filter((i) => i.checked).length;
  return Math.round((checked / items.length) * 100);
}

/**
 * @description 获取报价状态的中文标签和颜色
 * @param {string} status - 报价状态
 * @returns {{ label: string; color: string }}
 */
export function getQuoteStatus(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: "草稿", color: "text-text-muted" },
    sent: { label: "已发送", color: "text-primary" },
    accepted: { label: "已接受", color: "text-success" },
    declined: { label: "已拒绝", color: "text-danger" },
  };
  return statusMap[status] || { label: status, color: "text-text-muted" };
}
