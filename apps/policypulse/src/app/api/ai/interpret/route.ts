import { NextResponse } from "next/server";
import { interpretPolicy } from "@/lib/aiService";

/**
 * @interface InterpretRequest
 * AI解读请求体
 */
interface InterpretRequest {
  title: string;
  originalText: string;
  userIndustry?: string;
}

/**
 * POST /api/ai/interpret
 * 对指定政策进行实时AI解读分析
 */
export async function POST(request: Request) {
  try {
    const body: InterpretRequest = await request.json();

    if (!body.title || !body.originalText) {
      return NextResponse.json(
        { error: "title and originalText are required" },
        { status: 400 }
      );
    }

    const result = await interpretPolicy(
      body.title,
      body.originalText,
      body.userIndustry
    );

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI interpretation" },
      { status: 500 }
    );
  }
}
