/**
 * @fileoverview 竞品矩阵生成 API 路由
 * POST /api/competitors — 接收竞品列表，返回对比矩阵
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCompetitorMatrix } from '@/lib/competitor-engine';
import type { Competitor } from '@/types';

/**
 * @description 处理竞品矩阵生成请求
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>} 竞品矩阵
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      competitors,
      yourPrice,
      yourFeatures,
    }: {
      competitors: Competitor[];
      yourPrice: number;
      yourFeatures: string[];
    } = body;

    if (!competitors || !Array.isArray(competitors)) {
      return NextResponse.json(
        { error: '缺少必要参数: competitors 数组' },
        { status: 400 }
      );
    }

    const matrix = generateCompetitorMatrix(competitors, yourPrice || 0, yourFeatures || []);

    return NextResponse.json({ success: true, data: matrix });
  } catch {
    return NextResponse.json(
      { error: '竞品矩阵生成失败' },
      { status: 500 }
    );
  }
}
