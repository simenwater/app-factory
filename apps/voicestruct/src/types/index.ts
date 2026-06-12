/**
 * @typedef {"free" | "pro"} SubscriptionTier
 * @description 订阅等级
 */
export type SubscriptionTier = "free" | "pro";

/**
 * @typedef {"email" | "todo" | "blog" | "meeting" | "custom"} TemplateType
 * @description 输出模板类型
 */
export type TemplateType = "email" | "todo" | "blog" | "meeting" | "custom";

/**
 * @typedef {"idle" | "recording" | "transcribing" | "formatting" | "done" | "error"} RecordingStatus
 * @description 录音处理状态
 */
export type RecordingStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "formatting"
  | "done"
  | "error";

/**
 * @interface Template
 * @description 输出模板定义
 */
export interface Template {
  id: TemplateType;
  name: string;
  icon: string;
  description: string;
  prompt: string;
}

/**
 * @interface Recording
 * @description 录音记录
 */
export interface Recording {
  id: string;
  transcript: string;
  formatted: string;
  template: TemplateType;
  language: string;
  duration: number;
  createdAt: string;
}

/**
 * @interface UserSettings
 * @description 用户设置
 */
export interface UserSettings {
  subscription: SubscriptionTier;
  darkMode: boolean;
  language: string;
  email: string;
  usageCount: number;
  usageResetDate: string;
}
