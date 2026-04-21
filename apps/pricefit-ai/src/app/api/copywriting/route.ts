/**
 * @fileoverview 文案生成 API 路由
 * POST /api/copywriting — 接收产品信息，返回定价页面文案
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCopywriting } from '@/lib/copywriting-engine';
import type { CopywritingInput } from '@/types';

/**
 * @description 处理文案生成请求
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>} 文案结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: CopywritingInput = body;

    if (!input.productName || !input.pricingTiers) {
      return NextResponse.json(
        { error: '缺少必要参数: productName 和 pricingTiers' },
        { status: 400 }
      );
    }

    const result = generateCopywriting(input);

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { error: '文案生成失败' },
      { status: 500 }
    );
  }
}
