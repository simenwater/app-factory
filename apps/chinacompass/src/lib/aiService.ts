/**
 * @fileoverview AI服务集成 - 支持OpenAI兼容接口（文心/通义等）
 */

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

const SYSTEM_PROMPT = `你是ChinaCompass的AI合规顾问，专门为中国出海企业提供全球市场合规建议。

你的职责：
1. 用通俗易懂的中文解读各国政策法规
2. 分析政策对中国企业的具体影响
3. 提供可操作的合规建议
4. 评估出海风险并给出应对策略

回答要求：
- 使用中文回答
- 结构清晰，善用分点列举
- 区分事实和建议，标注信息来源
- 涉及法律问题时提醒用户咨询专业律师
- 提供具体、可执行的行动建议`;

/**
 * @description 调用AI生成政策解读
 * @param policyText - 政策原文
 * @param country - 国家
 */
export async function interpretPolicy(policyText: string, country: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackInterpretation(policyText, country);
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `请解读以下来自${country}的政策，分析其对中国出海企业的影响，并提供合规建议：\n\n${policyText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || "暂时无法生成解读，请稍后重试。";
  } catch {
    return generateFallbackInterpretation(policyText, country);
  }
}

/**
 * @description AI聊天对话
 * @param messages - 对话历史
 */
export async function chatWithAdvisor(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackChat(messages[messages.length - 1]?.content || "");
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || "抱歉，我暂时无法回答。请稍后重试。";
  } catch {
    return generateFallbackChat(messages[messages.length - 1]?.content || "");
  }
}

/**
 * @description 无API Key时的备用解读生成
 */
function generateFallbackInterpretation(policyText: string, country: string): string {
  return `## 政策解读（AI演示模式）

### 来源国家
${country}

### 政策概要
${policyText.slice(0, 200)}...

### 对中国企业的影响
1. **合规要求**：该政策可能对中国企业在${country}的业务运营产生直接影响，建议详细评估
2. **时间节点**：请关注政策生效日期和过渡期安排
3. **行业影响**：不同行业受影响程度各异，建议对照自身业务评估

### 建议行动
1. 聘请当地专业律师进行详细合规评估
2. 评估现有业务流程是否需要调整
3. 关注后续实施细则发布
4. 与行业协会保持沟通获取最新动态

> ⚠️ 以上为AI自动生成的初步分析，仅供参考。请配置API密钥以获取更详细的AI解读。`;
}

/**
 * @description 无API Key时的备用聊天回复
 */
function generateFallbackChat(userMessage: string): string {
  const keywords = ["税务", "税", "数据", "隐私", "GDPR", "劳工", "签证", "注册", "公司", "电商", "关税"];
  const matched = keywords.find((k) => userMessage.includes(k));

  if (matched) {
    return `感谢您的提问！关于"${matched}"相关的问题，这是ChinaCompass的演示回复：

**基本建议：**
1. 建议查阅我们的运营指南模块，获取详细的合规清单
2. 关注政策监控模块中相关国家的最新政策动态
3. 对于具体法律问题，建议咨询当地专业律师

**相关资源：**
- 查看「政策监控」了解最新政策变化
- 查看「运营指南」获取实操清单
- 查看「案例库」了解同行经验

> 💡 提示：配置AI API密钥后可获得更精准的个性化回答。`;
  }

  return `感谢您的提问！ChinaCompass AI顾问将为您提供出海合规方面的专业建议。

您可以询问：
- 🌍 特定国家的市场准入要求
- 📋 税务、数据保护、劳工等领域的合规要求
- ⚠️ 出海风险评估和应对策略
- 📖 本地化运营的最佳实践

> 💡 这是演示模式的回复。配置API密钥后可获得基于AI的深度分析。`;
}
