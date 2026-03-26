import {
  generateId,
  formatDate,
  riskLevelColor,
  riskLevelLabel,
  trackingStatusColor,
  trackingStatusLabel,
  scoreToRiskLevel,
} from "@/lib/utils";

describe("utils", () => {
  describe("generateId", () => {
    it("should generate a unique UUID string", () => {
      const id = generateId();
      expect(id).toBeDefined();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("should generate different IDs each time", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("formatDate", () => {
    it("should format a date string", () => {
      const result = formatDate("2025-01-15T10:30:00Z");
      expect(result).toContain("2025");
      expect(result).toContain("01");
      expect(result).toContain("15");
    });

    it("should format a Date object", () => {
      const date = new Date("2025-06-01T12:00:00Z");
      const result = formatDate(date);
      expect(result).toContain("2025");
    });
  });

  describe("riskLevelColor", () => {
    it("should return green for low risk", () => {
      expect(riskLevelColor("low")).toContain("green");
    });

    it("should return yellow for medium risk", () => {
      expect(riskLevelColor("medium")).toContain("yellow");
    });

    it("should return orange for high risk", () => {
      expect(riskLevelColor("high")).toContain("orange");
    });

    it("should return red for critical risk", () => {
      expect(riskLevelColor("critical")).toContain("red");
    });
  });

  describe("riskLevelLabel", () => {
    it("should return correct Chinese labels", () => {
      expect(riskLevelLabel("low")).toBe("低风险");
      expect(riskLevelLabel("medium")).toBe("中风险");
      expect(riskLevelLabel("high")).toBe("高风险");
      expect(riskLevelLabel("critical")).toBe("危险");
    });
  });

  describe("trackingStatusColor", () => {
    it("should return appropriate colors for each status", () => {
      expect(trackingStatusColor("draft")).toContain("text-muted");
      expect(trackingStatusColor("sent")).toContain("blue");
      expect(trackingStatusColor("effective")).toContain("green");
      expect(trackingStatusColor("needs_revision")).toContain("orange");
    });
  });

  describe("trackingStatusLabel", () => {
    it("should return correct Chinese labels", () => {
      expect(trackingStatusLabel("draft")).toBe("草稿");
      expect(trackingStatusLabel("sent")).toBe("已发送");
      expect(trackingStatusLabel("effective")).toBe("有效");
      expect(trackingStatusLabel("needs_revision")).toBe("需修改");
    });
  });

  describe("scoreToRiskLevel", () => {
    it("should return low for scores under 25", () => {
      expect(scoreToRiskLevel(0)).toBe("low");
      expect(scoreToRiskLevel(10)).toBe("low");
      expect(scoreToRiskLevel(24)).toBe("low");
    });

    it("should return medium for scores 25-49", () => {
      expect(scoreToRiskLevel(25)).toBe("medium");
      expect(scoreToRiskLevel(40)).toBe("medium");
      expect(scoreToRiskLevel(49)).toBe("medium");
    });

    it("should return high for scores 50-74", () => {
      expect(scoreToRiskLevel(50)).toBe("high");
      expect(scoreToRiskLevel(60)).toBe("high");
      expect(scoreToRiskLevel(74)).toBe("high");
    });

    it("should return critical for scores 75+", () => {
      expect(scoreToRiskLevel(75)).toBe("critical");
      expect(scoreToRiskLevel(90)).toBe("critical");
      expect(scoreToRiskLevel(100)).toBe("critical");
    });
  });
});
