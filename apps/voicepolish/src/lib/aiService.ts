import type { OutputFormat } from "@/types";

/**
 * @constant FORMAT_PROMPTS
 * 各输出格式对应的 AI 提示词
 */
const FORMAT_PROMPTS: Record<OutputFormat, string> = {
  email: `你是一位专业的商务写作助手。请将以下语音转录文本整理成一封正式、清晰的邮件。
要求：
- 包含适当的问候语和结束语
- 条理清晰，逻辑通顺
- 修正口语化表达，使其正式化
- 保留原文的核心信息`,

  tweet: `你是一位社交媒体运营专家。请将以下语音转录文本提炼成精炼的社交媒体推文。
要求：
- 控制在 280 字符以内
- 抓住核心观点
- 语言生动有吸引力
- 适当添加相关话题标签`,

  blog: `你是一位专业博客写手。请将以下语音转录文本整理成结构化的博客文章草稿。
要求：
- 包含引人注目的标题
- 分段落组织内容
- 添加适当的小标题
- 优化语言流畅度
- 保留原意的同时提升可读性`,

  summary: `你是一位高效的信息整理专家。请将以下语音转录文本整理成简洁的要点摘要。
要求：
- 提取核心要点，用列表形式呈现
- 每个要点简明扼要
- 按重要性排序
- 去除冗余和重复内容`,

  minutes: `你是一位专业的会议记录员。请将以下语音转录文本整理成规范的会议纪要。
要求：
- 包含会议主题
- 列出讨论要点
- 标注决议事项
- 记录待办事项（如有）
- 格式规范、条理清晰`,
};

/**
 * @function polishTranscript
 * 调用 AI API 润色转录文本
 * @param {string} transcript - 原始转录文本
 * @param {OutputFormat} format - 输出格式
 * @returns {Promise<string>} 润色后的文本
 */
export async function polishTranscript(
  transcript: string,
  format: OutputFormat
): Promise<string> {
  const response = await fetch("/api/polish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, format }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "润色请求失败");
  }

  const data = await response.json();
  return data.result;
}

/**
 * @function transcribeAudio
 * 调用 Whisper API 转录音频
 * @param {Blob} audioBlob - 音频数据
 * @returns {Promise<string>} 转录文本
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "转录请求失败");
  }

  const data = await response.json();
  return data.text;
}

/**
 * @function getFormatPrompt
 * 获取指定格式的提示词
 * @param {OutputFormat} format - 输出格式
 * @returns {string} 提示词
 */
export function getFormatPrompt(format: OutputFormat): string {
  return FORMAT_PROMPTS[format];
}
