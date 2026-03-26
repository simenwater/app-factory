/**
 * @description 情感分析的风险等级
 */
export type RiskLevel = "low" | "medium" | "high" | "critical";

/**
 * @description 回复风格类型
 */
export type ReplyStyle = "apology" | "explanation" | "counter";

/**
 * @description 回复的追踪状态
 */
export type TrackingStatus = "draft" | "sent" | "effective" | "needs_revision";

/**
 * @description 订阅计划类型
 */
export type PlanType = "free" | "single" | "pro";

/**
 * @description 情感分析结果
 */
export interface SentimentAnalysis {
  score: number;
  riskLevel: RiskLevel;
  keywords: string[];
  emotionTags: string[];
  summary: string;
}

/**
 * @description 生成的回复草稿
 */
export interface ReplyDraft {
  id: string;
  style: ReplyStyle;
  content: string;
  tone: string;
  createdAt: string;
}

/**
 * @description 一条评价记录
 */
export interface Review {
  id: string;
  platform: string;
  originalText: string;
  sentiment: SentimentAnalysis | null;
  replies: ReplyDraft[];
  selectedReplyId: string | null;
  trackingStatus: TrackingStatus;
  trackingNotes: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @description 用户设置
 */
export interface Settings {
  darkMode: boolean;
  plan: PlanType;
  businessName: string;
  businessType: string;
  language: string;
  totalRepliesGenerated: number;
  freeRepliesRemaining: number;
}

/**
 * @description 追踪统计数据
 */
export interface TrackingStats {
  totalReviews: number;
  repliesSent: number;
  effectiveRate: number;
  avgResponseTime: string;
}
