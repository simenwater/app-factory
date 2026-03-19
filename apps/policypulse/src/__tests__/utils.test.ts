import {
  riskLevelScore,
  sortByRisk,
  filterByIndustry,
  filterByRiskLevel,
  truncateText,
  searchAlerts,
  generateDailySummary,
} from "@/lib/utils";
import type { PolicyAlert } from "@/types";

/**
 * 用于测试的 mock 政策预警数据
 */
const createMockAlert = (overrides: Partial<PolicyAlert> = {}): PolicyAlert => ({
  id: "test-1",
  title: "测试政策",
  summary: "测试摘要",
  riskLevel: "medium",
  affectedIndustries: ["tech"],
  originalText: "Original text",
  aiInterpretation: "AI interpretation",
  source: "Test Source",
  sourceUrl: "https://example.com",
  publishedAt: "2026-03-19T08:00:00Z",
  region: "全球",
  tags: ["测试"],
  ...overrides,
});

describe("riskLevelScore", () => {
  it("should return correct scores for each risk level", () => {
    expect(riskLevelScore("critical")).toBe(4);
    expect(riskLevelScore("high")).toBe(3);
    expect(riskLevelScore("medium")).toBe(2);
    expect(riskLevelScore("low")).toBe(1);
  });
});

describe("sortByRisk", () => {
  it("should sort alerts by risk level in descending order", () => {
    const alerts = [
      createMockAlert({ id: "1", riskLevel: "low" }),
      createMockAlert({ id: "2", riskLevel: "critical" }),
      createMockAlert({ id: "3", riskLevel: "medium" }),
      createMockAlert({ id: "4", riskLevel: "high" }),
    ];

    const sorted = sortByRisk(alerts);
    expect(sorted[0].riskLevel).toBe("critical");
    expect(sorted[1].riskLevel).toBe("high");
    expect(sorted[2].riskLevel).toBe("medium");
    expect(sorted[3].riskLevel).toBe("low");
  });

  it("should not mutate the original array", () => {
    const alerts = [
      createMockAlert({ id: "1", riskLevel: "low" }),
      createMockAlert({ id: "2", riskLevel: "critical" }),
    ];
    const original = [...alerts];
    sortByRisk(alerts);
    expect(alerts).toEqual(original);
  });
});

