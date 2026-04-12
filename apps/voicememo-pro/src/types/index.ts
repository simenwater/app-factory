/**
 * @description VoiceMemo Pro 全局类型定义
 */

/** @typedef 内容语气风格 */
export type ToneStyle = "professional" | "casual" | "marketing";

/** @typedef 输出平台格式 */
export type PlatformFormat = "linkedin" | "blog" | "email" | "twitter" | "general";

/** @typedef 订阅级别 */
export type SubscriptionTier = "free" | "monthly" | "lifetime";

/**
 * @interface VoiceMemo
 * 语音备忘录实体
 */
export interface VoiceMemo {
  id: string;
  title: string;
  originalText: string;
  rewrittenText?: string;
  toneStyle?: ToneStyle;
  platformFormat?: PlatformFormat;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface UserSettings
 * 用户偏好设置
 */
export interface UserSettings {
  darkMode: boolean;
  subscriptionTier: SubscriptionTier;
  language: "zh" | "en";
  defaultTone: ToneStyle;
  defaultPlatform: PlatformFormat;
  monthlyMinutesUsed: number;
  monthlyMinutesLimit: number;
}

/**
 * @interface TranscribeResponse
 * Whisper 转录 API 响应
 */
export interface TranscribeResponse {
  success: boolean;
  text?: string;
  duration?: number;
  error?: string;
}

/**
 * @interface RewriteRequest
 * AI 重写请求参数
 */
export interface RewriteRequest {
  text: string;
  tone: ToneStyle;
  platform: PlatformFormat;
}

/**
 * @interface RewriteResponse
 * AI 重写 API 响应
 */
export interface RewriteResponse {
  success: boolean;
  rewrittenText?: string;
  error?: string;
}

/**
 * @interface ToneOption
 * 语气风格选项配置
 */
export interface ToneOption {
  id: ToneStyle;
  label: string;
  description: string;
  icon: string;
}

/**
 * @interface PlatformOption
 * 平台格式选项配置
 */
export interface PlatformOption {
  id: PlatformFormat;
  label: string;
  description: string;
  icon: string;
  maxLength?: number;
}
