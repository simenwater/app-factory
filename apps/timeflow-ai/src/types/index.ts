/**
 * 时间线事件接口
 */
export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
}

/**
 * 时间线数据接口
 */
export interface Timeline {
  id: string;
  title: string;
  events: TimelineEvent[];
  createdAt: Date;
}

/**
 * 用户订阅类型
 */
export type SubscriptionTier = 'free' | 'pro';

/**
 * 用户接口
 */
export interface User {
  id: string;
  subscription: SubscriptionTier;
  generationsUsed: number;
  generationsLimit: number;
}

/**
 * LLM 响应接口
 */
export interface LLMResponse {
  title: string;
  events: TimelineEvent[];
}
