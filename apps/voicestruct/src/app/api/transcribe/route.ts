import { NextRequest, NextResponse } from "next/server";

/**
 * @description Whisper API 语音转文字端点
 * 接收音频文件，调用 OpenAI Whisper API 进行转写
 * @param {NextRequest} request - 包含音频数据的请求
 * @returns {NextResponse} 转写结果或错误信息
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "未提供音频文件" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "服务器未配置 OpenAI API Key" },
        { status: 500 }
      );
    }

    const whisperFormData = new FormData();
    whisperFormData.append("file", audioFile, "recording.webm");
    whisperFormData.append("model", "whisper-1");
    whisperFormData.append("response_format", "json");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: whisperFormData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            error?.error?.message || `Whisper API 返回错误: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ transcript: result.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "转写过程中发生错误，请重试" },
      { status: 500 }
    );
  }
}
