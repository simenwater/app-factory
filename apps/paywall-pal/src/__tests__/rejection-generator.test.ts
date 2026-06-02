/**
 * @fileoverview 拒绝消息生成器单元测试
 */

import { generateRejection, getToneOptions } from "@/lib/rejection-generator";
import { RejectionConfig } from "@/types";

describe("generateRejection", () => {
  it("should generate a message with friendly tone", () => {
    const config: RejectionConfig = {
      tone: "friendly",
      includeQuote: true,
    };
    const result = generateRejection(config);
    expect(result.subject).toBeTruthy();
    expect(result.body).toBeTruthy();
    expect(result.tone).toBe("friendly");
  });

  it("should generate a message with professional tone", () => {
    const config: RejectionConfig = {
      tone: "professional",
      includeQuote: false,
    };
    const result = generateRejection(config);
    expect(result.subject).toBeTruthy();
    expect(result.body).toBeTruthy();
    expect(result.tone).toBe("professional");
  });

  it("should generate a message with firm tone", () => {
    const config: RejectionConfig = {
      tone: "firm",
      includeQuote: true,
    };
    const result = generateRejection(config);
    expect(result.tone).toBe("firm");
    expect(result.body.length).toBeGreaterThan(50);
  });

  it("should include rate information when includeQuote is true", () => {
    const config: RejectionConfig = {
      tone: "professional",
      includeQuote: true,
    };
    const result = generateRejection(config);
    expect(result.body).toContain("$");
  });

  it("should not include detailed rates when includeQuote is false", () => {
    const config: RejectionConfig = {
      tone: "professional",
      includeQuote: false,
    };
    const result = generateRejection(config);
    expect(result.body).not.toContain("$75-150/hr");
  });

  it("should use custom signature when provided", () => {
    const config: RejectionConfig = {
      tone: "friendly",
      includeQuote: false,
      signature: "John Doe, Developer",
    };
    const result = generateRejection(config);
    expect(result.body).toContain("John Doe, Developer");
  });

  it("should use default signature when not provided", () => {
    const config: RejectionConfig = {
      tone: "friendly",
      includeQuote: false,
    };
    const result = generateRejection(config);
    expect(result.body).toContain("[Your Name]");
  });
});

describe("getToneOptions", () => {
  it("should return 3 tone options", () => {
    const options = getToneOptions();
    expect(options).toHaveLength(3);
  });

  it("should include friendly, professional, and firm", () => {
    const options = getToneOptions();
    const values = options.map((o) => o.value);
    expect(values).toContain("friendly");
    expect(values).toContain("professional");
    expect(values).toContain("firm");
  });

  it("should have labels and descriptions for all options", () => {
    const options = getToneOptions();
    for (const option of options) {
      expect(option.label).toBeTruthy();
      expect(option.description).toBeTruthy();
    }
  });
});
