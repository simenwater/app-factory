import type {
  QuoteInput,
  Quote,
  QuoteLineItem,
  ServiceCategory,
} from "@/types";
import { generateId } from "./utils";

/**
 * @description 服务类别建议费率配置（美元/小时）
 */
export const SERVICE_RATES: Record<
  ServiceCategory,
  { label: string; min: number; max: number; defaultRate: number }
> = {
  design: { label: "设计", min: 50, max: 200, defaultRate: 80 },
  development: { label: "开发", min: 60, max: 250, defaultRate: 100 },
  consulting: { label: "咨询", min: 80, max: 300, defaultRate: 150 },
  writing: { label: "写作", min: 30, max: 120, defaultRate: 60 },
  marketing: { label: "营销", min: 50, max: 180, defaultRate: 80 },
  photography: { label: "摄影", min: 40, max: 200, defaultRate: 90 },
  video: { label: "视频", min: 60, max: 250, defaultRate: 100 },
  translation: { label: "翻译", min: 30, max: 100, defaultRate: 50 },
  teaching: { label: "教学", min: 40, max: 150, defaultRate: 70 },
  other: { label: "其他", min: 30, max: 200, defaultRate: 75 },
};

/**
 * @description 根据输入生成报价单行项目
 * @param {QuoteInput} input - 报价输入
 * @returns {QuoteLineItem[]} 自动生成的行项目列表
 */
export function generateLineItems(input: QuoteInput): QuoteLineItem[] {
  const items: QuoteLineItem[] = [];
  const config = SERVICE_RATES[input.serviceCategory];

  if (input.billingMode === "hourly") {
    items.push({
      id: generateId(),
      description: `${config.label}服务 — ${input.description || input.projectName}`,
      quantity: input.estimatedHours,
      unit: "小时",
      unitPrice: input.hourlyRate || config.defaultRate,
    });
  } else if (input.billingMode === "fixed") {
    const total = (input.hourlyRate || config.defaultRate) * input.estimatedHours;
    items.push({
      id: generateId(),
      description: `${config.label}项目 — ${input.description || input.projectName}（固定价格）`,
      quantity: 1,
      unit: "项",
      unitPrice: total,
    });
  } else if (input.billingMode === "daily") {
    const days = Math.ceil(input.estimatedHours / 8);
    items.push({
      id: generateId(),
      description: `${config.label}服务 — ${input.description || input.projectName}`,
      quantity: days,
      unit: "天",
      unitPrice: (input.hourlyRate || config.defaultRate) * 8,
    });
  } else {
    const months = Math.ceil(input.estimatedHours / 160);
    items.push({
      id: generateId(),
      description: `${config.label}服务 — ${input.description || input.projectName}`,
      quantity: months,
      unit: "月",
      unitPrice: (input.hourlyRate || config.defaultRate) * 160,
    });
  }

  return items;
}

/**
 * @description 根据输入生成完整报价单
 * @param {QuoteInput} input - 报价输入
 * @param {number} validDays - 报价有效天数
 * @returns {Quote} 生成的报价单
 */
export function generateQuote(input: QuoteInput, validDays: number = 14): Quote {
  return {
    id: generateId(),
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    projectName: input.projectName,
    serviceCategory: input.serviceCategory,
    billingMode: input.billingMode,
    lineItems: generateLineItems(input),
    notes: "",
    validDays,
    currency: input.currency || "USD",
    createdAt: new Date().toISOString(),
    status: "draft",
  };
}

/**
 * @description 计算报价总金额
 * @param {QuoteLineItem[]} items - 行项目列表
 * @returns {number} 总金额
 */
export function calculateQuoteTotal(items: QuoteLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/**
 * @description 获取建议费率范围
 * @param {ServiceCategory} category - 服务类别
 * @returns {{ min: number; max: number; defaultRate: number }} 费率范围
 */
export function getSuggestedRate(category: ServiceCategory): {
  min: number;
  max: number;
  defaultRate: number;
} {
  const config = SERVICE_RATES[category];
  return { min: config.min, max: config.max, defaultRate: config.defaultRate };
}
