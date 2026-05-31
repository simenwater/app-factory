/**
 * @fileoverview 格式化工具函数测试
 */

import {
  formatNumber,
  formatTokens,
  formatCost,
  formatDuration,
  truncate,
  getProviderLabel,
  getStatusLabel,
} from "../lib/format";

describe("formatNumber", () => {
  it("should format with thousand separators", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("should handle small numbers", () => {
    expect(formatNumber(42)).toBe("42");
  });
});

describe("formatTokens", () => {
  it("should format millions", () => {
    expect(formatTokens(1500000)).toBe("1.5M");
  });

  it("should format thousands", () => {
    expect(formatTokens(2500)).toBe("2.5K");
  });

  it("should keep small numbers as-is", () => {
    expect(formatTokens(500)).toBe("500");
  });
});

describe("formatCost", () => {
  it("should format large costs with 2 decimals", () => {
    expect(formatCost(10.5)).toBe("$10.50");
  });

  it("should format medium costs with 4 decimals", () => {
    expect(formatCost(0.15)).toBe("$0.1500");
  });

  it("should format tiny costs with 6 decimals", () => {
    expect(formatCost(0.000123)).toBe("$0.000123");
  });
});

describe("formatDuration", () => {
  it("should format milliseconds", () => {
    expect(formatDuration(500)).toBe("500ms");
  });

  it("should format seconds", () => {
    expect(formatDuration(2500)).toBe("2.5s");
  });

  it("should format minutes", () => {
    expect(formatDuration(90000)).toBe("1.5min");
  });
});

describe("truncate", () => {
  it("should not truncate short strings", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("should truncate long strings", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });
});

describe("getProviderLabel", () => {
  it("should return human-readable labels", () => {
    expect(getProviderLabel("openai")).toBe("OpenAI");
    expect(getProviderLabel("anthropic")).toBe("Anthropic");
    expect(getProviderLabel("google")).toBe("Google");
  });

  it("should fallback to raw value", () => {
    expect(getProviderLabel("unknown")).toBe("unknown");
  });
});

describe("getStatusLabel", () => {
  it("should return Chinese labels", () => {
    expect(getStatusLabel("completed")).toBe("完成");
    expect(getStatusLabel("pending")).toBe("进行中");
    expect(getStatusLabel("error")).toBe("错误");
  });
});
