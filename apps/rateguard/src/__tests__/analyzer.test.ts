/**
 * @fileoverview 客户消息分析引擎单元测试
 */

import { analyzeClientMessage } from "@/lib/analyzer";

describe("analyzeClientMessage", () => {
  it("should detect red flags in lowball messages", () => {
    const message =
      "Hi, I have a quick project for you. It's just a simple website, shouldn't take long. My budget is around $200. I have many more projects coming after this one.";

    const result = analyzeClientMessage(message);

    expect(result.riskLevel).toMatch(/high|critical/);
    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.detectedBudget.min).toBe(200);
  });

  it("should detect green flags in professional messages", () => {
    const message =
      "We need a professional e-commerce website with a budget of $15,000-$20,000. We are looking for quality work and have a flexible timeline. A contract will be provided.";

    const result = analyzeClientMessage(message);

    expect(result.riskLevel).toBe("low");
    expect(result.greenFlags.length).toBeGreaterThan(0);
    expect(result.detectedBudget.min).toBe(15000);
    expect(result.detectedBudget.max).toBe(20000);
  });

  it("should handle mixed signals", () => {
    const message =
      "We have a budget of $5,000 for a professional website. It should be a simple landing page but we want quality work.";

    const result = analyzeClientMessage(message);

    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.greenFlags.length).toBeGreaterThan(0);
    expect(result.detectedBudget.min).toBe(5000);
  });

  it("should handle Chinese messages", () => {
    const message =
      "你好，我这边有个简单的项目，预算有限，大概 5000 元左右。后续还有很多项目可以合作。";

    const result = analyzeClientMessage(message);

    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.detectedBudget.currency).toBe("CNY");
  });

  it("should assess complexity correctly", () => {
    const simpleMessage = "I need a simple static landing page.";
    const complexMessage =
      "We need a real-time e-commerce platform with payment integration, user authentication, database management, and machine learning recommendations.";

    const simpleResult = analyzeClientMessage(simpleMessage);
    const complexResult = analyzeClientMessage(complexMessage);

    expect(complexResult.complexityScore).toBeGreaterThan(
      simpleResult.complexityScore
    );
  });

  it("should return low risk for messages without red flags", () => {
    const message =
      "We are a company looking for a developer. Our budget is $50,000 and we have a contract ready.";

    const result = analyzeClientMessage(message);

    expect(result.riskLevel).toBe("low");
    expect(result.redFlags.length).toBe(0);
  });
});
