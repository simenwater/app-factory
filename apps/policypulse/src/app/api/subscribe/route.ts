import { NextResponse } from "next/server";

/**
 * @interface SubscribeRequest
 * 订阅请求体
 */
interface SubscribeRequest {
  planId: string;
  email?: string;
}

/**
 * POST /api/subscribe
 * 订阅接口（MVP 阶段返回模拟响应）
 */
export async function POST(request: Request) {
  const body: SubscribeRequest = await request.json();

  if (!body.planId) {
    return NextResponse.json(
      { error: "planId is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Subscription created successfully",
    subscription: {
      id: `sub_${Date.now()}`,
      planId: body.planId,
      status: "active",
      createdAt: new Date().toISOString(),
    },
  });
}
