/**
 * @fileoverview ChinaCompass 核心类型定义
 */

/** 支持的目标国家/地区 */
export type Country = 'US' | 'EU' | 'JP' | 'SG' | 'TH' | 'VN' | 'ID' | 'MY' | 'KR' | 'AU';

/** 政策分类 */
export type PolicyCategory = '贸易' | '税务' | '数据保护' | '劳工' | '知识产权' | '外资准入' | '环保' | '消费者保护';

/** 风险等级 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/** 政策条目 */
export interface Policy {
  id: string;
  title: string;
  titleCn: string;
  country: Country;
  category: PolicyCategory;
  summary: string;
  summaryCn: string;
  content: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  riskLevel: RiskLevel;
  affectedIndustries: string[];
  aiInterpretation?: string;
}

/** 风险评估项 */
export interface RiskAssessment {
  id: string;
  country: Country;
  category: PolicyCategory;
  riskLevel: RiskLevel;
  title: string;
  description: string;
  recommendation: string;
  relatedPolicies: string[];
  updatedAt: string;
}

/** 运营指南 */
export interface OperationGuide {
  id: string;
  country: Country;
  category: PolicyCategory;
  title: string;
  content: string;
  checklist: string[];
  lastUpdated: string;
}

/** 案例 */
export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  targetCountry: Country;
  challenge: string;
  solution: string;
  result: string;
  lessons: string[];
  publishedAt: string;
}

/** AI聊天消息 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/** 订阅计划 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  features: string[];
  recommended?: boolean;
}

/** 国家信息 */
export interface CountryInfo {
  code: Country;
  name: string;
  nameEn: string;
  flag: string;
  region: string;
}
