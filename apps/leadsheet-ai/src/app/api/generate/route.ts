/**
 * @fileoverview AI 乐谱生成 API 路由
 * 提供 POST 端点，支持接入 LLM（OpenAI/DeepSeek）或使用本地规则引擎。
 */

import { NextRequest, NextResponse } from "next/server";
import { generateLeadSheet } from "@/lib/leadSheetGenerator";
import type { GenerateRequest } from "@/types";

/**
 * @description POST /api/generate — 生成 Lead Sheet
 * @param {NextRequest} req - 包含 GenerateRequest 的请求体
 * @returns {NextResponse} 生成的 LeadSheet 对象
 */
export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.title || !body.style || !body.key) {
      return NextResponse.json(
        { error: "Missing required fields: title, style, key" },
        { status: 400 }
      );
    }

    const aiProvider = process.env.AI_PROVIDER;
    const apiKey = process.env.OPENAI_API_KEY;

    if (aiProvider === "openai" && apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are a jazz music theory expert. Generate a lead sheet as JSON.
                The response should be a valid JSON object matching this schema:
                { measures: [{ chords: [{ root, accidental, quality, beats }], melody: [{ name, accidental, octave, duration }] }] }
                Only output the JSON, no explanation.`,
              },
              {
                role: "user",
                content: `Generate a ${body.measures}-measure lead sheet in the key of ${body.key}, 
                style: ${body.style}, tempo: ${body.tempo} BPM, complexity: ${body.complexity}.
                Title: "${body.title}". ${body.description || ""}`,
              },
            ],
            temperature: 0.8,
            max_tokens: 4000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            const sheet = generateLeadSheet(body);
            if (parsed.measures) {
              sheet.measures = parsed.measures;
            }
            return NextResponse.json(sheet);
          }
        }
      } catch {
        // Fall through to local generation
      }
    }

    const sheet = generateLeadSheet(body);
    return NextResponse.json(sheet);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
