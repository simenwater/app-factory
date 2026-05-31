/**
 * @fileoverview AgentScope 核心类型定义
 */

/** AI 模型提供商 */
export type Provider = "openai" | "anthropic" | "google" | "custom";

/** HTTP 方法 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** 请求状态 */
export type RequestStatus = "pending" | "completed" | "error";

/**
 * @description 单次 AI 请求/响应日志记录
 */
export interface RequestLog {
  /** 唯一标识 */
  id: string;
  /** 时间戳 */
  timestamp: number;
  /** AI 模型提供商 */
  provider: Provider;
  /** 模型名称 */
  model: string;
  /** 请求方法 */
  method: HttpMethod;
  /** 请求 URL */
  url: string;
  /** 请求头 */
  requestHeaders: Record<string, string>;
  /** 请求体 */
  requestBody: unknown;
  /** 响应状态码 */
  statusCode: number | null;
  /** 响应头 */
  responseHeaders: Record<string, string>;
  /** 响应体 */
  responseBody: unknown;
  /** 请求状态 */
  status: RequestStatus;
  /** 耗时（毫秒） */
  duration: number | null;
  /** 输入 Token 数 */
  inputTokens: number | null;
  /** 输出 Token 数 */
  outputTokens: number | null;
  /** 估算成本（美元） */
  estimatedCost: number | null;
  /** 来源代理 */
  agentName: string;
  /** 错误信息 */
  error: string | null;
}

/**
 * @description Token 使用统计
 */
export interface TokenStats {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCost: number;
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
}

/**
 * @description 按模型分组的统计
 */
export interface ModelStats {
  model: string;
  provider: Provider;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  requestCount: number;
}

/**
 * @description 时间段统计（用于图表）
 */
export interface TimeSeriesPoint {
  timestamp: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  requestCount: number;
}

/**
 * @description 代理列表项
 */
export interface AgentInfo {
  name: string;
  lastSeen: number;
  requestCount: number;
  totalCost: number;
}

/**
 * @description 模型定价配置（每 1M tokens）
 */
export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

/**
 * @description 导出格式
 */
export type ExportFormat = "json" | "csv";

/**
 * @description 筛选条件
 */
export interface LogFilter {
  provider?: Provider;
  model?: string;
  status?: RequestStatus;
  agentName?: string;
  startTime?: number;
  endTime?: number;
  searchQuery?: string;
}

/**
 * @description 订阅计划
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "lifetime";
  features: string[];
  isPopular?: boolean;
}
