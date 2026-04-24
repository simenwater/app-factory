import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { getFormatPrompt } from "@/lib/aiService";
import type { OutputFormat } from "@/types";

/**
 * @route POST /api/polish
 * 使用 OpenAI GPT 润色转录文本
 */
export async function POST(request: Request) {
  try {
    const { transcript, format } = (await request.json()) as {
      transcript: string;
      format: OutputFormat;
    };

    if (!transcript?.trim()) {
      return NextResponse.json(
        { message: "转录文本不能为空" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "未配置 OpenAI API Key" },
        { status: 500 }
      );
    }

    const systemPrompt = getFormatPrompt(format);

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `请处理以下语音转录文本：\n\n${transcript}` },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Polish error:", error);
    return NextResponse.json(
      { message: "润色失败，请重试" },
      { status: 500 }
    );
  }
}
