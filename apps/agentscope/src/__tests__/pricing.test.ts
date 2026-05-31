/**
 * @fileoverview 定价与成本计算模块测试
 */

import {
  getModelPricing,
  calculateCost,
  detectProvider,
  extractModelFromBody,
  extractTokenUsage,
} from "../lib/pricing";

describe("getModelPricing", () => {
  it("should return correct pricing for known models", () => {
    const pricing = getModelPricing("gpt-4o");
    expect(pricing.inputPerMillion).toBe(2.5);
    expect(pricing.outputPerMillion).toBe(10);
  });

  it("should match partial model names", () => {
    const pricing = getModelPricing("claude-3.5-sonnet-20241022");
    expect(pricing.inputPerMillion).toBe(3);
    expect(pricing.outputPerMillion).toBe(15);
  });

  it("should return default pricing for unknown models", () => {
    const pricing = getModelPricing("some-unknown-model");
    expect(pricing.inputPerMillion).toBe(1);
    expect(pricing.outputPerMillion).toBe(3);
  });
});

describe("calculateCost", () => {
  it("should calculate cost correctly for gpt-4o", () => {
    const cost = calculateCost("gpt-4o", 1000, 500);
    // input: 1000/1M * 2.5 = 0.0025
    // output: 500/1M * 10 = 0.005
    // total = 0.0075
    expect(cost).toBeCloseTo(0.0075, 6);
  });

  it("should return 0 for zero tokens", () => {
    expect(calculateCost("gpt-4o", 0, 0)).toBe(0);
  });

  it("should handle large token counts", () => {
    const cost = calculateCost("gpt-4o", 1_000_000, 1_000_000);
    // input: 1M/1M * 2.5 = 2.5
    // output: 1M/1M * 10 = 10
    expect(cost).toBeCloseTo(12.5, 2);
  });
});

describe("detectProvider", () => {
  it("should detect OpenAI", () => {
    expect(detectProvider("https://api.openai.com/v1/chat/completions")).toBe(
      "openai"
    );
  });

  it("should detect Anthropic", () => {
    expect(detectProvider("https://api.anthropic.com/v1/messages")).toBe(
      "anthropic"
    );
  });

  it("should detect Google", () => {
    expect(
      detectProvider(
        "https://generativelanguage.googleapis.com/v1/models/generate"
      )
    ).toBe("google");
  });

  it("should default to custom", () => {
    expect(detectProvider("https://my-custom-api.com/chat")).toBe("custom");
  });
});

describe("extractModelFromBody", () => {
  it("should extract model from request body", () => {
    expect(
      extractModelFromBody({ model: "gpt-4o", messages: [] })
    ).toBe("gpt-4o");
  });

  it("should return unknown for missing model", () => {
    expect(extractModelFromBody({ messages: [] })).toBe("unknown");
  });

  it("should return unknown for null body", () => {
    expect(extractModelFromBody(null)).toBe("unknown");
  });
});

describe("extractTokenUsage", () => {
  it("should extract OpenAI format usage", () => {
    const result = extractTokenUsage({
      usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    });
    expect(result.inputTokens).toBe(100);
    expect(result.outputTokens).toBe(50);
  });

  it("should extract Anthropic format usage", () => {
    const result = extractTokenUsage({
      usage: { input_tokens: 200, output_tokens: 100 },
    });
    expect(result.inputTokens).toBe(200);
    expect(result.outputTokens).toBe(100);
  });

  it("should return null for missing usage", () => {
    const result = extractTokenUsage({ id: "test" });
    expect(result.inputTokens).toBeNull();
    expect(result.outputTokens).toBeNull();
  });

  it("should return null for null body", () => {
    const result = extractTokenUsage(null);
    expect(result.inputTokens).toBeNull();
    expect(result.outputTokens).toBeNull();
  });
});
