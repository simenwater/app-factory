/**
 * @fileoverview AI 转录 API 路由
 * 代理 OpenAI Whisper API 请求，处理音频文件上传和转录
 */

import { NextRequest, NextResponse } from 'next/server';

/** Whisper API 端点 */
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

/**
 * POST /api/transcribe
 * @description 接收音频文件并调用 Whisper API 进行转录
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: '未配置 OpenAI API 密钥' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const model = formData.get('model') || 'whisper-1';
    const responseFormat = formData.get('response_format') || 'verbose_json';
    const language = formData.get('language');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: '未提供有效的音频文件' },
        { status: 400 }
      );
    }

    const whisperFormData = new FormData();
    whisperFormData.append('file', file, 'recording.webm');
    whisperFormData.append('model', model as string);
    whisperFormData.append('response_format', responseFormat as string);
    whisperFormData.append('timestamp_granularities[]', 'segment');

    if (language) {
      whisperFormData.append('language', language as string);
    }

    const response = await fetch(WHISPER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: whisperFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Whisper API 错误: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('转录 API 错误:', error);
    return NextResponse.json(
      { error: '转录服务内部错误' },
      { status: 500 }
    );
  }
}
