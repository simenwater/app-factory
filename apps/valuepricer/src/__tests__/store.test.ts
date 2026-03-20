import { useStore } from "@/store/useStore";
import type { ValueInput, PricingRecommendation } from "@/types";

/**
 * @description 重置 Store 到初始状态
 */
function resetStore() {
  useStore.getState().resetStore();
}

/**
 * @description 创建测试用的 ValueInput
 */
function createMockInput(id: string = "input-1"): ValueInput {
  return {
    id,
    createdAt: new Date().toISOString(),
    productName: "Test Product",
    industry: "saas",
    targetCustomerSize: "smb",
    engineerCount: 5,
    avgHourlyCost: 75,
    hoursSavedPerWeek: 10,
    additionalCostSavingsMonthly: 500,
    currentProcessDescription: "Manual process",
    competitorPrice: 199,
  };
}

/**
 * @description 创建测试用的 PricingRecommendation
 */
function createMockRecommendation(
  id: string = "rec-1",
  inputId: string = "input-1"
): PricingRecommendation {
  return {
    id,
    inputId,
    createdAt: new Date().toISOString(),
    productName: "Test Product",
    industry: "saas",
    totalValueDelivered: 16737,
    recommendedModel: "tiered",
    modelReasoning: "Test reasoning",
    tiers: [
      {
        name: "Starter",
        monthlyPrice: 99,
        annualPrice: 990,
        features: ["Basic"],
        valueCapture: 0.006,
      },
      {
        name: "Pro",
        monthlyPrice: 199,
        annualPrice: 1990,
        features: ["Advanced"],
        valueCapture: 0.012,
      },
      {
        name: "Enterprise",
        monthlyPrice: 499,
        annualPrice: 4990,
        features: ["Full"],
        valueCapture: 0.03,
      },
    ],
    roi: 84,
    competitorComparison: "Competitive",
    keyInsights: ["Insight 1"],
  };
}

describe("useStore", () => {
  beforeEach(resetStore);

  describe("inputs", () => {
    it("should start with empty inputs", () => {
      expect(useStore.getState().inputs).toEqual([]);
    });

    it("should add an input", () => {
      const input = createMockInput();
      useStore.getState().addInput(input);
      expect(useStore.getState().inputs).toHaveLength(1);
      expect(useStore.getState().inputs[0].id).toBe("input-1");
    });

    it("should remove an input and its associated recommendations", () => {
      const input = createMockInput("input-1");
      const rec = createMockRecommendation("rec-1", "input-1");
      useStore.getState().addInput(input);
      useStore.getState().addRecommendation(rec);
      expect(useStore.getState().inputs).toHaveLength(1);
      expect(useStore.getState().recommendations).toHaveLength(1);

      useStore.getState().removeInput("input-1");
      expect(useStore.getState().inputs).toHaveLength(0);
      expect(useStore.getState().recommendations).toHaveLength(0);
    });
  });

  describe("recommendations", () => {
    it("should start with empty recommendations", () => {
      expect(useStore.getState().recommendations).toEqual([]);
    });

    it("should add a recommendation", () => {
      const rec = createMockRecommendation();
      useStore.getState().addRecommendation(rec);
      expect(useStore.getState().recommendations).toHaveLength(1);
    });

    it("should remove a recommendation", () => {
      const rec = createMockRecommendation();
      useStore.getState().addRecommendation(rec);
      useStore.getState().removeRecommendation("rec-1");
      expect(useStore.getState().recommendations).toHaveLength(0);
    });
  });

  describe("settings", () => {
    it("should have default settings", () => {
      const settings = useStore.getState().settings;
      expect(settings.darkMode).toBe(false);
      expect(settings.currency).toBe("USD");
      expect(settings.subscriptionTier).toBe("free");
    });

    it("should update settings partially", () => {
      useStore.getState().updateSettings({ darkMode: true });
      expect(useStore.getState().settings.darkMode).toBe(true);
      expect(useStore.getState().settings.currency).toBe("USD");
    });

    it("should update subscription tier", () => {
      useStore.getState().updateSettings({ subscriptionTier: "premium" });
      expect(useStore.getState().settings.subscriptionTier).toBe("premium");
    });
  });

  describe("resetStore", () => {
    it("should reset all data to defaults", () => {
      useStore.getState().addInput(createMockInput());
      useStore.getState().addRecommendation(createMockRecommendation());
      useStore.getState().updateSettings({ darkMode: true, subscriptionTier: "premium" });

      useStore.getState().resetStore();
      expect(useStore.getState().inputs).toEqual([]);
      expect(useStore.getState().recommendations).toEqual([]);
      expect(useStore.getState().settings.darkMode).toBe(false);
      expect(useStore.getState().settings.subscriptionTier).toBe("free");
    });
  });
});
