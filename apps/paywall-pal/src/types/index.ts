/**
 * @fileoverview PayWall Pal 核心类型定义
 */

/** 消息分析结果 */
export interface AnalysisResult {
  /** 是否为免费工作请求 */
  isFreeWorkRequest: boolean;
  /** 置信度 (0-1) */
  confidence: number;
  /** 识别到的关键指标 */
  indicators: string[];
  /** 分析摘要 */
  summary: string;
}

/** 拒绝模板类型 */
export type RejectionTone = "friendly" | "professional" | "firm";

/** 拒绝模板配置 */
export interface RejectionConfig {
  /** 语气风格 */
  tone: RejectionTone;
  /** 是否包含报价建议 */
  includeQuote: boolean;
  /** 自定义签名 */
  signature?: string;
}

/** 生成的拒绝消息 */
export interface RejectionMessage {
  /** 主题行 */
  subject: string;
  /** 正文 */
  body: string;
  /** 使用的语气 */
  tone: RejectionTone;
}

/** 报价项目 */
export interface QuoteItem {
  /** 唯一标识 */
  id: string;
  /** 服务描述 */
  description: string;
  /** 单价 */
  unitPrice: number;
  /** 数量 */
  quantity: number;
  /** 单位 */
  unit: string;
}

/** 报价单 */
export interface Quote {
  /** 客户名称 */
  clientName: string;
  /** 项目名称 */
  projectName: string;
  /** 报价项目列表 */
  items: QuoteItem[];
  /** 备注 */
  notes: string;
  /** 有效期（天） */
  validDays: number;
  /** 货币 */
  currency: string;
}

/** 订阅计划 */
export type PlanType = "free" | "monthly" | "lifetime";

/** 用户订阅状态 */
export interface Subscription {
  /** 当前计划 */
  plan: PlanType;
  /** 剩余免费次数 */
  freeUsesRemaining: number;
  /** 最大免费次数 */
  maxFreeUses: number;
}

/** 使用历史记录 */
export interface UsageRecord {
  /** 时间戳 */
  timestamp: number;
  /** 操作类型 */
  action: "analyze" | "reject" | "quote";
  /** 输入摘要 */
  inputSummary: string;
}
