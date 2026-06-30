/**
 * @fileoverview 配置同步 API 路由
 * POST /api/sync - 将生成的配置转换/同步到不同工具标准
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMultiConfigs } from '@/lib/generator';
import type { ApiResponse, GeneratedConfig, AnalysisResult, ToolStandard } from '@/types';

/**
 * 同步配置到多个工具标准
 * @param {NextRequest} request - 请求对象
 * @returns {Promise<NextResponse<ApiResponse<GeneratedConfig[]>>>}
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GeneratedConfig[]>>> {
  try {
    const body = await request.json();
    const {
      analysis,
      targetStandards,
    }: {
      analysis: AnalysisResult;
      targetStandards: ToolStandard[];
    } = body;

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: '缺少分析数据' },
        { status: 400 }
      );
    }

    if (!targetStandards || targetStandards.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择目标工具标准' },
        { status: 400 }
      );
    }

    const configs = await generateMultiConfigs(analysis, targetStandards);

    return NextResponse.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '同步失败';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
