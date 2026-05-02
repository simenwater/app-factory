/**
 * @description 产品图片相关类型定义
 */

/** 生成任务状态 */
export type TaskStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

/** 生成模式 */
export type GenerationMode = 'multi-angle' | 'background-removal' | 'resize';

/** 平台尺寸预设 */
export interface PlatformPreset {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
}

/** 场景模板 */
export interface SceneTemplate {
  id: string;
  name: string;
  thumbnail: string;
  prompt: string;
}

/** 生成结果 */
export interface GeneratedImage {
  id: string;
  url: string;
  mode: GenerationMode;
  angle?: string;
  scene?: string;
  preset?: PlatformPreset;
  createdAt: string;
}

/** 用户上传的产品图 */
export interface ProductImage {
  id: string;
  file: File | null;
  previewUrl: string;
  name: string;
  uploadedAt: string;
}

/** 订阅计划 */
export type PlanType = 'free' | 'basic' | 'pro';

/** 用户订阅信息 */
export interface Subscription {
  plan: PlanType;
  creditsUsed: number;
  creditsTotal: number;
  expiresAt: string | null;
}

/** 生成任务 */
export interface GenerationTask {
  id: string;
  sourceImage: ProductImage;
  mode: GenerationMode;
  status: TaskStatus;
  results: GeneratedImage[];
  error?: string;
  createdAt: string;
}
