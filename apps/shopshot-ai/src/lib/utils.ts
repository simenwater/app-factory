import { v4 as uuidv4 } from "uuid";

/**
 * @description 生成唯一 ID
 * @returns {string} UUID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * @description 格式化日期为可读字符串
 * @param {string} dateString - ISO 日期字符串
 * @returns {string} 格式化日期
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @description 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 可读文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * @description 格式化价格
 * @param {number} amount - 金额
 * @returns {string} 格式化价格
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * @description 获取当前月份标识（YYYY-MM）
 * @returns {string} 月份标识
 */
export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * @description 限制字符串长度并添加省略号
 * @param {string} str - 原始字符串
 * @param {number} maxLen - 最大长度
 * @returns {string} 截断后的字符串
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

/**
 * @description 将图片文件转为 base64 Data URL
 * @param {File} file - 图片文件
 * @returns {Promise<string>} base64 Data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * @description 校验图片文件类型和大小
 * @param {File} file - 文件
 * @param {number} maxSizeMB - 最大大小（MB）
 * @returns {{ valid: boolean; error?: string }}
 */
export function validateImageFile(
  file: File,
  maxSizeMB = 10
): { valid: boolean; error?: string } {
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please upload a PNG, JPEG, or WebP image." };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Image must be smaller than ${maxSizeMB}MB.` };
  }
  return { valid: true };
}

/**
 * @description 获取订阅等级的图片限额
 * @param {'free' | 'starter' | 'pro'} tier - 订阅等级
 * @returns {number} 每月图片限额（-1 表示无限）
 */
export function getImageLimit(tier: "free" | "starter" | "pro"): number {
  const limits: Record<string, number> = {
    free: 3,
    starter: 50,
    pro: -1,
  };
  return limits[tier] ?? 3;
}
