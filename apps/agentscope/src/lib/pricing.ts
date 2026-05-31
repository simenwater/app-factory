/**
 * @fileoverview AI 模型定价配置与成本计算
 */

import type { ModelPricing, Provider } from "@/types";

/**
 * @description 各模型每百万 Token 的定价（美元）
 */
export const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4o": { inputPerMillion: 2.5, outputPerMillion: 10 },
  "gpt-4o-mini": { inputPerMillion: 0.15, outputPerMillion: 0.6 },
  "gpt-4-turbo": { inputPerMillion: 10, outputPerMillion: 30 },
  "gpt-4": { inputPerMillion: 30, outputPerMillion: 60 },
  "gpt-3.5-turbo": { inputPerMillion: 0.5, outputPerMillion: 1.5 },
  "o1": { inputPerMillion: 15, outputPerMillion: 60 },
  "o1-mini": { inputPerMillion: 3, outputPerMillion: 12 },
  "o3-mini": { inputPerMillion: 1.1, outputPerMillion: 4.4 },
  "claude-4-opus": { inputPerMillion: 15, outputPerMillion: 75 },
  "claude-4-sonnet": { inputPerMillion: 3, outputPerMillion: 15 },
  "claude-3.5-sonnet": { inputPerMillion: 3, outputPerMillion: 15 },
  "claude-3.5-haiku": { inputPerMillion: 0.8, outputPerMillion: 4 },
  "claude-3-opus": { inputPerMillion: 15, outputPerMillion: 75 },
  "claude-3-sonnet": { inputPerMillion: 3, outputPerMillion: 15 },
  "claude-3-haiku": { inputPerMillion: 0.25, outputPerMillion: 1.25 },
  "gemini-2.0-flash": { inputPerMillion: 0.1, outputPerMillion: 0.4 },
  "gemini-1.5-pro": { inputPerMillion: 1.25, outputPerMillion: 5 },
  "gemini-1.5-flash": { inputPerMillion: 0.075, outputPerMillion: 0.3 },
};

/** 未知模型的默认定价 */
const DEFAULT_PRICING: ModelPricing = {
  inputPerMillion: 1,
  outputPerMillion: 3,
};

/**
 * @description 根据模型名称获取定价
 * @param model - 模型名称
 * @returns 定价信息
 */
export function getModelPricing(model: string): ModelPricing {
  const normalizedModel = model.toLowerCase();
  for (const [key, pricing] of Object.entries(MODEL_PRICING)) {
    if (normalizedModel.includes(key.toLowerCase())) {
      return pricing;
    }
  }
  return DEFAULT_PRICING;
}

/**
 * @description 计算单次请求的成本
 * @param model - 模型名称
 * @param inputTokens - 输入 Token 数
 * @param outputTokens - 输出 Token 数
 * @returns 估算成本（美元）
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = getModelPricing(model);
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillion;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

/**
 * @description 从请求 URL 推断提供商
 * @param url - 请求 URL
 * @returns Provider 类型
 */
export function detectProvider(url: string): Provider {
  if (url.includes("openai.com") || url.includes("api.openai")) return "openai";
  if (url.includes("anthropic.com") || url.includes("api.anthropic"))
    return "anthropic";
  if (url.includes("googleapis.com") || url.includes("generativelanguage"))
    return "google";
  return "custom";
}

/**
 * @description 从请求体中提取模型名称
 * @param body - 请求体
 * @returns 模型名称
 */
export function extractModelFromBody(body: unknown): string {
  if (body && typeof body === "object" && "model" in body) {
    return String((body as Record<string, unknown>).model);
  }
  return "unknown";
}

/**
 * @description 从响应体中提取 Token 使用量
 * @param body - 响应体
 * @returns Token 使用量
 */
export function extractTokenUsage(body: unknown): {
  inputTokens: number | null;
  outputTokens: number | null;
} {
  if (!body || typeof body !== "object") {
    return { inputTokens: null, outputTokens: null };
  }

  const obj = body as Record<string, unknown>;

  // OpenAI 格式
  if (obj.usage && typeof obj.usage === "object") {
    const usage = obj.usage as Record<string, unknown>;
    return {
      inputTokens:
        (usage.prompt_tokens as number) ??
        (usage.input_tokens as number) ??
        null,
      outputTokens:
        (usage.completion_tokens as number) ??
        (usage.output_tokens as number) ??
        null,
    };
  }

  // Anthropic 格式
  if (obj.usage && typeof obj.usage === "object") {
    const usage = obj.usage as Record<string, unknown>;
    return {
      inputTokens: (usage.input_tokens as number) ?? null,
      outputTokens: (usage.output_tokens as number) ?? null,
    };
  }

  return { inputTokens: null, outputTokens: null };
}
