/**
 * @description 用户订阅计划类型
 */
export type SubscriptionPlan = 'free' | 'monthly' | 'lifetime';

/**
 * @description 用户信息
 */
export interface User {
  id: string;
  subscription: SubscriptionPlan;
  usageCount: number;
  usageLimit: number;
}

/**
 * @description 笔记输出格式
 */
export type ExportFormat = 'markdown' | 'text';

/**
 * @description 重写风格
 */
export type RewriteStyle = 'summary' | 'formal' | 'bullet' | 'blog';

/**
 * @description 语音笔记记录
 */
export interface VoiceNote {
  id: string;
  title: string;
  originalText: string;
  rewrittenText: string;
  style: RewriteStyle;
  duration: number;
  createdAt: string;
  language: string;
}

/**
 * @description 录音状态
 */
export type RecordingStatus = 'idle' | 'recording' | 'processing' | 'done' | 'error';

/**
 * @description AI 重写请求
 */
export interface RewriteRequest {
  text: string;
  style: RewriteStyle;
  language?: string;
}

/**
 * @description AI 重写响应
 */
export interface RewriteResponse {
  title: string;
  rewrittenText: string;
}

/**
 * @description 转录请求
 */
export interface TranscribeResponse {
  text: string;
  language: string;
  duration: number;
}
