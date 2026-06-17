/**
 * @fileoverview 动态定价引擎单元测试
 */

import { generatePricingSuggestion } from "@/lib/pricing";
import { UserProfile, ClientIntentAnalysis } from "@/types";

describe("generatePricingSuggestion", () => {
  const baseProfile: UserProfile = {
    industry: "web-development",
    experienceLevel: "mid",
    yearsOfExperience: 3,
    currency: "USD",
    minimumHourlyRate: 50,
  };

  const lowRiskAnalysis: ClientIntentAnalysis = {
    detectedBudget: { min: 5000, max: 10000, currency: "USD" },
    complexityScore: 5,
    riskLevel: "low",
    redFlags: [],
    greenFlags: ["明确预算数字"],
    summary: "客户看起来较为正规",
  };

  const highRiskAnalysis: ClientIntentAnalysis = {
    detectedBudget: { min: 200, max: null, currency: "USD" },
    complexityScore: 7,
    riskLevel: "high",
    redFlags: ["暗示项目简单以压低价格", "画饼承诺未来工作"],
    greenFlags: [],
    summary: "风险较高",
  };

  it("should generate pricing above minimum rate", () => {
    const result = generatePricingSuggestion(baseProfile, lowRiskAnalysis);

    expect(result.minRate).toBeGreaterThanOrEqual(baseProfile.minimumHourlyRate);
    expect(result.recommendedRate).toBeGreaterThanOrEqual(result.minRate);
    expect(result.maxRate).toBeGreaterThanOrEqual(result.recommendedRate);
  });

  it("should apply risk premium for high-risk clients", () => {
    const lowRiskPricing = generatePricingSuggestion(baseProfile, lowRiskAnalysis);
    const highRiskPricing = generatePricingSuggestion(baseProfile, highRiskAnalysis);

    expect(highRiskPricing.recommendedRate).toBeGreaterThan(
      lowRiskPricing.recommendedRate
    );
  });

  it("should adjust pricing based on experience level", () => {
    const juniorProfile: UserProfile = { ...baseProfile, experienceLevel: "junior", yearsOfExperience: 1 };
    const expertProfile: UserProfile = { ...baseProfile, experienceLevel: "expert", yearsOfExperience: 12 };

    const juniorPricing = generatePricingSuggestion(juniorProfile, lowRiskAnalysis);
    const expertPricing = generatePricingSuggestion(expertProfile, lowRiskAnalysis);

    expect(expertPricing.recommendedRate).toBeGreaterThan(
      juniorPricing.recommendedRate
    );
  });

  it("should adjust pricing based on complexity", () => {
    const simpleAnalysis: ClientIntentAnalysis = { ...lowRiskAnalysis, complexityScore: 2 };
    const complexAnalysis: ClientIntentAnalysis = { ...lowRiskAnalysis, complexityScore: 9 };

    const simplePricing = generatePricingSuggestion(baseProfile, simpleAnalysis);
    const complexPricing = generatePricingSuggestion(baseProfile, complexAnalysis);

    expect(complexPricing.recommendedRate).toBeGreaterThan(
      simplePricing.recommendedRate
    );
  });

  it("should include reasoning explanation", () => {
    const result = generatePricingSuggestion(baseProfile, lowRiskAnalysis);

    expect(result.reasoning).toContain("web-development");
    expect(result.reasoning.length).toBeGreaterThan(20);
  });

  it("should respect minimum hourly rate", () => {
    const highMinProfile: UserProfile = { ...baseProfile, minimumHourlyRate: 200 };
    const result = generatePricingSuggestion(highMinProfile, lowRiskAnalysis);

    expect(result.minRate).toBeGreaterThanOrEqual(200);
  });
});
