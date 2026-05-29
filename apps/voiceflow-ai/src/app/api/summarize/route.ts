/**
 * @fileoverview AI 摘要 API 路由 - 调用 LLM 生成结构化笔记
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSummaryPrompt } from "@/lib/summary";

/**
 * @description 延迟初始化 OpenAI 客户端，避免构建时报错
 */
function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * @description POST /api/summarize - 接收转录文本并返回 AI 摘要
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ message: "文本内容为空" }, { status: 400 });
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { message: "文本过长，请分段处理" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSummaryPrompt() },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI 未返回有效内容");
    }

    const result = JSON.parse(content);

    return NextResponse.json({
      title: result.title || "未命名笔记",
      summary: result.summary || "",
      keyPoints: result.keyPoints || [],
      todoItems: (result.todoItems || []).map(
        (item: { id?: string; content: string; completed?: boolean; priority?: string }, index: number) => ({
          id: item.id || String(index + 1),
          content: item.content,
          completed: item.completed || false,
          priority: item.priority || "medium",
        })
      ),
      tags: result.tags || [],
    });
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json(
      { message: "摘要生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
