/**
 * @fileoverview 集成 API 路由 — Slack/Jira 通知推送
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * @description 获取集成状态
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      slack: { connected: true, channel: '#design-feedback' },
      jira: { connected: true, projectKey: 'DASH' },
      linear: { connected: false },
    },
  });
}

/**
 * @description 发送集成通知（Slack/Jira 模拟）
 * @param request - 包含 type 和 payload 字段
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!type || !payload) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段: type, payload' },
        { status: 400 }
      );
    }

    if (type === 'slack') {
      return NextResponse.json({
        success: true,
        message: `Slack 通知已发送到 ${payload.channel || '#general'}`,
        data: {
          channel: payload.channel || '#general',
          text: payload.message,
          sentAt: new Date().toISOString(),
        },
      });
    }

    if (type === 'jira') {
      return NextResponse.json({
        success: true,
        message: `Jira Issue 已创建`,
        data: {
          ticketId: `${payload.projectKey || 'PROJ'}-${Math.floor(Math.random() * 1000)}`,
          summary: payload.summary,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(
      { success: false, error: `不支持的集成类型: ${type}` },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: '请求格式错误' },
      { status: 400 }
    );
  }
}
