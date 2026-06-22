/**
 * @fileoverview 通用工具函数
 */

import type { Currency, ServiceCategory, RiskLevel, ResponseType } from "@/types";

/**
 * 生成唯一 ID
 * @returns {string} 基于时间戳 + 随机数的唯一标识符
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @param {Currency} currency - 货币类型
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  const localeMap: Record<Currency, string> = {
    USD: "en-US",
    CNY: "zh-CN",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
  };
  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * 格式化日期
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 本地化日期字符串
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 服务类别的中文标签
 * @param {ServiceCategory} category - 服务类别
 * @returns {string} 中文名称
 */
export function categoryLabel(category: ServiceCategory): string {
  const labels: Record<ServiceCategory, string> = {
    design: "设计",
    development: "开发",
    writing: "写作/文案",
    consulting: "咨询",
    marketing: "营销",
    photography: "摄影",
    video: "视频制作",
    translation: "翻译",
    other: "其他",
  };
  return labels[category];
}

/**
 * 风险等级的中文标签和颜色
 * @param {RiskLevel} level - 风险等级
 * @returns {{ label: string; color: string; bgColor: string }} 标签信息
 */
export function riskLevelInfo(level: RiskLevel): {
  label: string;
  color: string;
  bgColor: string;
} {
  const info: Record<RiskLevel, { label: string; color: string; bgColor: string }> = {
    high: { label: "高风险", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" },
    medium: { label: "中风险", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
    low: { label: "低风险", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30" },
  };
  return info[level];
}

/**
 * 响应类型的中文标签
 * @param {ResponseType} type - 响应类型
 * @returns {string} 中文名称
 */
export function responseTypeLabel(type: ResponseType): string {
  const labels: Record<ResponseType, string> = {
    reject: "礼貌拒绝",
    negotiate: "协商报价",
    accept: "可以接受",
  };
  return labels[type];
}

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
