/**
 * @description 生成 UUID
 * @returns {string} UUID 字符串
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * @description 格式化日期为本地时间字符串
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * @description 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * @description 根据平台格式化提示词内容，添加平台特定的包装
 * @param {string} content - 原始提示词内容
 * @param {string} platform - 目标平台
 * @returns {string} 格式化后的内容
 */
export function formatForPlatform(content: string, platform: string): string {
  switch (platform) {
    case 'cursor':
      return `# Cursor Rules\n\n${content}`;
    case 'claude':
      return `<system>\n${content}\n</system>`;
    case 'github-copilot':
      return `# GitHub Copilot Instructions\n\n${content}`;
    default:
      return content;
  }
}

/**
 * @description 搜索过滤模板
 * @param {string} query - 搜索关键词
 * @param {string} text - 被搜索的文本
 * @returns {boolean} 是否匹配
 */
export function matchesSearch(query: string, text: string): boolean {
  if (!query.trim()) return true;
  const lowerQuery = query.toLowerCase();
  return text.toLowerCase().includes(lowerQuery);
}

/**
 * @description 截断文本并添加省略号
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * @description 导出模板为 JSON 文件并触发下载
 * @param {object} data - 要导出的数据
 * @param {string} filename - 文件名
 */
export function exportAsJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
