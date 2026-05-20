import type { LineItem } from "@/types";
import { generateId } from "./utils";

/**
 * @typedef {Object} ServicePricingRule
 * @description 服务定价规则，用于 AI 本地定价
 */
interface ServicePricingRule {
  keywords: string[];
  basePrice: number;
  unit: string;
  description: string;
}

/**
 * @description 预定义的服务定价规则库
 */
const PRICING_RULES: ServicePricingRule[] = [
  {
    keywords: ["website", "web design", "landing page", "网站", "网页设计"],
    basePrice: 1500,
    unit: "project",
    description: "Website Design & Development",
  },
  {
    keywords: ["logo", "brand", "branding", "标志", "品牌"],
    basePrice: 500,
    unit: "project",
    description: "Logo & Brand Identity Design",
  },
  {
    keywords: ["seo", "search engine", "搜索引擎优化"],
    basePrice: 800,
    unit: "month",
    description: "SEO Optimization Service",
  },
  {
    keywords: ["social media", "marketing", "社交媒体", "营销"],
    basePrice: 600,
    unit: "month",
    description: "Social Media Marketing",
  },
  {
    keywords: ["consulting", "consult", "strategy", "咨询", "策略"],
    basePrice: 150,
    unit: "hour",
    description: "Professional Consulting",
  },
  {
    keywords: ["photography", "photo", "摄影", "拍照"],
    basePrice: 300,
    unit: "session",
    description: "Professional Photography",
  },
  {
    keywords: ["video", "editing", "视频", "剪辑"],
    basePrice: 1000,
    unit: "project",
    description: "Video Production & Editing",
  },
  {
    keywords: ["copywriting", "content", "writing", "文案", "写作"],
    basePrice: 200,
    unit: "piece",
    description: "Content Writing & Copywriting",
  },
  {
    keywords: ["mobile", "app", "ios", "android", "移动应用"],
    basePrice: 5000,
    unit: "project",
    description: "Mobile App Development",
  },
  {
    keywords: ["illustration", "drawing", "插画", "绘画"],
    basePrice: 400,
    unit: "piece",
    description: "Custom Illustration",
  },
  {
    keywords: ["translation", "翻译", "localization", "本地化"],
    basePrice: 80,
    unit: "page",
    description: "Translation & Localization",
  },
  {
    keywords: ["maintenance", "support", "维护", "技术支持"],
    basePrice: 500,
    unit: "month",
    description: "Technical Maintenance & Support",
  },
];

/**
 * @description 根据服务描述匹配定价规则
 * @param {string} description - 服务描述文本
 * @returns {ServicePricingRule[]} 匹配到的定价规则
 */
export function matchPricingRules(description: string): ServicePricingRule[] {
  const lower = description.toLowerCase();
  return PRICING_RULES.filter((rule) =>
    rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  );
}

/**
 * @description AI 生成报价单行项目（本地规则引擎版本）
 * @param {string} serviceDescription - 客户需要的服务描述
 * @returns {LineItem[]} 生成的行项目列表
 */
export function generateQuoteItems(serviceDescription: string): LineItem[] {
  const matched = matchPricingRules(serviceDescription);

  if (matched.length > 0) {
    return matched.map((rule) => ({
      id: generateId(),
      description: `${rule.description} (per ${rule.unit})`,
      quantity: 1,
      unitPrice: rule.basePrice,
    }));
  }

  const wordCount = serviceDescription.trim().split(/\s+/).length;
  const estimatedComplexity = Math.min(Math.max(wordCount / 5, 1), 5);
  const basePrice = Math.round(estimatedComplexity * 200);

  return [
    {
      id: generateId(),
      description: "Professional Service",
      quantity: 1,
      unitPrice: basePrice,
    },
    {
      id: generateId(),
      description: "Project Management & Communication",
      quantity: 1,
      unitPrice: Math.round(basePrice * 0.15),
    },
  ];
}

/**
 * @description 生成报价单备注/说明（AI 风格）
 * @param {string} serviceDescription - 服务描述
 * @param {string} clientName - 客户名称
 * @returns {string} 生成的备注文本
 */
export function generateQuoteNotes(
  serviceDescription: string,
  clientName: string
): string {
  return [
    `Dear ${clientName},`,
    "",
    `Thank you for your interest in our services. Based on your requirements for "${serviceDescription}", we have prepared this detailed quotation for your review.`,
    "",
    "This quote includes:",
    "• All labor and materials as described",
    "• Up to 2 rounds of revisions",
    "• Project management and regular progress updates",
    "",
    "Payment terms: 50% upfront, 50% upon completion.",
    "This quote is valid for 30 days from the date of issue.",
    "",
    "Please don't hesitate to reach out if you have any questions.",
  ].join("\n");
}

/**
 * @typedef {Object} AIQuoteResult
 * @description AI 生成报价的完整结果
 */
export interface AIQuoteResult {
  items: LineItem[];
  notes: string;
  suggestedTotal: number;
}

/**
 * @description 完整的 AI 报价生成流程
 * @param {string} serviceDescription - 服务描述
 * @param {string} clientName - 客户名称
 * @param {number} taxRate - 税率
 * @returns {AIQuoteResult} 完整的报价结果
 */
export function generateAIQuote(
  serviceDescription: string,
  clientName: string,
  taxRate: number
): AIQuoteResult {
  const items = generateQuoteItems(serviceDescription);
  const notes = generateQuoteNotes(serviceDescription, clientName);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (taxRate / 100);
  const suggestedTotal = subtotal + tax;

  return { items, notes, suggestedTotal };
}
