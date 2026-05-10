/**
 * @typedef {'free' | 'starter' | 'pro'} SubscriptionTier
 * @description 订阅等级
 */
export type SubscriptionTier = "free" | "starter" | "pro";

/**
 * @typedef {Object} SubscriptionPlan
 * @description 订阅计划详情
 */
export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  imageLimit: number;
  features: string[];
}

/**
 * @typedef {'pending' | 'processing' | 'completed' | 'failed'} GenerationStatus
 * @description 图片生成状态
 */
export type GenerationStatus = "pending" | "processing" | "completed" | "failed";

/**
 * @typedef {string} SceneType
 * @description 预设营销场景类型
 */
export type SceneType =
  | "studio-white"
  | "studio-gradient"
  | "lifestyle-desk"
  | "lifestyle-nature"
  | "lifestyle-kitchen"
  | "lifestyle-bathroom"
  | "festive-christmas"
  | "festive-valentines"
  | "minimal-shadow"
  | "minimal-marble"
  | "custom";

/**
 * @typedef {Object} Scene
 * @description 营销场景配置
 */
export interface Scene {
  id: SceneType;
  name: string;
  description: string;
  thumbnail: string;
  category: "studio" | "lifestyle" | "festive" | "minimal";
}

/**
 * @typedef {number} ViewAngle
 * @description 视角角度（度数）
 */
export type ViewAngle = 0 | 30 | 45 | 60 | 90 | 135 | 180 | 225 | 270 | 315;

/**
 * @typedef {Object} GeneratedImage
 * @description 生成的图片
 */
export interface GeneratedImage {
  id: string;
  originalImageData: string;
  resultImageData: string;
  scene: SceneType;
  angle: ViewAngle;
  width: number;
  height: number;
  status: GenerationStatus;
  createdAt: string;
}

/**
 * @typedef {Object} GenerationJob
 * @description 图片生成任务
 */
export interface GenerationJob {
  id: string;
  originalImage: string;
  originalFileName: string;
  scenes: SceneType[];
  angles: ViewAngle[];
  images: GeneratedImage[];
  status: GenerationStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * @typedef {'shopify' | 'amazon' | 'custom'} ExportFormat
 * @description 导出格式类型
 */
export type ExportFormat = "shopify" | "amazon" | "custom";

/**
 * @typedef {Object} ExportPreset
 * @description 导出预设配置
 */
export interface ExportPreset {
  format: ExportFormat;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  fileType: "png" | "jpg" | "webp";
  quality: number;
  maxFileSize?: number;
  description: string;
}

/**
 * @typedef {Object} UserSettings
 * @description 用户设置
 */
export interface UserSettings {
  subscription: SubscriptionTier;
  darkMode: boolean;
  defaultExportFormat: ExportFormat;
  watermarkEnabled: boolean;
  autoBackgroundRemoval: boolean;
  imagesGeneratedThisMonth: number;
  lastResetDate: string;
}

/**
 * @typedef {Object} UsageStats
 * @description 用量统计
 */
export interface UsageStats {
  totalGenerated: number;
  totalExported: number;
  favoriteScene: SceneType | null;
}
