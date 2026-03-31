import type { NoteStatus, ExportFormat, VoiceNote } from "@/types";

/**
 * @description 格式化文件大小
 * @param bytes - 字节数
 * @returns 可读的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * @description 格式化时长
 * @param seconds - 秒数
 * @returns 格式化的时长字符串 (mm:ss)
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * @description 格式化日期
 * @param dateStr - ISO 日期字符串
 * @returns 可读日期
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
 * @description 获取状态展示信息
 */
export function getStatusInfo(status: NoteStatus): {
  label: string;
  color: string;
} {
  const statusMap: Record<NoteStatus, { label: string; color: string }> = {
    uploading: { label: "上传中", color: "text-blue-500" },
    transcribing: { label: "转录中", color: "text-amber-500" },
    summarizing: { label: "分析中", color: "text-purple-500" },
    completed: { label: "已完成", color: "text-emerald-500" },
    error: { label: "错误", color: "text-red-500" },
  };
  return statusMap[status];
}

/**
 * @description 导出为指定格式
 */
export function exportNote(note: VoiceNote, format: ExportFormat): string {
  switch (format) {
    case "notion":
      return exportToNotion(note);
    case "obsidian":
      return exportToObsidian(note);
    case "markdown":
      return exportToMarkdown(note);
    case "text":
      return exportToText(note);
  }
}

/**
 * @description 导出为 Notion 格式（Markdown with toggles）
 */
function exportToNotion(note: VoiceNote): string {
  const lines: string[] = [
    `# ${note.title}`,
    "",
    `> 📅 ${new Date(note.createdAt).toLocaleDateString("zh-CN")} | ⏱️ ${formatDuration(note.duration)}`,
    "",
    "## 📝 摘要",
    "",
    note.summary,
    "",
  ];

  if (note.keyPoints.length > 0) {
    lines.push("## 🔑 关键要点", "");
    note.keyPoints.forEach((point) => lines.push(`- ${point}`));
    lines.push("");
  }

  if (note.actionItems.length > 0) {
    lines.push("## ✅ 行动项", "");
    note.actionItems.forEach((item) => lines.push(`- [ ] ${item}`));
    lines.push("");
  }

  lines.push(
    "---",
    "",
    "<details>",
    "<summary>📄 完整转录</summary>",
    "",
    note.transcript,
    "",
    "</details>"
  );

  return lines.join("\n");
}

/**
 * @description 导出为 Obsidian 格式（带 frontmatter）
 */
function exportToObsidian(note: VoiceNote): string {
  const lines: string[] = [
    "---",
    `title: "${note.title}"`,
    `date: ${note.createdAt}`,
    `duration: ${formatDuration(note.duration)}`,
    `tags: [voice-note]`,
    `status: ${note.status}`,
    "---",
    "",
    `# ${note.title}`,
    "",
    "## 摘要",
    "",
    note.summary,
    "",
  ];

  if (note.keyPoints.length > 0) {
    lines.push("## 关键要点", "");
    note.keyPoints.forEach((point) => lines.push(`- ${point}`));
    lines.push("");
  }

  if (note.actionItems.length > 0) {
    lines.push("## 行动项", "");
    note.actionItems.forEach((item) => lines.push(`- [ ] ${item}`));
    lines.push("");
  }

  lines.push("## 完整转录", "", `> [!note]- 展开查看`, `> ${note.transcript}`);

  return lines.join("\n");
}

/**
 * @description 导出为标准 Markdown
 */
function exportToMarkdown(note: VoiceNote): string {
  const lines: string[] = [
    `# ${note.title}`,
    "",
    `*${new Date(note.createdAt).toLocaleDateString("zh-CN")} · ${formatDuration(note.duration)}*`,
    "",
    "## 摘要",
    "",
    note.summary,
    "",
  ];

  if (note.keyPoints.length > 0) {
    lines.push("## 关键要点", "");
    note.keyPoints.forEach((point) => lines.push(`- ${point}`));
    lines.push("");
  }

  if (note.actionItems.length > 0) {
    lines.push("## 行动项", "");
    note.actionItems.forEach((item) => lines.push(`- [ ] ${item}`));
    lines.push("");
  }

  lines.push("## 完整转录", "", note.transcript);

  return lines.join("\n");
}

/**
 * @description 导出为纯文本
 */
function exportToText(note: VoiceNote): string {
  const lines: string[] = [
    note.title,
    "=".repeat(note.title.length),
    "",
    `日期: ${new Date(note.createdAt).toLocaleDateString("zh-CN")}`,
    `时长: ${formatDuration(note.duration)}`,
    "",
    "【摘要】",
    note.summary,
    "",
  ];

  if (note.keyPoints.length > 0) {
    lines.push("【关键要点】");
    note.keyPoints.forEach((point, i) => lines.push(`${i + 1}. ${point}`));
    lines.push("");
  }

  if (note.actionItems.length > 0) {
    lines.push("【行动项】");
    note.actionItems.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push("");
  }

  lines.push("【完整转录】", note.transcript);

  return lines.join("\n");
}

/**
 * @description 获取音频文件的时长
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      reject(new Error("无法读取音频文件"));
    });
    audio.src = URL.createObjectURL(file);
  });
}

/**
 * @description 支持的音频文件类型
 */
export const SUPPORTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/webm",
  "audio/ogg",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/aac",
  "audio/flac",
];

/**
 * @description 验证音频文件
 */
export function isValidAudioFile(file: File): boolean {
  return SUPPORTED_AUDIO_TYPES.includes(file.type) || /\.(mp3|wav|webm|ogg|m4a|aac|flac)$/i.test(file.name);
}

/**
 * @description 触发文件下载
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
