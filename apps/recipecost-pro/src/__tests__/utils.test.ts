import {
  generateId,
  formatCurrency,
  formatPercent,
  formatDate,
  getUnitConversionFactor,
  CATEGORY_CONFIG,
  UNIT_LABELS,
} from "@/lib/utils";

describe("generateId", () => {
  it("should return a non-empty string", () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
  });

  it("should generate unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("formatCurrency", () => {
  it("should format CNY by default", () => {
    const result = formatCurrency(10.5);
    expect(result).toContain("10.50");
  });

  it("should format USD", () => {
    const result = formatCurrency(10.5, "USD");
    expect(result).toContain("$");
    expect(result).toContain("10.50");
  });

  it("should format zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0.00");
  });

  it("should format large numbers", () => {
    const result = formatCurrency(12345.67, "CNY");
    expect(result).toContain("12,345.67");
  });
});

describe("formatPercent", () => {
  it("should format decimal as percentage", () => {
    expect(formatPercent(0.15)).toBe("15%");
  });

  it("should handle zero", () => {
    expect(formatPercent(0)).toBe("0%");
  });

  it("should handle 100%", () => {
    expect(formatPercent(1)).toBe("100%");
  });
});

describe("formatDate", () => {
  it("should format ISO date string", () => {
    const result = formatDate("2025-01-15T12:00:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("getUnitConversionFactor", () => {
  it("should return 1 for same units", () => {
    expect(getUnitConversionFactor("g", "g")).toBe(1);
    expect(getUnitConversionFactor("kg", "kg")).toBe(1);
  });

  it("should convert g to kg", () => {
    expect(getUnitConversionFactor("g", "kg")).toBeCloseTo(0.001);
  });

  it("should convert kg to g", () => {
    expect(getUnitConversionFactor("kg", "g")).toBe(1000);
  });

  it("should convert ml to L", () => {
    expect(getUnitConversionFactor("ml", "L")).toBeCloseTo(0.001);
  });

  it("should convert L to ml", () => {
    expect(getUnitConversionFactor("L", "ml")).toBe(1000);
  });

  it("should return 1 for incompatible units", () => {
    expect(getUnitConversionFactor("g", "ml")).toBe(1);
    expect(getUnitConversionFactor("个", "kg")).toBe(1);
  });
});

describe("CATEGORY_CONFIG", () => {
  it("should have all categories", () => {
    const expected = [
      "meat", "seafood", "vegetable", "fruit",
      "dairy", "grain", "seasoning", "oil", "other",
    ];
    expected.forEach((cat) => {
      expect(CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]).toBeDefined();
    });
  });

  it("each category should have label and emoji", () => {
    Object.values(CATEGORY_CONFIG).forEach((cfg) => {
      expect(cfg.label).toBeTruthy();
      expect(cfg.emoji).toBeTruthy();
    });
  });
});

describe("UNIT_LABELS", () => {
  it("should have all units", () => {
    const expected = ["g", "kg", "ml", "L", "个", "片", "根", "把", "勺", "杯"];
    expected.forEach((unit) => {
      expect(UNIT_LABELS[unit as keyof typeof UNIT_LABELS]).toBeDefined();
    });
  });
});
