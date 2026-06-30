/**
 * @fileoverview Stripe Checkout API 路由
 * POST /api/stripe/checkout - 创建支付会话
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import type { PlanType, ApiResponse } from '@/types';

/**
 * 创建 Stripe Checkout 会话
 * @param {NextRequest} request - 请求对象
 * @returns {Promise<NextResponse<ApiResponse<{ url: string }>>>}
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ url: string }>>> {
  try {
    const { plan, interval, email } = (await request.json()) as {
      plan: PlanType;
      interval: 'monthly' | 'yearly';
      email?: string;
    };

    if (!plan || plan === 'free') {
      return NextResponse.json(
        { success: false, error: '无需支付' },
        { status: 400 }
      );
    }

    const url = await createCheckoutSession(plan, interval, email);

    if (!url) {
      return NextResponse.json(
        { success: false, error: '支付服务暂不可用' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '创建支付会话失败';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
