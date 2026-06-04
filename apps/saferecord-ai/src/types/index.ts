/**
 * @fileoverview SafeRecord AI 核心类型定义
 */

/** 录音状态枚举 */
export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';

/** 转录状态枚举 */
export type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'failed';

/** 订阅计划类型 */
export type SubscriptionPlan = 'free' | 'monthly' | 'yearly';

/** 支持的语言 */
export type SupportedLanguage = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'auto';

/** 转录文本片段 */
export interface TranscriptionSegment {
  /** 片段唯一标识 */
  id: string;
  /** 开始时间（秒） */
  startTime: number;
  /** 结束时间（秒） */
  endTime: number;
  /** 转录文本内容 */
  text: string;
  /** 置信度（0-1） */
  confidence: number;
}

/** 录音记录 */
export interface Recording {
  /** 录音唯一标识 */
  id: string;
  /** 录音标题 */
  title: string;
  /** 创建时间 */
  createdAt: string;
  /** 录音时长（秒） */
  duration: number;
  /** 文件大小（字节） */
  fileSize: number;
  /** 音频 Blob URL */
  audioUrl: string | null;
  /** 转录状态 */
  transcriptionStatus: TranscriptionStatus;
  /** 转录文本片段列表 */
  segments: TranscriptionSegment[];
  /** 完整转录文本 */
  fullText: string;
  /** 录音语言 */
  language: SupportedLanguage;
  /** 是否已标记收藏 */
  isFavorite: boolean;
}

/** 用户订阅信息 */
export interface Subscription {
  /** 当前计划 */
  plan: SubscriptionPlan;
  /** 本月已使用转录时长（分钟） */
  usedMinutes: number;
  /** 本月可用转录时长（分钟） */
  totalMinutes: number;
  /** 订阅到期时间 */
  expiresAt: string | null;
}

/** 应用设置 */
export interface AppSettings {
  /** 主题模式 */
  theme: 'light' | 'dark' | 'system';
  /** 默认转录语言 */
  defaultLanguage: SupportedLanguage;
  /** 是否启用自动转录 */
  autoTranscribe: boolean;
  /** 音频质量（采样率 kHz） */
  audioQuality: 16 | 44.1 | 48;
  /** 是否启用后台录音保护 */
  backgroundProtection: boolean;
}
