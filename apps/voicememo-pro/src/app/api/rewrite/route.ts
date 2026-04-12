import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildRewritePrompt, getSystemMessage } from "@/lib/aiService";
import type { ToneStyle, PlatformFormat } from "@/types";

/**
 * @route POST /api/rewrite
 * @description 使用 GPT 根据指定语气和平台格式重写内容
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "未配置 OPENAI_API_KEY，请在 .env 中设置",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, tone, platform } = body as {
      text: string;
      tone: ToneStyle;
      platform: PlatformFormat;
    };

    if (!text || !tone || !platform) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数: text, tone, platform" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: getSystemMessage() },
        { role: "user", content: buildRewritePrompt(text, tone, platform) },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const rewrittenText = completion.choices[0]?.message?.content?.trim();

    if (!rewrittenText) {
      return NextResponse.json(
        { success: false, error: "AI 未返回有效内容" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rewrittenText,
    });
  } catch (error) {
    console.error("Rewrite error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "重写服务出错",
      },
      { status: 500 }
    );
  }
}
