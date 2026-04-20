import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * @description 语音转文字 API — 使用 OpenAI Whisper 模型
 * @param request - 包含音频文件的 FormData 请求
 * @returns 转录后的文本、语言和时长
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: '未提供音频文件' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
    });

    return NextResponse.json({
      text: transcription.text,
      language: transcription.language || 'unknown',
      duration: transcription.duration || 0,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: '转录失败，请稍后再试' },
      { status: 500 }
    );
  }
}
