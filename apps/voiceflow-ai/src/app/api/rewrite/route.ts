import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { RewriteStyle } from '@/types';

/**
 * @description 根据风格获取系统提示词
 */
function getSystemPrompt(style: RewriteStyle): string {
  const prompts: Record<RewriteStyle, string> = {
    summary: `你是一位专业的文字编辑。请将用户提供的语音转录文本进行智能整理：
- 去除口语化表达、语气词、重复内容
- 提取核心要点，生成简洁的摘要
- 使用清晰的段落结构
- 保留所有重要信息，不遗漏关键细节`,

    formal: `你是一位专业的商务文书编辑。请将用户提供的语音转录文本改写为正式的商务文档：
- 使用正式、专业的语言风格
- 逻辑清晰，结构严谨
- 适合用于邮件、报告等正式场合
- 保留原文所有关键信息`,

    bullet: `你是一位高效的笔记整理专家。请将用户提供的语音转录文本整理为要点列表：
- 使用清晰的层级结构
- 每个要点简洁明了
- 使用 Markdown 列表格式
- 按逻辑顺序排列要点`,

    blog: `你是一位优秀的内容创作者。请将用户提供的语音转录文本改写为引人入胜的博客文章：
- 添加吸引人的标题和小标题
- 使用生动、流畅的语言
- 保持内容的可读性和趣味性
- 适当使用 Markdown 格式排版`,
  };
  return prompts[style];
}

/**
 * @description AI 重写 API — 使用 GPT 对转录文本进行智能重写
 * @param request - 包含文本和风格的 JSON 请求
 * @returns 重写后的标题和正文
 */
export async function POST(request: NextRequest) {
  try {
    const { text, style = 'summary', language } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: '未提供有效文本' }, { status: 400 });
    }

    const languageHint = language ? `\n请使用${language === 'chinese' || language === 'zh' ? '中文' : language}输出。` : '';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(style as RewriteStyle) + languageHint,
        },
        {
          role: 'user',
          content: `请整理以下语音转录文本：\n\n${text}`,
        },
      ],
      temperature: 0.3,
    });

    const rewrittenText = completion.choices[0]?.message?.content || '';

    const titleCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '请为以下文本生成一个简短的标题（不超过20个字），只返回标题文本，不要加任何标点或格式。',
        },
        { role: 'user', content: rewrittenText.substring(0, 500) },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const title = titleCompletion.choices[0]?.message?.content?.trim() || '语音笔记';

    return NextResponse.json({ title, rewrittenText });
  } catch (error) {
    console.error('Rewrite error:', error);
    return NextResponse.json(
      { error: '重写失败，请稍后再试' },
      { status: 500 }
    );
  }
}
