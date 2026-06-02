/**
 * @fileoverview 消息分析引擎单元测试
 */

import { analyzeMessage } from "@/lib/analyzer";

describe("analyzeMessage", () => {
  it("should return no indicators for empty message", () => {
    const result = analyzeMessage("");
    expect(result.isFreeWorkRequest).toBe(false);
    expect(result.confidence).toBe(0);
    expect(result.indicators).toHaveLength(0);
  });

  it("should detect obvious free work requests", () => {
    const message =
      "Hey can you do this for free? I don't have any budget but it'll be great exposure for your portfolio!";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.indicators.length).toBeGreaterThan(2);
  });

  it("should detect 'no budget' requests", () => {
    const message = "We have no budget for this project right now but can pay you later.";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(true);
    expect(result.indicators).toContain("No budget available");
  });

  it("should detect exposure-based requests", () => {
    const message =
      "This would be amazing for your portfolio and give you great visibility! Can you do it for free?";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(true);
    expect(result.indicators).toContain("Offers exposure instead of payment");
  });

  it("should detect minimizing scope combined with other signals", () => {
    const message =
      "It's just a small quick task, won't take long. I can't afford to pay much for this.";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(true);
  });

  it("should NOT flag legitimate paid inquiries", () => {
    const message =
      "Hi, I'd like to hire you for a website redesign. Our budget is $5,000. Can you send a quote?";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(false);
  });

  it("should detect Chinese free work keywords", () => {
    const message = "你好，能帮个忙吗？我们目前没有预算，但以后可以给你曝光。";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.3);
  });

  it("should detect equity/revenue share offers", () => {
    const message =
      "We're a startup and can offer you equity and revenue sharing instead of upfront payment.";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(true);
    expect(result.indicators).toContain("Offers equity/revenue share instead");
  });

  it("should handle vague future payment promises", () => {
    const message = "I'll pay you later once the project makes money, I promise.";
    const result = analyzeMessage(message);
    expect(result.isFreeWorkRequest).toBe(true);
    expect(result.indicators).toContain("Vague future payment promise");
  });

  it("should return confidence between 0 and 1", () => {
    const messages = [
      "Do this for free please",
      "Normal inquiry about your services",
      "Quick favor, won't take long, no budget, great for portfolio, exposure!",
    ];
    for (const msg of messages) {
      const result = analyzeMessage(msg);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    }
  });
});
