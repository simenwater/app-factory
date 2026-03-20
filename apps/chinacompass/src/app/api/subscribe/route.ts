/**
 * @fileoverview 订阅API - 处理用户订阅请求
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * @description POST /api/subscribe - 创建订阅
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "请指定订阅方案" },
        { status: 400 }
      );
    }

    if (planId === "free") {
      return NextResponse.json({
        message: "您当前已在使用基础版",
        status: "active",
      });
    }

    if (planId === "enterprise") {
      return NextResponse.json({
        message: "感谢您的关注！企业版定制方案请联系我们的商务团队：business@chinacompass.ai",
        status: "contact",
      });
    }

    return NextResponse.json({
      message: "支付功能即将上线，敬请期待！目前您可以免费体验所有功能。",
      status: "coming_soon",
    });
  } catch {
    return NextResponse.json(
      { error: "服务暂时不可用" },
      { status: 500 }
    );
  }
}
