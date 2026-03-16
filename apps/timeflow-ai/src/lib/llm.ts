import type { LLMResponse } from '@/types';

/**
 * 调用 LLM API 将文本转换为结构化的时间线数据
 */
export async function generateTimeline(text: string): Promise<LLMResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '生成失败');
  }

  return response.json();
}
