import type { LLMResponse } from '@/types';

/**
 * @description 调用 LLM API 将自然语言描述转换为图表代码
 * @param text - 用户的自然语言描述
 * @returns 包含 Mermaid 和 PlantUML 代码的结构化响应
 */
export async function generateChart(text: string): Promise<LLMResponse> {
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
