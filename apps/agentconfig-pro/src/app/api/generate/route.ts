import { NextRequest, NextResponse } from "next/server";
import { analyzeRepo } from "@/lib/analyzer";
import { generateAgentsFile } from "@/lib/generator";
import type { GenerateOptions } from "@/types";

/**
 * @description POST /api/generate — 分析仓库并生成 AGENTS.md 配置文件
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateOptions = await request.json();

    if (!body.repoUrl || typeof body.repoUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid repoUrl" },
        { status: 400 }
      );
    }

    const repoInfo = await analyzeRepo(body.repoUrl);
    const result = generateAgentsFile(repoInfo, body);
    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
