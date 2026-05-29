/**
 * @fileoverview 多格式导出服务 - 支持 Markdown/Notion/Email 格式
 */

import type { VoiceNote, ExportFormat } from "@/types";
import { format } from "date-fns";

/**
 * @description 将笔记导出为指定格式
 * @param note - 语音笔记
 * @param exportFormat - 导出格式
 * @returns 格式化后的文本
 */
export function exportNote(note: VoiceNote, exportFormat: ExportFormat): string {
  switch (exportFormat) {
    case "markdown":
      return exportToMarkdown(note);
    case "notion":
      return exportToNotion(note);
    case "email":
      return exportToEmail(note);
    default:
      return exportToMarkdown(note);
  }
}

/**
 * @description 导出为 Markdown 格式（兼容 Obsidian）
 * @param note - 语音笔记
 * @returns Markdown 文本
 */
export function exportToMarkdown(note: VoiceNote): string {
  const { summary, transcription } = note;
  const dateStr = format(new Date(note.createdAt), "yyyy-MM-dd HH:mm");

  let md = `# ${summary.title}\n\n`;
  md += `> 创建时间：${dateStr} | 时长：${Math.round(transcription.duration / 60)} 分钟\n\n`;

  if (summary.tags.length > 0) {
    md += `**标签**：${summary.tags.map((t) => `#${t}`).join(" ")}\n\n`;
  }

  md += `## 摘要\n\n${summary.summary}\n\n`;

  if (summary.keyPoints.length > 0) {
    md += `## 关键要点\n\n`;
    summary.keyPoints.forEach((point) => {
      md += `- ${point}\n`;
    });
    md += "\n";
  }

  if (summary.todoItems.length > 0) {
    md += `## 待办事项\n\n`;
    summary.todoItems.forEach((item) => {
      const checkbox = item.completed ? "[x]" : "[ ]";
      const priority =
        item.priority === "high"
          ? "🔴"
          : item.priority === "medium"
            ? "🟡"
            : "🟢";
      md += `- ${checkbox} ${priority} ${item.content}\n`;
    });
    md += "\n";
  }

  md += `## 原始转录\n\n${transcription.text}\n`;

  return md;
}

/**
 * @description 导出为 Notion 兼容格式
 * @param note - 语音笔记
 * @returns Notion 格式文本
 */
export function exportToNotion(note: VoiceNote): string {
  const { summary, transcription } = note;
  const dateStr = format(new Date(note.createdAt), "yyyy-MM-dd HH:mm");

  let content = `${summary.title}\n\n`;
  content += `📅 ${dateStr}\n`;
  content += `⏱ ${Math.round(transcription.duration / 60)} 分钟\n`;
  content += `🏷️ ${summary.tags.join(", ")}\n\n`;
  content += `---\n\n`;
  content += `📋 摘要\n${summary.summary}\n\n`;

  if (summary.keyPoints.length > 0) {
    content += `💡 关键要点\n`;
    summary.keyPoints.forEach((point) => {
      content += `• ${point}\n`;
    });
    content += "\n";
  }

  if (summary.todoItems.length > 0) {
    content += `✅ 待办事项\n`;
    summary.todoItems.forEach((item) => {
      const status = item.completed ? "✓" : "○";
      content += `${status} [${item.priority}] ${item.content}\n`;
    });
    content += "\n";
  }

  content += `---\n\n📝 完整转录\n${transcription.text}\n`;

  return content;
}

/**
 * @description 导出为邮件格式
 * @param note - 语音笔记
 * @returns 邮件格式文本
 */
export function exportToEmail(note: VoiceNote): string {
  const { summary, transcription } = note;
  const dateStr = format(new Date(note.createdAt), "yyyy-MM-dd HH:mm");

  let email = `主题：${summary.title}\n\n`;
  email += `日期：${dateStr}\n`;
  email += `时长：${Math.round(transcription.duration / 60)} 分钟\n\n`;
  email += `---\n\n`;
  email += `摘要：\n${summary.summary}\n\n`;

  if (summary.keyPoints.length > 0) {
    email += `关键要点：\n`;
    summary.keyPoints.forEach((point, i) => {
      email += `${i + 1}. ${point}\n`;
    });
    email += "\n";
  }

  if (summary.todoItems.length > 0) {
    email += `行动项目：\n`;
    summary.todoItems.forEach((item, i) => {
      const priority =
        item.priority === "high"
          ? "[紧急]"
          : item.priority === "medium"
            ? "[一般]"
            : "[低]";
      email += `${i + 1}. ${priority} ${item.content}\n`;
    });
    email += "\n";
  }

  email += `---\n\n附：完整转录内容\n\n${transcription.text}\n`;

  return email;
}

/**
 * @description 触发浏览器文件下载
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mimeType - MIME 类型
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
