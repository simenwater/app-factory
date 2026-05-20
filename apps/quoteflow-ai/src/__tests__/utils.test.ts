import {
  generateQuoteNumber,
  formatCurrency,
  formatDate,
  calculateSubtotal,
  calculateTax,
  getStatusColor,
  getRelativeTime,
  calculateConversionRate,
} from "@/lib/utils";

describe("generateQuoteNumber", () => {
  it("should generate a quote number with QF prefix", () => {
    const qn = generateQuoteNumber();
    expect(qn).toMatch(/^QF-\d{6}-\d{4}$/);
  });

  it("should generate unique quote numbers", () => {
    const numbers = new Set(Array.from({ length: 20 }, () => generateQuoteNumber()));
    expect(numbers.size).toBeGreaterThan(1);
  });
});

describe("formatCurrency", () => {
  it("should format USD amounts correctly", () => {
    expect(formatCurrency(1500)).toBe("$1,500.00");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(99.9)).toBe("$99.90");
  });

  it("should format EUR amounts correctly", () => {
    const result = formatCurrency(1500, "EUR");
    expect(result).toContain("1,500.00");
  });
});

describe("formatDate", () => {
  it("should format date strings", () => {
    const result = formatDate("2025-01-15T12:00:00Z");
    expect(result).toBe("Jan 15, 2025");
  });
});

describe("calculateSubtotal", () => {
  it("should calculate correct subtotal from line items", () => {
    const items = [
      { quantity: 2, unitPrice: 100 },
      { quantity: 1, unitPrice: 500 },
    ];
    expect(calculateSubtotal(items)).toBe(700);
  });

  it("should return 0 for empty items", () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe("calculateTax", () => {
  it("should calculate tax correctly", () => {
    expect(calculateTax(1000, 10)).toBe(100);
    expect(calculateTax(500, 7.5)).toBe(37.5);
  });

  it("should return 0 for zero tax rate", () => {
    expect(calculateTax(1000, 0)).toBe(0);
  });
});

describe("getStatusColor", () => {
  it("should return correct color classes for known statuses", () => {
    expect(getStatusColor("draft")).toContain("gray");
    expect(getStatusColor("sent")).toContain("blue");
    expect(getStatusColor("accepted")).toContain("green");
    expect(getStatusColor("declined")).toContain("red");
    expect(getStatusColor("paid")).toContain("green");
    expect(getStatusColor("overdue")).toContain("red");
  });

  it("should return default for unknown status", () => {
    expect(getStatusColor("unknown")).toContain("gray");
  });
});

describe("getRelativeTime", () => {
  it("should return 'Today' for today's date", () => {
    expect(getRelativeTime(new Date().toISOString())).toBe("Today");
  });

  it("should return 'Yesterday' for yesterday", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(getRelativeTime(yesterday.toISOString())).toBe("Yesterday");
  });
});

describe("calculateConversionRate", () => {
  it("should calculate conversion rate correctly", () => {
    expect(calculateConversionRate(10, 3)).toBe(30);
    expect(calculateConversionRate(4, 4)).toBe(100);
  });

  it("should return 0 for zero total", () => {
    expect(calculateConversionRate(0, 0)).toBe(0);
  });
});
