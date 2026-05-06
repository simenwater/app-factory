/**
 * @fileoverview 订阅模块单元测试
 */

import {
  canCreateInvoice,
  getRemainingInvoices,
  isFeatureAvailable,
  FREE_MONTHLY_LIMIT,
} from "@/lib/subscription";
import type { UserSubscription } from "@/types";

describe("canCreateInvoice", () => {
  it("should allow pro users unlimited invoices", () => {
    const sub: UserSubscription = {
      plan: "pro",
      invoicesUsedThisMonth: 100,
      freeMonthlyLimit: 3,
    };
    const result = canCreateInvoice(sub);
    expect(result.allowed).toBe(true);
  });

  it("should allow free users under limit", () => {
    const sub: UserSubscription = {
      plan: "free",
      invoicesUsedThisMonth: 2,
      freeMonthlyLimit: FREE_MONTHLY_LIMIT,
    };
    const result = canCreateInvoice(sub);
    expect(result.allowed).toBe(true);
  });

  it("should block free users at limit", () => {
    const sub: UserSubscription = {
      plan: "free",
      invoicesUsedThisMonth: 3,
      freeMonthlyLimit: FREE_MONTHLY_LIMIT,
    };
    const result = canCreateInvoice(sub);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it("should block free users over limit", () => {
    const sub: UserSubscription = {
      plan: "free",
      invoicesUsedThisMonth: 5,
      freeMonthlyLimit: FREE_MONTHLY_LIMIT,
    };
    const result = canCreateInvoice(sub);
    expect(result.allowed).toBe(false);
  });
});

describe("getRemainingInvoices", () => {
  it("should return null for pro users", () => {
    const sub: UserSubscription = {
      plan: "pro",
      invoicesUsedThisMonth: 50,
      freeMonthlyLimit: 3,
    };
    expect(getRemainingInvoices(sub)).toBeNull();
  });

  it("should return correct remaining count for free users", () => {
    const sub: UserSubscription = {
      plan: "free",
      invoicesUsedThisMonth: 1,
      freeMonthlyLimit: 3,
    };
    expect(getRemainingInvoices(sub)).toBe(2);
  });

  it("should return 0 when at limit", () => {
    const sub: UserSubscription = {
      plan: "free",
      invoicesUsedThisMonth: 3,
      freeMonthlyLimit: 3,
    };
    expect(getRemainingInvoices(sub)).toBe(0);
  });

  it("should not return negative numbers", () => {
    const sub: UserSubscription = {
      plan: "free",
      invoicesUsedThisMonth: 10,
      freeMonthlyLimit: 3,
    };
    expect(getRemainingInvoices(sub)).toBe(0);
  });
});

describe("isFeatureAvailable", () => {
  it("should allow all features for pro plan", () => {
    expect(isFeatureAvailable("pro", "auto_reminder")).toBe(true);
    expect(isFeatureAvailable("pro", "export_report")).toBe(true);
    expect(isFeatureAvailable("pro", "custom_template")).toBe(true);
    expect(isFeatureAvailable("pro", "multi_currency")).toBe(true);
  });

  it("should restrict pro-only features for free plan", () => {
    expect(isFeatureAvailable("free", "auto_reminder")).toBe(false);
    expect(isFeatureAvailable("free", "export_report")).toBe(false);
    expect(isFeatureAvailable("free", "custom_template")).toBe(false);
    expect(isFeatureAvailable("free", "multi_currency")).toBe(false);
  });
});
