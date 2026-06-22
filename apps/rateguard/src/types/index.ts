/**
 * @fileoverview RateGuard 核心类型定义
 */

/** 消息分析的风险等级 */
export type RiskLevel = "high" | "medium" | "low";

/** 建议的响应类型 */
export type ResponseType = "reject" | "negotiate" | "accept";

/** 服务类别 */
export type ServiceCategory =
  | "design"
  | "development"
  | "writing"
  | "consulting"
  | "marketing"
  | "photography"
  | "video"
  | "translation"
  | "other";

/** 订阅层级 */
export type SubscriptionTier = "free" | "premium";

/** 货币类型 */
export type Currency = "USD" | "CNY" | "EUR" | "GBP" | "JPY";

/** 红旗标记 — 消息中的警告信号 */
export interface RedFlag {
  /** 关键词或短语 */
  keyword: string;
  /** 权重 (0-1) */
  weight: number;
  /** 说明 */
  description: string;
}

/** 客户消息分析结果 */
export interface AnalysisResult {
  /** 唯一 ID */
  id: string;
  /** 原始消息内容 */
  originalMessage: string;
  /** 风险等级 */
  riskLevel: RiskLevel;
  /** 风险评分 (0-100) */
  riskScore: number;
  /** 建议的响应类型 */
  suggestedResponse: ResponseType;
  /** 检测到的红旗 */
  redFlags: RedFlag[];
  /** AI 综合分析 */
  summary: string;
  /** 分析时间 */
  createdAt: string;
}

/** 生成的回复内容 */
export interface GeneratedReply {
  /** 唯一 ID */
  id: string;
  /** 关联的分析结果 ID */
  analysisId: string;
  /** 回复类型 */
  type: ResponseType;
  /** 主题行 */
  subject: string;
  /** 回复正文 */
  body: string;
  /** 语气 (正式/友好) */
  tone: "formal" | "friendly";
  /** 创建时间 */
  createdAt: string;
}

/** 费率标准 */
export interface RateStandard {
  /** 唯一 ID */
  id: string;
  /** 服务名称 */
  serviceName: string;
  /** 服务类别 */
  category: ServiceCategory;
  /** 时薪 */
  hourlyRate: number;
  /** 最低项目收费 */
  minimumProjectFee: number;
  /** 货币 */
  currency: Currency;
  /** 备注 */
  notes: string;
  /** 创建时间 */
  createdAt: string;
}

/** 合同条款模板 */
export interface ContractClause {
  /** 唯一 ID */
  id: string;
  /** 条款标题 */
  title: string;
  /** 条款内容 */
  content: string;
  /** 是否默认包含在报价中 */
  isDefault: boolean;
  /** 创建时间 */
  createdAt: string;
}

/** 分析历史记录 */
export interface AnalysisHistory {
  /** 分析结果 */
  analysis: AnalysisResult;
  /** 生成的回复列表 */
  replies: GeneratedReply[];
}

/** 用户设置 */
export interface UserSettings {
  /** 深色模式 */
  darkMode: boolean;
  /** 默认货币 */
  currency: Currency;
  /** 默认语气 */
  defaultTone: "formal" | "friendly";
  /** 用户名/公司名 */
  displayName: string;
  /** 订阅层级 */
  subscriptionTier: SubscriptionTier;
  /** 免费使用次数 */
  freeUsesRemaining: number;
}

/** 应用全局状态 */
export interface AppState {
  /** 分析历史 */
  analyses: AnalysisResult[];
  /** 生成的回复 */
  replies: GeneratedReply[];
  /** 费率标准列表 */
  rateStandards: RateStandard[];
  /** 合同条款列表 */
  contractClauses: ContractClause[];
  /** 用户设置 */
  settings: UserSettings;
}
