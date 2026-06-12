/**
 * @fileoverview 工具函数
 */

/** 头像颜色预设列表 */
export const AVATAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
];

/**
 * 随机选取一个头像颜色
 * @returns 颜色 hex 值
 */
export function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * 格式化日期为可读字符串
 * @param iso - ISO 格式日期字符串
 * @returns 格式化后的日期
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 截断文本到指定长度
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/**
 * 根据严重程度返回对应颜色类名
 * @param severity - 严重程度
 * @returns Tailwind CSS 颜色类名
 */
export function severityColor(
  severity: "error" | "warning" | "info"
): string {
  switch (severity) {
    case "error":
      return "text-red-500";
    case "warning":
      return "text-amber-500";
    case "info":
      return "text-blue-500";
  }
}

/**
 * 根据冲突严重程度数值返回颜色类
 * @param level - 严重程度 1-5
 * @returns Tailwind CSS 颜色类名
 */
export function conflictLevelColor(level: number): string {
  if (level >= 4) return "text-red-500";
  if (level >= 3) return "text-amber-500";
  return "text-blue-500";
}
