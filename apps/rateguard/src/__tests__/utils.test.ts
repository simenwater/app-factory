/**
 * @fileoverview 工具函数单元测试
 */

import {
  generateId,
  formatCurrency,
  formatDate,
  categoryLabel,
  riskLevelInfo,
  responseTypeLabel,
  truncateText,
} from "@/lib/utils";

describe("generateId", () => {
  it("应返回非空字符串", () => {
    expect(generateId()).toBeTruthy();
  });

  it("每次生成不同 ID", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("formatCurrency", () => {
  it("默认格式化为 USD", () => {
    const result = formatCurrency(100);
    expect(result).toContain("100");
  });

  it("格式化 CNY", () => {
    const result = formatCurrency(5000, "CNY");
    expect(result).toContain("5,000");
  });

  it("格式化 EUR", () => {
    const result = formatCurrency(50, "EUR");
    expect(result).toBeTruthy();
  });

  it("处理 0 金额", () => {
    const result = formatCurrency(0);
    expect(result).toBeTruthy();
  });

  it("处理小数", () => {
    const result = formatCurrency(99.99);
    expect(result).toContain("99.99");
  });
});

describe("formatDate", () => {
  it("应格式化 ISO 日期字符串", () => {
    const result = formatDate("2025-01-15T10:30:00.000Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("categoryLabel", () => {
  it("应返回设计的中文标签", () => {
    expect(categoryLabel("design")).toBe("设计");
  });

  it("应返回开发的中文标签", () => {
    expect(categoryLabel("development")).toBe("开发");
  });

  it("所有类别都应有标签", () => {
    const categories = [
      "design",
      "development",
      "writing",
      "consulting",
      "marketing",
      "photography",
      "video",
      "translation",
      "other",
    ] as const;
    for (const cat of categories) {
      expect(categoryLabel(cat)).toBeTruthy();
    }
  });
});

describe("riskLevelInfo", () => {
  it("高风险返回红色相关信息", () => {
    const info = riskLevelInfo("high");
    expect(info.label).toBe("高风险");
    expect(info.color).toContain("red");
  });

  it("中风险返回橙色相关信息", () => {
    const info = riskLevelInfo("medium");
    expect(info.label).toBe("中风险");
    expect(info.color).toContain("amber");
  });

  it("低风险返回绿色相关信息", () => {
    const info = riskLevelInfo("low");
    expect(info.label).toBe("低风险");
    expect(info.color).toContain("green");
  });
});

describe("responseTypeLabel", () => {
  it("应返回正确的中文标签", () => {
    expect(responseTypeLabel("reject")).toBe("礼貌拒绝");
    expect(responseTypeLabel("negotiate")).toBe("协商报价");
    expect(responseTypeLabel("accept")).toBe("可以接受");
  });
});

describe("truncateText", () => {
  it("短文本不截断", () => {
    expect(truncateText("hello", 100)).toBe("hello");
  });

  it("长文本应截断并加省略号", () => {
    const long = "a".repeat(200);
    const result = truncateText(long, 100);
    expect(result.length).toBe(103); // 100 + "..."
    expect(result.endsWith("...")).toBe(true);
  });

  it("边界长度不截断", () => {
    const exact = "a".repeat(100);
    expect(truncateText(exact, 100)).toBe(exact);
  });

  it("默认截断长度为 100", () => {
    const long = "a".repeat(200);
    const result = truncateText(long);
    expect(result.length).toBe(103);
  });
});
