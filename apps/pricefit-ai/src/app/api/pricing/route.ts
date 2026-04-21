/**
 * @fileoverview 定价计算 API 路由
 * POST /api/pricing — 接收价值和成本指标，返回定价建议
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculatePricing } from '@/lib/pricing-engine';
import type { ValueMetrics, CostMetrics } from '@/types';

/**
 * @description 处理定价计算请求
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>} 定价结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      valueMetrics,
      costMetrics,
      competitorPrice = 0,
    }: {
      valueMetrics: ValueMetrics;
      costMetrics: CostMetrics;
      competitorPrice?: number;
    } = body;

    if (!valueMetrics || !costMetrics) {
      return NextResponse.json(
        { error: '缺少必要参数: valueMetrics 和 costMetrics' },
        { status: 400 }
      );
    }

    const result = calculatePricing(valueMetrics, costMetrics, competitorPrice);

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { error: '定价计算失败，请检查输入参数' },
      { status: 500 }
    );
  }
}
