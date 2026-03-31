/**
 * @description 语音笔记记录
 */
export interface VoiceNote {
  id: string;
  title: string;
  /** 原始音频文件名 */
  fileName: string;
  /** 音频文件大小（字节） */
  fileSize: number;
  /** 音频时长（秒） */
  duration: number;
  /** 原始转录文本 */
  transcript: string;
  /** AI 总结 */
  summary: string;
  /** 关键要点 */
  keyPoints: string[];
  /** 行动项 */
  actionItems: string[];
  /** 处理状态 */
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
}

export type NoteStatus =
  | "uploading"
  | "transcribing"
  | "summarizing"
  | "completed"
  | "error";

/**
 * @description 导出格式
 */
export type ExportFormat = "notion" | "obsidian" | "markdown" | "text";

/**
 * @description 订阅计划
 */
export type SubscriptionPlan = "free" | "monthly" | "lifetime";

/**
 * @description 用户设置
 */
export interface Settings {
  theme: "light" | "dark" | "system";
  language: string;
  defaultExportFormat: ExportFormat;
  subscription: SubscriptionPlan;
  usageCount: number;
  /** 免费用户最大使用次数 */
  freeLimit: number;
}
