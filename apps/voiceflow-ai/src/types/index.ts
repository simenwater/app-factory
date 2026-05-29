/**
 * @fileoverview VoiceFlow AI 核心类型定义
 */

/** 录音状态 */
export type RecordingStatus = "idle" | "recording" | "paused" | "processing";

/** 转录结果 */
export interface TranscriptionResult {
  /** 原始转录文本 */
  text: string;
  /** 转录时长（秒） */
  duration: number;
  /** 语言 */
  language: string;
  /** 置信度 */
  confidence: number;
}

/** AI 摘要结果 */
export interface SummaryResult {
  /** 标题 */
  title: string;
  /** 摘要 */
  summary: string;
  /** 关键要点 */
  keyPoints: string[];
  /** 待办事项 */
  todoItems: TodoItem[];
  /** 标签 */
  tags: string[];
}

/** 待办事项 */
export interface TodoItem {
  id: string;
  /** 内容 */
  content: string;
  /** 是否完成 */
  completed: boolean;
  /** 优先级 */
  priority: "high" | "medium" | "low";
}

/** 笔记记录 */
export interface VoiceNote {
  id: string;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
  /** 音频文件 URL */
  audioUrl?: string;
  /** 转录结果 */
  transcription: TranscriptionResult;
  /** AI 摘要 */
  summary: SummaryResult;
  /** 导出格式 */
  exportFormat?: ExportFormat;
}

/** 导出格式 */
export type ExportFormat = "markdown" | "notion" | "email";

/** 用户订阅状态 */
export interface SubscriptionStatus {
  /** 订阅计划 */
  plan: "free" | "monthly" | "yearly";
  /** 已用转录次数 */
  usedTranscriptions: number;
  /** 最大转录次数（免费用户） */
  maxFreeTranscriptions: number;
  /** 是否活跃 */
  isActive: boolean;
}
