/**
 * @fileoverview 谈判话术模板生成器单元测试
 */

import { generateTemplates } from "@/lib/templates";
import { PricingSuggestion, ClientIntentAnalysis } from "@/types";

describe("generateTemplates", () => {
  const basePricing: PricingSuggestion = {
    minRate: 80,
    recommendedRate: 120,
    maxRate: 180,
    currency: "USD",
    unit: "hour",
    industryBenchmark: 100,
    reasoning: "基于行业标准",
  };

  const highRiskAnalysis: ClientIntentAnalysis = {
    detectedBudget: { min: 200, max: null, currency: "USD" },
    complexityScore: 6,
    riskLevel: "high",
    redFlags: ["暗示项目简单以压低价格", "画饼承诺未来工作"],
    greenFlags: [],
    summary: "风险较高",
  };

  const lowRiskAnalysis: ClientIntentAnalysis = {
    detectedBudget: { min: 5000, max: 10000, currency: "USD" },
    complexityScore: 5,
    riskLevel: "low",
    redFlags: [],
    greenFlags: ["明确预算数字", "重视质量"],
    summary: "正规客户",
  };

  it("should include reject template for high-risk clients", () => {
    const templates = generateTemplates(basePricing, highRiskAnalysis);
    const rejectTemplate = templates.find((t) => t.type === "reject");

    expect(rejectTemplate).toBeDefined();
    expect(rejectTemplate!.content).toContain("$80");
    expect(rejectTemplate!.content).toContain("$180");
  });

  it("should not include reject template for low-risk clients", () => {
    const templates = generateTemplates(basePricing, lowRiskAnalysis);
    const rejectTemplate = templates.find((t) => t.type === "reject");

    expect(rejectTemplate).toBeUndefined();
  });

  it("should always include negotiate template", () => {
    const highRiskTemplates = generateTemplates(basePricing, highRiskAnalysis);
    const lowRiskTemplates = generateTemplates(basePricing, lowRiskAnalysis);

    expect(highRiskTemplates.find((t) => t.type === "negotiate")).toBeDefined();
    expect(lowRiskTemplates.find((t) => t.type === "negotiate")).toBeDefined();
  });

  it("should always include conditional acceptance template", () => {
    const templates = generateTemplates(basePricing, lowRiskAnalysis);
    const conditional = templates.find((t) => t.type === "accept-with-conditions");

    expect(conditional).toBeDefined();
    expect(conditional!.content).toContain("$120");
  });

  it("should include pricing info in templates", () => {
    const templates = generateTemplates(basePricing, highRiskAnalysis);

    templates.forEach((template) => {
      expect(template.content.length).toBeGreaterThan(50);
      expect(template.title.length).toBeGreaterThan(0);
      expect(template.tone).toBeDefined();
    });
  });

  it("should include red flag warnings in conditional template for risky clients", () => {
    const templates = generateTemplates(basePricing, highRiskAnalysis);
    const conditional = templates.find((t) => t.type === "accept-with-conditions");

    expect(conditional!.content).toContain("暗示项目简单以压低价格");
  });
});
