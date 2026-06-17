/**
 * @fileoverview 订阅系统单元测试
 */

import {
  canAnalyze,
  getRemainingAnalyses,
  createDefaultSubscription,
} from "@/lib/subscription";
import { SubscriptionStatus } from "@/types";

describe("Subscription System", () => {
  describe("createDefaultSubscription", () => {
    it("should create a free plan with 3 max analyses", () => {
      const sub = createDefaultSubscription();

      expect(sub.plan).toBe("free");
      expect(sub.analysisCount).toBe(0);
      expect(sub.maxAnalysis).toBe(3);
      expect(sub.expiresAt).toBeNull();
    });
  });

  describe("canAnalyze", () => {
    it("should allow analysis for free users within limit", () => {
      const sub: SubscriptionStatus = {
        plan: "free",
        analysisCount: 2,
        maxAnalysis: 3,
        expiresAt: null,
      };

      expect(canAnalyze(sub)).toBe(true);
    });

    it("should block analysis for free users at limit", () => {
      const sub: SubscriptionStatus = {
        plan: "free",
        analysisCount: 3,
        maxAnalysis: 3,
        expiresAt: null,
      };

      expect(canAnalyze(sub)).toBe(false);
    });

    it("should always allow analysis for pro users", () => {
      const sub: SubscriptionStatus = {
        plan: "pro",
        analysisCount: 100,
        maxAnalysis: 999,
        expiresAt: Date.now() + 86400000,
      };

      expect(canAnalyze(sub)).toBe(true);
    });
  });

  describe("getRemainingAnalyses", () => {
    it("should return correct remaining for free users", () => {
      const sub: SubscriptionStatus = {
        plan: "free",
        analysisCount: 1,
        maxAnalysis: 3,
        expiresAt: null,
      };

      expect(getRemainingAnalyses(sub)).toBe(2);
    });

    it("should return Infinity for pro users", () => {
      const sub: SubscriptionStatus = {
        plan: "pro",
        analysisCount: 50,
        maxAnalysis: 999,
        expiresAt: Date.now() + 86400000,
      };

      expect(getRemainingAnalyses(sub)).toBe(Infinity);
    });

    it("should not return negative values", () => {
      const sub: SubscriptionStatus = {
        plan: "free",
        analysisCount: 5,
        maxAnalysis: 3,
        expiresAt: null,
      };

      expect(getRemainingAnalyses(sub)).toBe(0);
    });
  });
});
