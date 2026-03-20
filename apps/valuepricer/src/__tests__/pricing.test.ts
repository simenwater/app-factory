import {
  calculateMonthlyValue,
  recommendPricingModel,
  generatePricingTiers,
  generatePricingRecommendation,
  INDUSTRY_CONFIG,
} from "@/lib/pricing";
import type { ValueInput } from "@/types";

/**
 * @description 创建测试用的 ValueInput 数据
 */
function createTestInput(overrides?: Partial<ValueInput>): ValueInput {
  return {
    id: "test-1",
    createdAt: new Date().toISOString(),
    productName: "TestProduct",
    industry: "saas",
    targetCustomerSize: "smb",
    engineerCount: 5,
    avgHourlyCost: 75,
    hoursSavedPerWeek: 10,
    additionalCostSavingsMonthly: 500,
    currentProcessDescription: "Manual process",
    competitorPrice: 199,
    ...overrides,
  };
}

describe("calculateMonthlyValue", () => {
  it("should calculate monthly value from time savings + additional savings", () => {
    const input = createTestInput();
    const value = calculateMonthlyValue(input);
    // 5 engineers * 10 hours * $75 = $3,750/week * 4.33 = $16,237.5 + $500 = $16,737.5
    expect(value).toBeCloseTo(16737.5, 0);
  });

  it("should return only additional savings when hours are zero", () => {
    const input = createTestInput({ hoursSavedPerWeek: 0 });
    const value = calculateMonthlyValue(input);
    expect(value).toBe(500);
  });

  it("should return 0 when all values are zero", () => {
    const input = createTestInput({
      engineerCount: 0,
      hoursSavedPerWeek: 0,
      additionalCostSavingsMonthly: 0,
    });
    const value = calculateMonthlyValue(input);
    expect(value).toBe(0);
  });

  it("should scale linearly with engineer count", () => {
    const input1 = createTestInput({ engineerCount: 5, additionalCostSavingsMonthly: 0 });
    const input2 = createTestInput({ engineerCount: 10, additionalCostSavingsMonthly: 0 });
    const value1 = calculateMonthlyValue(input1);
    const value2 = calculateMonthlyValue(input2);
    expect(value2).toBeCloseTo(value1 * 2, 0);
  });
});

describe("recommendPricingModel", () => {
  it("should recommend per_seat for enterprise with many engineers", () => {
    const input = createTestInput({
      targetCustomerSize: "enterprise",
      engineerCount: 50,
    });
    const result = recommendPricingModel(input);
    expect(result.model).toBe("per_seat");
  });

  it("should recommend usage_based for devtools targeting startups", () => {
    const input = createTestInput({
      industry: "devtools",
      targetCustomerSize: "startup",
    });
    const result = recommendPricingModel(input);
    expect(result.model).toBe("usage_based");
  });

  it("should recommend tiered for SaaS targeting SMBs", () => {
    const input = createTestInput({
      industry: "saas",
      targetCustomerSize: "smb",
    });
    const result = recommendPricingModel(input);
    expect(result.model).toBe("tiered");
  });

  it("should recommend flat_rate for startups in non-tech industries", () => {
    const input = createTestInput({
      industry: "ecommerce",
      targetCustomerSize: "startup",
      engineerCount: 3,
    });
    const result = recommendPricingModel(input);
    expect(result.model).toBe("flat_rate");
  });

  it("should recommend value_based for mid-market fintech", () => {
    const input = createTestInput({
      industry: "fintech",
      targetCustomerSize: "mid_market",
      engineerCount: 15,
    });
    const result = recommendPricingModel(input);
    expect(result.model).toBe("value_based");
  });

  it("should always return a reasoning string", () => {
    const input = createTestInput();
    const result = recommendPricingModel(input);
    expect(result.reasoning).toBeTruthy();
    expect(typeof result.reasoning).toBe("string");
  });
});

describe("generatePricingTiers", () => {
  it("should return exactly 3 tiers", () => {
    const input = createTestInput();
    const monthlyValue = calculateMonthlyValue(input);
    const tiers = generatePricingTiers(monthlyValue, input);
    expect(tiers).toHaveLength(3);
  });

  it("should have ascending prices across tiers", () => {
    const input = createTestInput();
    const monthlyValue = calculateMonthlyValue(input);
    const tiers = generatePricingTiers(monthlyValue, input);
    expect(tiers[0].monthlyPrice).toBeLessThan(tiers[1].monthlyPrice);
    expect(tiers[1].monthlyPrice).toBeLessThan(tiers[2].monthlyPrice);
  });

  it("should have annual price lower than 12x monthly", () => {
    const input = createTestInput();
    const monthlyValue = calculateMonthlyValue(input);
    const tiers = generatePricingTiers(monthlyValue, input);
    tiers.forEach((tier) => {
      expect(tier.annualPrice).toBeLessThanOrEqual(tier.monthlyPrice * 12);
    });
  });

  it("should have valid value capture ratios", () => {
    const input = createTestInput();
    const monthlyValue = calculateMonthlyValue(input);
    const tiers = generatePricingTiers(monthlyValue, input);
    tiers.forEach((tier) => {
      expect(tier.valueCapture).toBeGreaterThan(0);
      expect(tier.valueCapture).toBeLessThan(1);
    });
  });

  it("each tier should have at least 3 features", () => {
    const input = createTestInput();
    const monthlyValue = calculateMonthlyValue(input);
    const tiers = generatePricingTiers(monthlyValue, input);
    tiers.forEach((tier) => {
      expect(tier.features.length).toBeGreaterThanOrEqual(3);
    });
  });
});

describe("generatePricingRecommendation", () => {
  it("should produce a complete recommendation", () => {
    const input = createTestInput();
    const rec = generatePricingRecommendation(input);
    expect(rec.id).toBeTruthy();
    expect(rec.inputId).toBe("test-1");
    expect(rec.productName).toBe("TestProduct");
    expect(rec.industry).toBe("saas");
    expect(rec.totalValueDelivered).toBeGreaterThan(0);
    expect(rec.recommendedModel).toBeTruthy();
    expect(rec.modelReasoning).toBeTruthy();
    expect(rec.tiers).toHaveLength(3);
    expect(rec.roi).toBeGreaterThan(0);
    expect(rec.keyInsights.length).toBeGreaterThan(0);
    expect(rec.competitorComparison).toBeTruthy();
  });

  it("should handle input without competitor price", () => {
    const input = createTestInput({ competitorPrice: 0 });
    const rec = generatePricingRecommendation(input);
    expect(rec.competitorComparison).toContain("未提供竞品价格信息");
  });

  it("should compute positive ROI for reasonable inputs", () => {
    const input = createTestInput();
    const rec = generatePricingRecommendation(input);
    expect(rec.roi).toBeGreaterThan(1);
  });
});

describe("INDUSTRY_CONFIG", () => {
  it("should have all required industries", () => {
    const expectedIndustries = [
      "saas", "fintech", "healthtech", "devtools",
      "martech", "hrtech", "cybersecurity", "ecommerce", "other",
    ];
    expectedIndustries.forEach((industry) => {
      expect(INDUSTRY_CONFIG[industry as keyof typeof INDUSTRY_CONFIG]).toBeDefined();
    });
  });

  it("should have valid benchmark ranges", () => {
    Object.values(INDUSTRY_CONFIG).forEach((config) => {
      expect(config.benchmarkRange[0]).toBeLessThan(config.benchmarkRange[1]);
      expect(config.avgMultiplier).toBeGreaterThan(0);
      expect(config.avgMultiplier).toBeLessThan(1);
    });
  });
});
