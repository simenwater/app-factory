import type { Currency, IngredientCategory, CategoryConfig, Unit } from "@/types";

/**
 * @description 生成简易唯一 ID
 * @returns {string} 唯一标识符
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/**
 * @description 货币对应的 locale 映射
 */
const CURRENCY_LOCALES: Record<Currency, string> = {
  CNY: "zh-CN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
};

/**
 * @description 格式化货币数值
 * @param {number} amount - 金额
 * @param {Currency} currency - 货币代码
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency: Currency = "CNY"): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
 * @description 食材分类配置表
 */
export const CATEGORY_CONFIG: Record<IngredientCategory, CategoryConfig> = {
  meat: { label: "肉类", emoji: "🥩" },
  seafood: { label: "海鲜", emoji: "🦐" },
  vegetable: { label: "蔬菜", emoji: "🥬" },
  fruit: { label: "水果", emoji: "🍎" },
  dairy: { label: "乳制品", emoji: "🧀" },
  grain: { label: "谷物/主食", emoji: "🌾" },
  seasoning: { label: "调味料", emoji: "🧂" },
  oil: { label: "油脂", emoji: "🫒" },
  other: { label: "其他", emoji: "📦" },
};

/**
 * @description 计量单位显示标签
 */
export const UNIT_LABELS: Record<Unit, string> = {
  g: "克",
  kg: "千克",
  ml: "毫升",
  L: "升",
  "个": "个",
  "片": "片",
  "根": "根",
  "把": "把",
  "勺": "勺",
  "杯": "杯",
};

/**
 * @description 单位换算到基本单位（g 或 ml）的系数
 * @param {Unit} from - 源单位
 * @param {Unit} to - 目标单位
 * @returns {number} 换算系数，无法换算时返回 1
 */
export function getUnitConversionFactor(from: Unit, to: Unit): number {
  if (from === to) return 1;

  const weightUnits: Record<string, number> = { g: 1, kg: 1000 };
  const volumeUnits: Record<string, number> = { ml: 1, L: 1000 };

  if (from in weightUnits && to in weightUnits) {
    return weightUnits[from] / weightUnits[to];
  }
  if (from in volumeUnits && to in volumeUnits) {
    return volumeUnits[from] / volumeUnits[to];
  }

  return 1;
}
