import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/templates";

/**
 * @description AI 格式化端点
 * 接收转写文本和模板类型，调用 OpenAI GPT API 进行智能格式化
 * @param {NextRequest} request - 包含 transcript 和 template 的请求
 * @returns {NextResponse} 格式化结果或错误信息
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, template: templateId, customPrompt } = body;

    if (!transcript) {
      return NextResponse.json(
        { error: "未提供转写文本" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "服务器未配置 OpenAI API Key" },
        { status: 500 }
      );
    }

    const template = getTemplateById(templateId || "custom");
    const systemPrompt =
      customPrompt || template?.prompt || "Please structure and clean up the following text.";

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: transcript },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            error?.error?.message ||
            `OpenAI API 返回错误: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    const formatted = result.choices?.[0]?.message?.content || "";

    return NextResponse.json({ formatted });
  } catch (error) {
    console.error("Formatting error:", error);
    return NextResponse.json(
      { error: "格式化过程中发生错误，请重试" },
      { status: 500 }
    );
  }
}
