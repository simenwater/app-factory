import type { GeneratedImage, GenerationMode, PlatformPreset, SceneTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { VIEW_ANGLES } from './constants';

/**
 * @description 模拟 AI 图片生成服务
 * MVP 阶段使用模拟延迟，后续对接实际 AI API（如 Stability AI, Replicate 等）
 */

/**
 * @description 模拟处理延迟
 * @param ms - 延迟毫秒数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @description 生成多角度 3D 视图
 * @param sourceUrl - 源图片 URL
 * @returns 多角度生成结果
 */
export async function generateMultiAngleViews(sourceUrl: string): Promise<GeneratedImage[]> {
  await delay(2000);

  return VIEW_ANGLES.map((angle) => ({
    id: uuidv4(),
    url: sourceUrl,
    mode: 'multi-angle' as GenerationMode,
    angle: angle.name,
    createdAt: new Date().toISOString(),
  }));
}

/**
 * @description 移除背景并替换场景
 * @param sourceUrl - 源图片 URL
 * @param scene - 目标场景模板
 * @returns 场景替换结果
 */
export async function removeBackgroundAndReplace(
  sourceUrl: string,
  scene: SceneTemplate
): Promise<GeneratedImage> {
  await delay(1500);

  return {
    id: uuidv4(),
    url: sourceUrl,
    mode: 'background-removal' as GenerationMode,
    scene: scene.name,
    createdAt: new Date().toISOString(),
  };
}

/**
 * @description 调整图片尺寸至平台规范
 * @param sourceUrl - 源图片 URL
 * @param preset - 平台尺寸预设
 * @returns 调整尺寸后的结果
 */
export async function resizeToPreset(
  sourceUrl: string,
  preset: PlatformPreset
): Promise<GeneratedImage> {
  await delay(800);

  return {
    id: uuidv4(),
    url: sourceUrl,
    mode: 'resize' as GenerationMode,
    preset,
    createdAt: new Date().toISOString(),
  };
}

/**
 * @description 验证图片文件
 * @param file - 上传的文件
 * @returns 验证结果
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '仅支持 JPG、PNG、WebP 格式' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: '文件大小不能超过 10MB' };
  }

  return { valid: true };
}

/**
 * @description 创建图片预览 URL
 * @param file - 图片文件
 * @returns Object URL
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * @description 释放图片预览 URL
 * @param url - 需要释放的 Object URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
