/**
 * @fileoverview AI 摘要服务 - 使用 LLM 自动提取关键信息和待办事项
 */

import type { SummaryResult } from "@/types";

/**
 * @description 调用 AI 服务生成摘要和待办事项
 * @param text - 转录文本
 * @returns AI 生成的摘要结果
 */
export async function generateSummary(text: string): Promise<SummaryResult> {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "摘要生成失败");
  }

  return response.json();
}

/**
 * @description 构建用于摘要生成的系统提示词
 * @returns 系统提示词
 */
export function buildSummaryPrompt(): string {
  return `你是一个专业的笔记整理助手。请根据用户提供的语音转录文本，执行以下操作：

1. 生成一个简洁的标题（不超过20字）
2. 编写一段结构化摘要（100-200字）
3. 提取3-7个关键要点
4. 识别所有待办事项/行动项目，并为每个标注优先级（high/medium/low）
5. 生成2-5个相关标签

请以 JSON 格式输出，结构如下：
{
  "title": "标题",
  "summary": "摘要内容",
  "keyPoints": ["要点1", "要点2"],
  "todoItems": [{"id": "1", "content": "内容", "completed": false, "priority": "high"}],
  "tags": ["标签1", "标签2"]
}

注意事项：
- 保持专业、简洁的风格
- 待办事项需要可执行、具体
- 优先级根据紧急程度和重要性判断`;
}

/**
 * @description 从文本中提取可能的待办事项（本地后备方案）
 * @param text - 原始文本
 * @returns 提取到的待办事项文本列表
 */
export function extractTodosLocally(text: string): string[] {
  const patterns = [
    /需要(.+?)(?:[。，；\n])/g,
    /要(.+?)(?:[。，；\n])/g,
    /记得(.+?)(?:[。，；\n])/g,
    /别忘了(.+?)(?:[。，；\n])/g,
    /TODO[:\s]*(.+?)(?:[。，；\n])/gi,
    /action item[:\s]*(.+?)(?:[。，；\n])/gi,
  ];

  const todos: string[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const item = match[1].trim();
      if (item.length > 2 && item.length < 100) {
        todos.push(item);
      }
    }
  }

  return [...new Set(todos)];
}
