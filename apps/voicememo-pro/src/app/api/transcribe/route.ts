import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * @route POST /api/transcribe
 * @description 使用 OpenAI Whisper 将音频转为文字
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "未配置 OPENAI_API_KEY，请在 .env 中设置",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "请上传有效的音频文件" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });

    const file = new File([audioFile], "recording.webm", {
      type: audioFile.type || "audio/webm",
    });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
      language: "zh",
      response_format: "verbose_json",
    });

    return NextResponse.json({
      success: true,
      text: transcription.text,
      duration: transcription.duration ?? 0,
    });
  } catch (error) {
    console.error("Transcribe error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "转录服务出错",
      },
      { status: 500 }
    );
  }
}
