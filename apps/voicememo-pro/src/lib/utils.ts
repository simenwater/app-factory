import type { ToneOption, PlatformOption } from "@/types";

/**
 * @function generateId
 * @description 生成唯一 ID
 * @returns {string} UUID 格式字符串
 */
export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * @function formatDuration
 * @description 格式化时长为 mm:ss
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时长
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * @function formatDate
 * @description 格式化日期
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @function truncateText
 * @description 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * @function wordCount
 * @description 统计文本字数（中英文混合）
 * @param {string} text - 文本内容
 * @returns {number} 字数
 */
export function wordCount(text: string): number {
  if (!text) return 0;
  const chineseChars = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const englishWords = text.replace(/[\u4e00-\u9fff]/g, "").trim().split(/\s+/).filter(Boolean).length;
  return chineseChars + englishWords;
}

/** @constant TONE_OPTIONS - 语气风格选项 */
export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "professional",
    label: "专业商务",
    description: "正式、简洁、权威的商务风格",
    icon: "briefcase",
  },
  {
    id: "casual",
    label: "轻松休闲",
    description: "亲切、对话式、易读的表达",
    icon: "coffee",
  },
  {
    id: "marketing",
    label: "营销推广",
    description: "吸引眼球、有感染力、促转化",
    icon: "megaphone",
  },
];

/** @constant PLATFORM_OPTIONS - 平台格式选项 */
export const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    id: "linkedin",
    label: "LinkedIn 帖子",
    description: "适合职业社交平台的专业内容",
    icon: "linkedin",
    maxLength: 3000,
  },
  {
    id: "blog",
    label: "博客文章",
    description: "结构化的长篇内容，带标题和段落",
    icon: "file-text",
    maxLength: 10000,
  },
  {
    id: "email",
    label: "营销邮件",
    description: "简洁有力的邮件正文，含 CTA",
    icon: "mail",
    maxLength: 2000,
  },
  {
    id: "twitter",
    label: "推特/X 帖子",
    description: "280 字符内的精炼内容",
    icon: "twitter",
    maxLength: 280,
  },
  {
    id: "general",
    label: "通用文本",
    description: "灵活格式，适合多种场景",
    icon: "align-left",
  },
];

/**
 * @function getUsagePercentage
 * @description 计算使用额度百分比
 * @param {number} used - 已使用分钟数
 * @param {number} limit - 限制分钟数
 * @returns {number} 百分比 0-100
 */
export function getUsagePercentage(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
}
