/**
 * @typedef {'critical' | 'high' | 'medium' | 'low'} RiskLevel
 * 风险等级枚举
 */
export type RiskLevel = "critical" | "high" | "medium" | "low";

/**
 * @typedef {string} IndustryType
 * 受影响行业类型
 */
export type IndustryType =
  | "trade"
  | "tech"
  | "finance"
  | "manufacturing"
  | "retail"
  | "healthcare"
  | "energy"
  | "agriculture"
  | "real-estate"
  | "logistics";

/**
 * @typedef {string} SubscriptionTier
 * 订阅层级
 */
export type SubscriptionTier = "free" | "pro";

/**
 * @interface PolicyAlert
 * 政策预警条目
 */
export interface PolicyAlert {
  id: string;
  title: string;
  summary: string;
  riskLevel: RiskLevel;
  affectedIndustries: IndustryType[];
  originalText: string;
  aiInterpretation: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  region: string;
  tags: string[];
}

/**
 * @interface DailySummary
 * 每日政策摘要
 */
export interface DailySummary {
  date: string;
  overallRisk: RiskLevel;
  alertCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  topAlerts: PolicyAlert[];
  highlights: string[];
}

/**
 * @interface UserSettings
 * 用户设置
 */
export interface UserSettings {
  darkMode: boolean;
  subscribedIndustries: IndustryType[];
  subscriptionTier: SubscriptionTier;
  emailNotifications: boolean;
  language: "zh" | "en";
}

/**
 * @interface SubscriptionPlan
 * 订阅方案
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  highlighted: boolean;
}

/**
 * 行业显示名称映射
 */
export const INDUSTRY_LABELS: Record<IndustryType, string> = {
  trade: "国际贸易",
  tech: "科技",
  finance: "金融",
  manufacturing: "制造业",
  retail: "零售",
  healthcare: "医疗健康",
  energy: "能源",
  agriculture: "农业",
  "real-estate": "房地产",
  logistics: "物流",
};

/**
 * 风险等级显示配置
 */
export const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; color: string; bgColor: string; darkBgColor: string }
> = {
  critical: {
    label: "严重",
    color: "#dc2626",
    bgColor: "#fef2f2",
    darkBgColor: "#450a0a",
  },
  high: {
    label: "高",
    color: "#ea580c",
    bgColor: "#fff7ed",
    darkBgColor: "#431407",
  },
  medium: {
    label: "中",
    color: "#d97706",
    bgColor: "#fffbeb",
    darkBgColor: "#451a03",
  },
  low: {
    label: "低",
    color: "#16a34a",
    bgColor: "#f0fdf4",
    darkBgColor: "#052e16",
  },
};
