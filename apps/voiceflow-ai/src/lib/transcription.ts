/**
 * @fileoverview 语音转文字服务 - 集成 OpenAI Whisper API
 */

import type { TranscriptionResult } from "@/types";

/**
 * @description 将音频文件发送到 Whisper API 进行转录
 * @param audioBlob - 音频 Blob 数据
 * @returns 转录结果
 */
export async function transcribeAudio(
  audioBlob: Blob
): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "转录失败");
  }

  return response.json();
}

/**
 * @description 格式化转录时长
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * @description 计算转录文本的字数
 * @param text - 文本内容
 * @returns 字数
 */
export function countWords(text: string): number {
  if (!text.trim()) return 0;
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = text
    .replace(/[\u4e00-\u9fa5]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return chineseChars.length + englishWords.length;
}
