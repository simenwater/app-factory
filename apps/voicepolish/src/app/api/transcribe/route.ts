import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

/**
 * @route POST /api/transcribe
 * 使用 OpenAI Whisper API 转录音频文件
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { message: "未提供音频文件" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "未配置 OpenAI API Key" },
        { status: 500 }
      );
    }

    const transcription = await getOpenAI().audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "zh",
      response_format: "text",
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { message: "转录失败，请重试" },
      { status: 500 }
    );
  }
}
