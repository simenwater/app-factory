/**
 * @fileoverview 仓库分析 API 路由
 * POST /api/analyze - 分析 GitHub 仓库结构
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepository } from '@/lib/analyzer';
import type { ApiResponse, AnalysisResult } from '@/types';

/**
 * 分析 GitHub 仓库
 * @param {NextRequest} request - 请求对象，body 包含 { repoUrl, token? }
 * @returns {Promise<NextResponse<ApiResponse<AnalysisResult>>>}
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AnalysisResult>>> {
  try {
    const { repoUrl, token } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { success: false, error: '请提供 GitHub 仓库 URL' },
        { status: 400 }
      );
    }

    const analysis = await analyzeRepository(repoUrl, token);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '分析失败';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
