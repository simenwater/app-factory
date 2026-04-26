/**
 * @file LLM 调用封装
 * @description 封装 OpenAI API 调用，支持 fallback 到模拟数据
 */

import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

/**
 * @description 获取 OpenAI 客户端（单例）
 * @returns {OpenAI | null} 客户端实例，无 API Key 时返回 null
 */
function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * @description 调用 LLM 生成面试内容
 * @param {Array<{role: string; content: string}>} messages - 对话消息数组
 * @param {Object} [options] - 可选参数
 * @param {number} [options.temperature] - 温度参数
 * @param {number} [options.maxTokens] - 最大 token 数
 * @returns {Promise<string>} LLM 返回的文本
 */
export async function chatCompletion(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const client = getClient();

  if (!client) {
    return getMockResponse(messages);
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
  });

  return response.choices[0]?.message?.content ?? '';
}

/**
 * @description 无 API Key 时的模拟响应
 * @param {Array<{role: string; content: string}>} messages - 对话消息
 * @returns {string} 模拟响应文本
 */
function getMockResponse(
  messages: { role: string; content: string }[]
): string {
  const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content ?? '';
  const systemMsg = messages.find((m) => m.role === 'system')?.content ?? '';

  if (systemMsg.includes('面试') || systemMsg.includes('interview')) {
    return getMockInterviewResponse(lastUserMsg);
  }
  if (systemMsg.includes('评估') || systemMsg.includes('evaluate') || systemMsg.includes('code review')) {
    return getMockCodeEvalResponse();
  }
  if (systemMsg.includes('分析') || systemMsg.includes('analyze') || systemMsg.includes('weakness')) {
    return getMockAnalysisResponse();
  }

  return '这是一个模拟响应。请配置 OPENAI_API_KEY 以获取真实的 AI 响应。';
}

/** @description 面试模拟响应 */
function getMockInterviewResponse(userMessage: string): string {
  if (!userMessage || userMessage.length < 5) {
    return `好的，让我们开始前端面试吧！

**第一个问题：**

请解释一下 React 中 \`useState\` 和 \`useReducer\` 的区别，以及你在什么场景下会选择使用 \`useReducer\`？

请尽量从以下角度回答：
1. 状态复杂度
2. 性能考量
3. 实际项目经验`;
  }

  return `很好的回答！让我给你一些反馈：

**优点：**
- 你对核心概念的理解是正确的
- 举了实际的使用场景

**可以改进的地方：**
- 可以更深入地讨论性能方面的差异
- 建议补充 \`useReducer\` 在处理关联状态时的优势

**追问：**

在一个表单场景中，有 10+ 个输入字段且存在字段间联动验证，你会如何管理这些状态？请具体说明你的方案和理由。`;
}

/** @description 代码评估模拟响应 */
function getMockCodeEvalResponse(): string {
  return JSON.stringify({
    score: 72,
    issues: [
      {
        type: 'warning',
        line: 3,
        message: '建议使用 const 替代 let，因为该变量未被重新赋值',
        suggestion: '将 let 改为 const 以提高代码可读性和安全性',
      },
      {
        type: 'info',
        line: 8,
        message: '可以使用可选链操作符简化空值检查',
        suggestion: '使用 obj?.property 替代 obj && obj.property',
      },
    ],
    suggestions: [
      '考虑使用 TypeScript 为函数添加类型注解',
      '建议抽取重复逻辑为独立的工具函数',
      '可以使用 useMemo 优化计算密集型操作',
    ],
    optimizedCode:
      '// 优化后的代码示例\\nconst result = useMemo(() => {\\n  return data?.items?.filter(item => item.active) ?? [];\\n}, [data]);',
    explanation:
      '代码整体结构合理，但在性能优化和类型安全方面有提升空间。建议重点关注不可变性和 React 性能最佳实践。',
  });
}

/** @description 弱点分析模拟响应 */
function getMockAnalysisResponse(): string {
  return JSON.stringify({
    skills: [
      { category: 'javascript', score: 75, level: 'intermediate', details: 'ES6+ 语法掌握良好，闭包和原型链理解需加强' },
      { category: 'react', score: 68, level: 'intermediate', details: 'Hooks 基础使用熟练，性能优化和高级模式有待提升' },
      { category: 'css', score: 60, level: 'intermediate', details: 'Flexbox 掌握不错，Grid 和动画需要更多练习' },
      { category: 'typescript', score: 55, level: 'beginner', details: '基础类型使用没问题，泛型和高级类型需要加强' },
      { category: 'performance', score: 50, level: 'beginner', details: '基本概念了解，需要深入学习 Web Vitals 和优化策略' },
      { category: 'testing', score: 45, level: 'beginner', details: '了解 Jest 基础，需要学习集成测试和 E2E 测试' },
      { category: 'accessibility', score: 40, level: 'beginner', details: 'ARIA 标签使用不足，需系统学习 WCAG 标准' },
      { category: 'html', score: 70, level: 'intermediate', details: '语义化 HTML 使用合理，SEO 相关标签可以优化' },
    ],
    overallLevel: 'mid',
    weakestAreas: ['accessibility', 'testing', 'performance'],
    strongestAreas: ['javascript', 'html', 'react'],
  });
}
