/**
 * @fileoverview 语音转文字 API 路由 - 调用 OpenAI Whisper API
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * @description 延迟初始化 OpenAI 客户端，避免构建时报错
 */
function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * @description POST /api/transcribe - 接收音频文件并返回转录结果
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "未提供音频文件" }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { message: "文件大小不能超过 25MB" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    return NextResponse.json({
      text: transcription.text,
      duration: transcription.duration || 0,
      language: transcription.language || "unknown",
      confidence: 0.95,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { message: "转录服务暂时不可用，请稍后重试" },
      { status: 500 }
    );
  }
}
