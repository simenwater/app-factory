/**
 * @function formatDuration
 * 将秒数格式化为 mm:ss 格式
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * @function formatDate
 * 将 ISO 日期字符串格式化为本地化显示
 * @param {string} isoString - ISO 8601 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * @function generateId
 * 生成唯一 ID
 * @returns {string} UUID 格式的唯一标识
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * @function truncateText
 * 截断文本并添加省略号
 * @param {string} text - 原文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * @function copyToClipboard
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * @function downloadAsFile
 * 将文本下载为文件
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME 类型
 */
export function downloadAsFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
