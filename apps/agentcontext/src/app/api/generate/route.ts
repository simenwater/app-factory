/**
 * @fileoverview 配置文件生成 API 路由
 * POST /api/generate - 基于分析结果生成 AGENTS.md 等配置文件
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMultiConfigs } from '@/lib/generator';
import type { ApiResponse, GeneratedConfig, AnalysisResult, ToolStandard } from '@/types';

/**
 * 生成配置文件
 * @param {NextRequest} request - 请求对象，body 包含 { analysis, standards, customInstructions? }
 * @returns {Promise<NextResponse<ApiResponse<GeneratedConfig[]>>>}
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GeneratedConfig[]>>> {
  try {
    const body = await request.json();
    const {
      analysis,
      standards,
      customInstructions,
    }: {
      analysis: AnalysisResult;
      standards: ToolStandard[];
      customInstructions?: string;
    } = body;

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: '请先分析仓库' },
        { status: 400 }
      );
    }

    if (!standards || standards.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择至少一个工具标准' },
        { status: 400 }
      );
    }

    const configs = await generateMultiConfigs(
      analysis,
      standards,
      customInstructions
    );

    return NextResponse.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
