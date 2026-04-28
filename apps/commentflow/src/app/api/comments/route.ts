/**
 * @fileoverview 评论 API 路由 — CRUD 操作
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * @description 获取所有评论（支持筛选）
 * @param request - 包含可选的 status, projectId, priority 查询参数
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const projectId = searchParams.get('projectId');
  const priority = searchParams.get('priority');

  return NextResponse.json({
    success: true,
    data: [],
    filters: { status, projectId, priority },
    message: 'MVP 演示 — 实际数据由 Zustand store 管理',
  });
}

/**
 * @description 创建新评论
 * @param request - 包含评论数据的请求体
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, projectId, element, pageUrl, priority, category } = body;

    if (!content || !projectId || !element || !pageUrl) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段: content, projectId, element, pageUrl' },
        { status: 400 }
      );
    }

    const comment = {
      id: `c-${Date.now()}`,
      projectId,
      content,
      element,
      pageUrl,
      priority: priority || 'medium',
      category: category || 'other',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: '请求格式错误' },
      { status: 400 }
    );
  }
}
