/**
 * @fileoverview 日志 API 路由 - 接收代理服务器推送的日志
 */

import { NextRequest, NextResponse } from "next/server";
import type { RequestLog } from "@/types";

/** 内存中的日志存储（生产环境应使用数据库） */
const inMemoryLogs: RequestLog[] = [];
const MAX_LOGS = 10000;

/**
 * @description GET /api/logs - 获取日志列表
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    logs: inMemoryLogs,
    total: inMemoryLogs.length,
  });
}

/**
 * @description POST /api/logs - 接收新日志
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const log = (await request.json()) as RequestLog;
    inMemoryLogs.unshift(log);
    if (inMemoryLogs.length > MAX_LOGS) {
      inMemoryLogs.length = MAX_LOGS;
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid log data" },
      { status: 400 }
    );
  }
}

/**
 * @description DELETE /api/logs - 清空日志
 */
export async function DELETE(): Promise<NextResponse> {
  inMemoryLogs.length = 0;
  return NextResponse.json({ success: true });
}
