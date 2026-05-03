import { NextRequest, NextResponse } from "next/server";

/**
 * @description 导出 API（预留）
 * 客户端已实现 PDF/DOCX 导出，此端点用于未来服务端渲染导出
 */
export async function POST(req: NextRequest) {
  try {
    const { format } = await req.json();

    return NextResponse.json({
      message: `Export to ${format} is handled client-side. Server-side export coming soon.`,
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
