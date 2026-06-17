/**
 * @fileoverview RateGuard 核心类型定义
 */

/** 行业类别 */
export type Industry =
  | "web-development"
  | "mobile-development"
  | "ui-ux-design"
  | "graphic-design"
  | "copywriting"
  | "video-production"
  | "consulting"
  | "marketing"
  | "data-science"
  | "devops"
  | "other";

/** 经验等级 */
export type ExperienceLevel = "junior" | "mid" | "senior" | "expert";

/** 预算风险等级 */
export type BudgetRisk = "low" | "medium" | "high" | "critical";

/** 客户意图分析结果 */
export interface ClientIntentAnalysis {
  /** 检测到的预算范围 */
  detectedBudget: {
    min: number | null;
    max: number | null;
    currency: string;
  };
  /** 项目复杂度评估 (1-10) */
  complexityScore: number;
  /** 风险等级 */
  riskLevel: BudgetRisk;
  /** 检测到的红旗信号 */
  redFlags: string[];
  /** 积极信号 */
  greenFlags: string[];
  /** 总结 */
  summary: string;
}

/** 定价建议 */
export interface PricingSuggestion {
  /** 建议最低价 */
  minRate: number;
  /** 建议合理价 */
  recommendedRate: number;
  /** 市场高价 */
  maxRate: number;
  /** 货币 */
  currency: string;
  /** 计费单位 */
  unit: "hour" | "project" | "day" | "word";
  /** 行业基准 */
  industryBenchmark: number;
  /** 建议理由 */
  reasoning: string;
}

/** 谈判话术模板 */
export interface NegotiationTemplate {
  /** 模板类型 */
  type: "reject" | "negotiate" | "accept-with-conditions";
  /** 模板标题 */
  title: string;
  /** 模板内容 */
  content: string;
  /** 语气 */
  tone: "professional" | "friendly" | "firm";
}

/** 用户配置 */
export interface UserProfile {
  /** 行业 */
  industry: Industry;
  /** 经验等级 */
  experienceLevel: ExperienceLevel;
  /** 工作年限 */
  yearsOfExperience: number;
  /** 首选货币 */
  currency: string;
  /** 最低可接受时薪 */
  minimumHourlyRate: number;
}

/** 分析历史记录 */
export interface AnalysisRecord {
  id: string;
  timestamp: number;
  clientMessage: string;
  analysis: ClientIntentAnalysis;
  pricing: PricingSuggestion;
  templates: NegotiationTemplate[];
}

/** 订阅计划 */
export type SubscriptionPlan = "free" | "pro" | "business";

/** 订阅状态 */
export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  analysisCount: number;
  maxAnalysis: number;
  expiresAt: number | null;
}