describe("filterByIndustry", () => {
  const alerts = [
    createMockAlert({ id: "1", affectedIndustries: ["tech", "trade"] }),
    createMockAlert({ id: "2", affectedIndustries: ["finance"] }),
    createMockAlert({ id: "3", affectedIndustries: ["tech", "manufacturing"] }),
  ];

  it("should return all alerts when no industries specified", () => {
    expect(filterByIndustry(alerts, [])).toHaveLength(3);
  });

  it("should filter alerts by single industry", () => {
    const result = filterByIndustry(alerts, ["finance"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("should filter alerts by multiple industries (OR logic)", () => {
    const result = filterByIndustry(alerts, ["trade", "finance"]);
    expect(result).toHaveLength(2);
  });
});

describe("filterByRiskLevel", () => {
  const alerts = [
    createMockAlert({ id: "1", riskLevel: "critical" }),
    createMockAlert({ id: "2", riskLevel: "high" }),
    createMockAlert({ id: "3", riskLevel: "medium" }),
    createMockAlert({ id: "4", riskLevel: "low" }),
  ];

  it("should return all alerts when no levels specified", () => {
    expect(filterByRiskLevel(alerts, [])).toHaveLength(4);
  });

  it("should filter by single risk level", () => {
    const result = filterByRiskLevel(alerts, ["critical"]);
    expect(result).toHaveLength(1);
    expect(result[0].riskLevel).toBe("critical");
  });

  it("should filter by multiple risk levels", () => {
    const result = filterByRiskLevel(alerts, ["critical", "high"]);
    expect(result).toHaveLength(2);
  });
});

describe("truncateText", () => {
  it("should return the original text if shorter than maxLength", () => {
    expect(truncateText("短文本", 10)).toBe("短文本");
  });

  it("should truncate and append ellipsis", () => {
    expect(truncateText("这是一段很长的文本需要截断", 6)).toBe("这是一段很长...");
  });

  it("should handle empty strings", () => {
    expect(truncateText("", 10)).toBe("");
  });
});

describe("searchAlerts", () => {
  const alerts = [
    createMockAlert({ id: "1", title: "半导体出口管制", summary: "芯片限制", tags: ["半导体"] }),
    createMockAlert({ id: "2", title: "碳边境调节", summary: "碳排放申报", tags: ["碳排放"] }),
    createMockAlert({ id: "3", title: "降准降息", summary: "央行货币政策", tags: ["货币政策"] }),
  ];

  it("should return all alerts for empty query", () => {
    expect(searchAlerts(alerts, "")).toHaveLength(3);
    expect(searchAlerts(alerts, "  ")).toHaveLength(3);
  });

  it("should search by title", () => {
    expect(searchAlerts(alerts, "半导体")).toHaveLength(1);
  });

  it("should search by summary", () => {
    expect(searchAlerts(alerts, "货币政策")).toHaveLength(1);
  });

  it("should search by tags", () => {
    expect(searchAlerts(alerts, "碳排放")).toHaveLength(1);
  });

  it("should be case insensitive", () => {
    const alerts2 = [
      createMockAlert({ id: "1", title: "CBAM Policy Update", summary: "Carbon border", tags: [] }),
    ];
    expect(searchAlerts(alerts2, "cbam")).toHaveLength(1);
  });
});

describe("generateDailySummary", () => {
  it("should correctly count alerts by risk level", () => {
    const alerts = [
      createMockAlert({ id: "1", riskLevel: "critical" }),
      createMockAlert({ id: "2", riskLevel: "high" }),
      createMockAlert({ id: "3", riskLevel: "high" }),
      createMockAlert({ id: "4", riskLevel: "medium" }),
      createMockAlert({ id: "5", riskLevel: "low" }),
    ];

    const summary = generateDailySummary(alerts, "2026-03-19");
    expect(summary.alertCount).toBe(5);
    expect(summary.criticalCount).toBe(1);
    expect(summary.highCount).toBe(2);
    expect(summary.mediumCount).toBe(1);
    expect(summary.lowCount).toBe(1);
  });

  it("should set overall risk to critical when critical alerts exist", () => {
    const alerts = [
      createMockAlert({ riskLevel: "critical" }),
      createMockAlert({ riskLevel: "low" }),
    ];
    expect(generateDailySummary(alerts, "2026-03-19").overallRisk).toBe("critical");
  });

  it("should set overall risk to high when no critical but high alerts exist", () => {
    const alerts = [
      createMockAlert({ riskLevel: "high" }),
      createMockAlert({ riskLevel: "low" }),
    ];
    expect(generateDailySummary(alerts, "2026-03-19").overallRisk).toBe("high");
  });

  it("should set overall risk to low when only low alerts exist", () => {
    const alerts = [createMockAlert({ riskLevel: "low" })];
    expect(generateDailySummary(alerts, "2026-03-19").overallRisk).toBe("low");
  });

  it("should return top 3 alerts sorted by risk", () => {
    const alerts = [
      createMockAlert({ id: "1", riskLevel: "low", summary: "Low" }),
      createMockAlert({ id: "2", riskLevel: "critical", summary: "Critical" }),
      createMockAlert({ id: "3", riskLevel: "medium", summary: "Medium" }),
      createMockAlert({ id: "4", riskLevel: "high", summary: "High" }),
    ];

    const summary = generateDailySummary(alerts, "2026-03-19");
    expect(summary.topAlerts).toHaveLength(3);
    expect(summary.topAlerts[0].riskLevel).toBe("critical");
    expect(summary.highlights).toHaveLength(3);
  });
});
