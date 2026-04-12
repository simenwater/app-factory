import type { ToneStyle, PlatformFormat } from "@/types";

/**
 * @description AI 重写服务 — 构建 prompt 并调用 OpenAI API
 */

/**
 * @function buildRewritePrompt
 * @description 根据语气和平台构建重写 prompt
 * @param {string} text - 原始文本
 * @param {ToneStyle} tone - 语气风格
 * @param {PlatformFormat} platform - 平台格式
 * @returns {string} 完整 prompt
 */
export function buildRewritePrompt(
  text: string,
  tone: ToneStyle,
  platform: PlatformFormat
): string {
  const toneInstructions: Record<ToneStyle, string> = {
    professional:
      "使用专业、正式的商务语言。保持简洁明了，用数据和事实支撑观点。避免口语化表达。",
    casual:
      "使用轻松、亲切的对话式语言。可以适当使用口语化表达和比喻，让内容更容易理解和亲近。",
    marketing:
      "使用有感染力和说服力的营销语言。强调价值主张，使用行动号召（CTA），营造紧迫感或 FOMO。",
  };

  const platformInstructions: Record<PlatformFormat, string> = {
    linkedin:
      "格式化为 LinkedIn 帖子。以引人注目的开头吸引注意力，使用短段落，适当使用 emoji，结尾加上互动话题或 CTA。控制在 3000 字符以内。",
    blog:
      "格式化为博客文章。包含一个吸引人的标题（用 # ），使用 Markdown 格式，包含清晰的引言、主体和结论段落，可以使用列表和小标题。",
    email:
      "格式化为营销邮件。包含吸引人的主题行（用「主题：」标注），简短有力的正文，清晰的 CTA 按钮文案。控制在 2000 字符以内。",
    twitter:
      "格式化为推特/X 帖子。极度精炼，控制在 280 字符以内。如果内容较多，可以拆分为推特串（用序号标注）。使用相关话题标签。",
    general:
      "使用清晰的段落结构，适当使用标点和分段。不强制特定格式，保持灵活性。",
  };

  return `你是一位资深的内容创作助手。请将以下语音转录的草稿内容，重新改写为高质量的内容。

## 语气要求
${toneInstructions[tone]}

## 格式要求
${platformInstructions[platform]}

## 重要规则
1. 保留原文的核心思想和关键信息
2. 修正语法错误和口语化的冗余表达
3. 优化内容结构和逻辑流
4. 直接输出最终内容，不要加前缀说明

## 原始草稿
${text}`;
}

/**
 * @function getSystemMessage
 * @description 获取 AI 系统角色消息
 * @returns {string} 系统消息内容
 */
export function getSystemMessage(): string {
  return "你是 VoiceMemo Pro 的 AI 写作助手，专门将杂乱的语音转录文字改写成不同风格、不同平台的专业内容。你精通中英文写作，擅长内容创作和营销文案。";
}
