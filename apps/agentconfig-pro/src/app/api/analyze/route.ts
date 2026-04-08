import { NextRequest, NextResponse } from "next/server";
import { analyzeRepo } from "@/lib/analyzer";

/**
 * @description POST /api/analyze — 分析 GitHub 仓库结构
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid repoUrl" },
        { status: 400 }
      );
    }

    const repoInfo = await analyzeRepo(repoUrl);
    return NextResponse.json({ repoInfo });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
