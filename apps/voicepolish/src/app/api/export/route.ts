import { NextResponse } from "next/server";

/**
 * @route POST /api/export
 * 导出润色后的内容为指定格式文件
 */
export async function POST(request: Request) {
  try {
    const { content, format, filename } = (await request.json()) as {
      content: string;
      format: string;
      filename?: string;
    };

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "内容不能为空" },
        { status: 400 }
      );
    }

    let mimeType: string;
    let ext: string;
    let exportContent: string;

    switch (format) {
      case "email":
        mimeType = "message/rfc822";
        ext = "eml";
        exportContent = [
          `Subject: VoicePolish Export`,
          `Content-Type: text/plain; charset=utf-8`,
          ``,
          content,
        ].join("\r\n");
        break;
      case "blog":
        mimeType = "text/markdown";
        ext = "md";
        exportContent = content;
        break;
      case "tweet":
      case "summary":
      case "minutes":
      default:
        mimeType = "text/plain";
        ext = "txt";
        exportContent = content;
        break;
    }

    const safeName = filename || `voicepolish-${format}`;

    return new Response(exportContent, {
      headers: {
        "Content-Type": `${mimeType}; charset=utf-8`,
        "Content-Disposition": `attachment; filename="${safeName}.${ext}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { message: "导出失败" },
      { status: 500 }
    );
  }
}
