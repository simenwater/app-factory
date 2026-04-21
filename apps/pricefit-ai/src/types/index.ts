/**
 * @fileoverview PriceFit AI 核心类型定义
 */

/** 价值指标输入 */
export interface ValueMetrics {
  /** 每次使用节省的工程师小时数 */
  hoursSavedPerUse: number;
  /** 工程师平均时薪（美元） */
  engineerHourlyRate: number;
  /** 目标用户每月使用次数 */
  usageFrequencyPerMonth: number;
  /** 产品实现的可靠性提升百分比（0-100） */
  reliabilityImprovement: number;
  /** 替代方案成本（美元/月） */
  alternativeCost: number;
}

/** 成本指标输入 */
export interface CostMetrics {
  /** 月度基础设施成本 */
  infrastructureCost: number;
  /** 月度 API 调用成本 */
  apiCost: number;
  /** 客户获取成本（CAC） */
  customerAcquisitionCost: number;
  /** 目标毛利率（0-100） */
  targetMargin: number;
}

/** 定价结果 */
export interface PricingResult {
  /** 基于价值的推荐价格 */
  valueBased: number;
  /** 基于成本的底价 */
  costBased: number;
  /** 竞品参考价格 */
  competitorBased: number;
  /** 最终推荐价格 */
  recommended: number;
  /** 推荐定价区间 */
  priceRange: { min: number; max: number };
  /** 用户每月获得的价值 */
  monthlyValueDelivered: number;
  /** 价值捕获率 */
  valueCaptureRate: number;
  /** 定价策略建议 */
  strategy: PricingStrategy;
}

/** 定价策略 */
export type PricingStrategy = 'penetration' | 'value' | 'premium' | 'freemium';

/** 竞品信息 */
export interface Competitor {
  /** 竞品名称 */
  name: string;
  /** 月度价格 */
  price: number;
  /** 核心功能列表 */
  features: string[];
  /** 目标用户群 */
  targetAudience: string;
  /** 主要优势 */
  strengths: string[];
  /** 主要劣势 */
  weaknesses: string[];
}

/** 竞品矩阵结果 */
export interface CompetitorMatrix {
  /** 竞品列表 */
  competitors: Competitor[];
  /** 功能对比列 */
  featureColumns: string[];
  /** 差异化定位建议 */
  positioningSuggestion: string;
  /** 价格定位象限 */
  pricePositionQuadrant: 'low-price-low-value' | 'low-price-high-value' | 'high-price-low-value' | 'high-price-high-value';
}

/** 文案生成输入 */
export interface CopywritingInput {
  /** 产品名称 */
  productName: string;
  /** 产品描述 */
  productDescription: string;
  /** 目标用户 */
  targetAudience: string;
  /** 核心价值主张 */
  valueProposition: string;
  /** 定价方案（tier 列表） */
  pricingTiers: PricingTier[];
}

/** 定价层级 */
export interface PricingTier {
  /** 层级名称 */
  name: string;
  /** 月度价格 */
  price: number;
  /** 功能列表 */
  features: string[];
  /** 是否为推荐方案 */
  isRecommended?: boolean;
  /** 方案标签（如 "最受欢迎"） */
  badge?: string;
}

/** 文案生成结果 */
export interface CopywritingResult {
  /** 主标题 */
  headline: string;
  /** 副标题 */
  subheadline: string;
  /** 各层级的销售文案 */
  tierDescriptions: { tierName: string; description: string; cta: string }[];
  /** FAQ 列表 */
  faqs: { question: string; answer: string }[];
  /** 社会证明文案建议 */
  socialProof: string;
}

/** 订阅计划 */
export type SubscriptionPlan = 'free' | 'pro';

/** 用户状态 */
export interface UserState {
  /** 当前订阅计划 */
  plan: SubscriptionPlan;
  /** 本月使用次数 */
  usageCount: number;
  /** 免费计划使用上限 */
  freeLimit: number;
}
