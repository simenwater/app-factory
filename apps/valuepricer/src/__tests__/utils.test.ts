import {
  generateId,
  formatCurrency,
  formatPercent,
  formatDate,
  customerSizeLabel,
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
  it("should format USD by default", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
  });

  it("should format large numbers with commas", () => {
    expect(formatCurrency(1234567)).toBe("$1,234,567");
  });

  it("should format zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("should accept different currencies", () => {
    const result = formatCurrency(100, "EUR");
    expect(result).toContain("100");
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
  it("should format ISO date string in en-US format", () => {
    const result = formatDate("2025-01-15T12:00:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("customerSizeLabel", () => {
  it("should return correct labels", () => {
    expect(customerSizeLabel("startup")).toBe("Startup");
    expect(customerSizeLabel("smb")).toBe("SMB");
    expect(customerSizeLabel("mid_market")).toBe("Mid-Market");
    expect(customerSizeLabel("enterprise")).toBe("Enterprise");
  });

  it("should return raw value for unknown sizes", () => {
    expect(customerSizeLabel("unknown")).toBe("unknown");
  });
});
