/**
 * @fileoverview 简历优化 API Route — POST /api/resume
 * 接收简历文本，使用 OpenAI 进行智能优化重写
 */
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/resume
 * @param req - 包含 resumeText 和可选 jobDescription 的请求体
 * @returns 优化后的简历文本和亮点列表
 */
export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "resumeText is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return fallbackOptimize(resumeText, jobDescription);
    }

    const systemPrompt = `You are a professional resume writer and career coach. 
Optimize the given resume to be more impactful, using strong action verbs, quantified achievements, and clean formatting.
${jobDescription ? "Tailor the resume to match the following job description." : ""}
Return JSON with: { "optimizedText": "...", "highlights": ["improvement1", "improvement2", ...] }`;

    const userPrompt = `Resume:\n${resumeText}${jobDescription ? `\n\nJob Description:\n${jobDescription}` : ""}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI error:", errText);
      return fallbackOptimize(resumeText, jobDescription);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackOptimize(resumeText, jobDescription);
    }

    const parsed = JSON.parse(content);
    return NextResponse.json({
      optimizedText: parsed.optimizedText || resumeText,
      highlights: parsed.highlights || [],
    });
  } catch (error) {
    console.error("Resume optimization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * 当 OpenAI API 不可用时的降级优化策略
 * @param text - 原始简历文本
 * @param _jd - 职位描述（降级模式不使用）
 * @returns 基本优化结果
 */
function fallbackOptimize(text: string, _jd?: string) {
  const lines = text.split("\n").filter((l) => l.trim());
  const optimized = lines
    .map((line) => {
      let l = line.trim();
      if (l.startsWith("-") || l.startsWith("•")) {
        l = l.replace(/^[-•]\s*/, "");
        if (!/^(Led|Managed|Developed|Designed|Implemented|Achieved|Increased|Reduced|Created|Built|Delivered|Optimized|Spearheaded|Orchestrated)/i.test(l)) {
          l = `• Achieved: ${l}`;
        } else {
          l = `• ${l}`;
        }
      }
      return l;
    })
    .join("\n");

  return NextResponse.json({
    optimizedText: optimized,
    highlights: [
      "Added action verbs to bullet points",
      "Improved formatting consistency",
      "Tip: Add OPENAI_API_KEY for AI-powered deep optimization",
    ],
  });
}
