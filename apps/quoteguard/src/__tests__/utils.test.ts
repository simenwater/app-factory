import {
  generateId,
  formatCurrency,
  formatDate,
  calculateTotal,
  getServiceLabel,
  getScenarioLabel,
  getToneLabel,
  getChecklistCategoryLabel,
  getChecklistProgress,
  getQuoteStatus,
} from "@/lib/utils";

describe("generateId", () => {
  it("should generate a non-empty string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("should generate unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    const result = formatCurrency(1500, "USD");
    expect(result).toContain("1,500");
    expect(result).toContain("$");
  });

  it("should format CNY correctly", () => {
    const result = formatCurrency(1500, "CNY");
    expect(result).toContain("1,500");
  });

  it("should default to USD", () => {
    const result = formatCurrency(100);
    expect(result).toContain("$");
  });
});

describe("formatDate", () => {
  it("should format ISO date string", () => {
    const result = formatDate("2025-06-15T00:00:00.000Z");
    expect(result).toContain("2025");
  });
});

describe("calculateTotal", () => {
  it("should sum items correctly", () => {
    expect(
      calculateTotal([
        { quantity: 2, unitPrice: 50 },
        { quantity: 3, unitPrice: 100 },
      ])
    ).toBe(400);
  });

  it("should return 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });
});

describe("getServiceLabel", () => {
  it("should return Chinese label for known categories", () => {
    expect(getServiceLabel("design")).toBe("设计");
    expect(getServiceLabel("development")).toBe("开发");
    expect(getServiceLabel("consulting")).toBe("咨询");
  });

  it("should return key for unknown categories", () => {
    expect(getServiceLabel("unknown")).toBe("unknown");
  });
});

describe("getScenarioLabel", () => {
  it("should return Chinese label for scenarios", () => {
    expect(getScenarioLabel("free_work")).toBe("免费工作请求");
    expect(getScenarioLabel("scope_creep")).toBe("范围蔓延");
  });
});

describe("getToneLabel", () => {
  it("should return Chinese label for tones", () => {
    expect(getToneLabel("professional")).toBe("专业");
    expect(getToneLabel("friendly")).toBe("友好");
  });
});

describe("getChecklistCategoryLabel", () => {
  it("should return Chinese label for categories", () => {
    expect(getChecklistCategoryLabel("scope")).toBe("项目范围");
    expect(getChecklistCategoryLabel("payment")).toBe("付款条件");
  });
});

describe("getChecklistProgress", () => {
  it("should calculate progress correctly", () => {
    expect(
      getChecklistProgress([
        { checked: true },
        { checked: true },
        { checked: false },
        { checked: false },
      ])
    ).toBe(50);
  });

  it("should return 0 for empty array", () => {
    expect(getChecklistProgress([])).toBe(0);
  });

  it("should return 100 when all checked", () => {
    expect(
      getChecklistProgress([{ checked: true }, { checked: true }])
    ).toBe(100);
  });
});

describe("getQuoteStatus", () => {
  it("should return correct label and color for each status", () => {
    expect(getQuoteStatus("draft").label).toBe("草稿");
    expect(getQuoteStatus("sent").label).toBe("已发送");
    expect(getQuoteStatus("accepted").label).toBe("已接受");
    expect(getQuoteStatus("declined").label).toBe("已拒绝");
  });

  it("should handle unknown status", () => {
    const result = getQuoteStatus("unknown");
    expect(result.label).toBe("unknown");
  });
});
