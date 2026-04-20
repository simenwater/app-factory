import type { VoiceNote, ExportFormat } from '@/types';

/**
 * @description 将笔记导出为指定格式的字符串
 * @param note - 语音笔记
 * @param format - 导出格式
 * @returns 格式化后的字符串
 */
export function exportNote(note: VoiceNote, format: ExportFormat): string {
  if (format === 'markdown') {
    return exportAsMarkdown(note);
  }
  return exportAsText(note);
}

/**
 * @description 导出为 Markdown 格式
 */
function exportAsMarkdown(note: VoiceNote): string {
  const lines: string[] = [
    `# ${note.title}`,
    '',
    `> 创建时间: ${new Date(note.createdAt).toLocaleString('zh-CN')}`,
    `> 语言: ${note.language} | 时长: ${formatDuration(note.duration)}`,
    '',
    '---',
    '',
    note.rewrittenText,
    '',
    '---',
    '',
    '<details>',
    '<summary>原始转录文本</summary>',
    '',
    note.originalText,
    '',
    '</details>',
  ];
  return lines.join('\n');
}

/**
 * @description 导出为纯文本格式
 */
function exportAsText(note: VoiceNote): string {
  const lines: string[] = [
    note.title,
    '='.repeat(note.title.length),
    '',
    `创建时间: ${new Date(note.createdAt).toLocaleString('zh-CN')}`,
    `语言: ${note.language} | 时长: ${formatDuration(note.duration)}`,
    '',
    '--- 整理后内容 ---',
    '',
    note.rewrittenText,
    '',
    '--- 原始转录 ---',
    '',
    note.originalText,
  ];
  return lines.join('\n');
}

/**
 * @description 格式化时长（秒 → mm:ss）
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * @description 触发浏览器下载文件
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mimeType - MIME 类型
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
