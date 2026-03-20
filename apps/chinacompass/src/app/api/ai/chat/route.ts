/**
 * @fileoverview AI聊天API - 合规顾问对话接口
 */

import { NextRequest, NextResponse } from "next/server";
import { chatWithAdvisor } from "@/lib/aiService";

/**
 * @description POST /api/ai/chat - AI顾问对话
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "请提供对话消息" },
        { status: 400 }
      );
    }

    const reply = await chatWithAdvisor(
      messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    );

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "AI服务暂时不可用，请稍后重试" },
      { status: 500 }
    );
  }
}
