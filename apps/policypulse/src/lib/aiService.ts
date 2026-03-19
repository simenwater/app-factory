import OpenAI from "openai";

/**
 * @interface AIInterpretationResult
 * AI解读返回结果
 */
export interface AIInterpretationResult {
  interpretation: string;
  summary: string;
}

/**
 * 创建OpenAI客户端实例
 * @returns {OpenAI | null} OpenAI客户端，未配置API key时返回null
 */
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
}

/**
 * 通过AI模型对政策进行实时解读
 * @param {string} title - 政策标题
 * @param {string} originalText - 政策原文
 * @param {string} userIndustry - 用户关注的行业
 * @returns {Promise<AIInterpretationResult>} AI解读结果
 */
export async function interpretPolicy(
  title: string,
  originalText: string,
  userIndustry?: string
): Promise<AIInterpretationResult> {
  const client = getOpenAIClient();
  if (!client) {
    return generateFallbackInterpretation(title, originalText);
  }

  const industryContext = userIndustry
    ? `用户关注的行业是：${userIndustry}。请重点分析该政策对这个行业的影响。`
    : "请从小微企业主的角度分析影响。";

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `你是一位专业的政策分析师，专门为在美国经营的小微企业主解读政策变化。
你的解读风格应该：
1. 用通俗易懂的语言，避免官僚术语
2. 明确指出"这对我的生意意味着什么"
3. 给出具体可执行的应对建议
4. 标注时间窗口和紧迫程度

请使用中文回答，使用以下格式：
🔴/🟠/🟡/🟢 影响解读：

1. **直接影响**：...
2. **间接影响**：...
3. **时间窗口**：...
4. **应对建议**：
   - 建议1
   - 建议2
   - 建议3
   - 建议4`,
        },
        {
          role: "user",
          content: `请分析以下政策对小微企业的影响：

政策标题：${title}

政策原文：
${originalText}

${industryContext}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const interpretation = response.choices[0]?.message?.content || "";

    const summaryResponse = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "用一句中文（50字以内）概括这条政策的核心影响，面向小微企业主。",
        },
        {
          role: "user",
          content: `政策标题：${title}\n政策内容：${originalText}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    const summary = summaryResponse.choices[0]?.message?.content || "";

    return { interpretation, summary };
  } catch (error) {
    console.error("AI interpretation error:", error);
    return generateFallbackInterpretation(title, originalText);
  }
}

/**
 * 当AI服务不可用时生成基础解读
 * @param {string} title - 政策标题
 * @param {string} originalText - 政策原文
 * @returns {AIInterpretationResult} 基础解读结果
 */
function generateFallbackInterpretation(
  title: string,
  originalText: string
): AIInterpretationResult {
  const text = `${title} ${originalText}`.toLowerCase();

  let urgency = "🟡";
  if (
    text.includes("emergency") ||
    text.includes("immediate") ||
    text.includes("ban")
  ) {
    urgency = "🔴";
  } else if (
    text.includes("restriction") ||
    text.includes("penalty") ||
    text.includes("enforcement")
  ) {
    urgency = "🟠";
  } else if (text.includes("proposed") || text.includes("comment period")) {
    urgency = "🟡";
  } else {
    urgency = "🟢";
  }

  const interpretation = `${urgency} 影响解读：

1. **直接影响**：该政策可能影响相关行业的企业运营和合规要求
2. **间接影响**：上下游供应链和相关市场可能受到波及
3. **时间窗口**：请关注政策的具体生效日期和过渡期安排
4. **应对建议**：
   - 仔细阅读政策原文，了解具体的合规要求
   - 评估对自身业务的直接影响程度
   - 咨询专业法律或财务顾问获取针对性建议
   - 关注后续实施细则和行业指南的发布

⚠️ 注意：此为自动生成的基础解读。配置 OPENAI_API_KEY 环境变量后可获得AI深度分析。`;

  return {
    interpretation,
    summary: `${title} — 请关注该政策对企业的潜在影响`,
  };
}
