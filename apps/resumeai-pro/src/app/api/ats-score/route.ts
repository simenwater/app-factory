import { NextRequest, NextResponse } from "next/server";
import { calculateATSScore } from "@/lib/ai";
import type { ResumeData } from "@/types";

/**
 * @description ATS 评分 API
 * 接收简历数据和可选的职位描述，返回 ATS 兼容性评分结果
 */
export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription } = await req.json();

    if (!resume) {
      return NextResponse.json(
        { error: "resume data is required" },
        { status: 400 }
      );
    }

    const result = calculateATSScore(resume as ResumeData, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    console.error("ATS Score API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
