/**
 * @typedef {'free' | 'pro'} SubscriptionTier
 * 订阅层级
 */
export type SubscriptionTier = "free" | "pro";

/**
 * @typedef {string} OutputFormat
 * 输出格式类型
 */
export type OutputFormat = "email" | "tweet" | "blog" | "summary" | "minutes";

/**
 * @typedef {string} RecordingStatus
 * 录音状态
 */
export type RecordingStatus = "idle" | "recording" | "processing" | "done" | "error";

/**
 * @interface VoiceNote
 * 语音笔记条目
 */
export interface VoiceNote {
  id: string;
  title: string;
  rawTranscript: string;
  polishedOutputs: PolishedOutput[];
  duration: number;
  createdAt: string;
  audioUrl?: string;
}

/**
 * @interface PolishedOutput
 * 润色后的输出
 */
export interface PolishedOutput {
  id: string;
  format: OutputFormat;
  content: string;
  createdAt: string;
}

/**
 * @interface UserSettings
 * 用户设置
 */
export interface UserSettings {
  darkMode: boolean;
  subscriptionTier: SubscriptionTier;
  language: "zh" | "en";
  defaultFormat: OutputFormat;
  monthlyMinutesUsed: number;
  monthlyMinutesLimit: number;
}

/**
 * @interface SubscriptionPlan
 * 订阅方案
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  minutesLimit: number;
  highlighted: boolean;
}

/**
 * 输出格式显示配置
 */
export const FORMAT_CONFIG: Record<
  OutputFormat,
  { label: string; icon: string; description: string }
> = {
  email: {
    label: "邮件",
    icon: "Mail",
    description: "正式的邮件格式，适合商务沟通",
  },
  tweet: {
    label: "推文",
    icon: "Twitter",
    description: "精炼的社交媒体文案，280字符内",
  },
  blog: {
    label: "博客",
    icon: "FileText",
    description: "结构化的博客草稿，含标题和段落",
  },
  summary: {
    label: "摘要",
    icon: "AlignLeft",
    description: "简洁的要点总结",
  },
  minutes: {
    label: "会议纪要",
    icon: "ClipboardList",
    description: "规范的会议纪要格式",
  },
};

/**
 * 免费用户每月转录时长（分钟）
 */
export const FREE_MONTHLY_MINUTES = 30;

/**
 * Pro 用户每月转录时长（分钟）
 */
export const PRO_MONTHLY_MINUTES = 600;
