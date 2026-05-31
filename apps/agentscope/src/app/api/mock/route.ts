/**
 * @fileoverview Mock 数据 API - 生成演示数据
 */

import { NextResponse } from "next/server";
import { generateMockLogs } from "@/lib/mock-data";

/**
 * @description POST /api/mock - 生成模拟日志数据
 */
export async function POST(): Promise<NextResponse> {
  const logs = generateMockLogs(50);
  return NextResponse.json({ logs });
}
