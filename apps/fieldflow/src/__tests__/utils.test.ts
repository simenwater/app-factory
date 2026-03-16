import {
  generateId,
  generateInvoiceNumber,
  formatCurrency,
  formatDate,
  getStatusColor,
  isToday,
} from "@/lib/utils";

describe("generateId", () => {
  it("should generate a unique UUID string", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).toBeTruthy();
    expect(typeof id1).toBe("string");
    expect(id1).not.toBe(id2);
  });
});

describe("generateInvoiceNumber", () => {
  it("should return INV-YYYYMM-XXXX format", () => {
    const num = generateInvoiceNumber();
    expect(num).toMatch(/^INV-\d{6}-\d{4}$/);
  });

  it("should use current year and month", () => {
    const num = generateInvoiceNumber();
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    expect(num).toContain(ym);
  });
});

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    const result = formatCurrency(1234.5, "USD");
    expect(result).toContain("1,234.50");
  });

  it("should format EUR correctly", () => {
    const result = formatCurrency(99.99, "EUR");
    expect(result).toContain("99.99");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0, "USD");
    expect(result).toContain("0.00");
  });
});

describe("formatDate", () => {
  it("should format a date string", () => {
    const result = formatDate("2025-03-15");
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });
});

describe("getStatusColor", () => {
  it("should return color classes for known statuses", () => {
    expect(getStatusColor("scheduled")).toContain("bg-blue");
    expect(getStatusColor("completed")).toContain("bg-green");
    expect(getStatusColor("cancelled")).toContain("bg-red");
    expect(getStatusColor("paid")).toContain("bg-green");
    expect(getStatusColor("overdue")).toContain("bg-red");
  });

  it("should return default for unknown status", () => {
    expect(getStatusColor("unknown")).toContain("bg-gray");
  });
});

describe("isToday", () => {
  it("should return true for today's date", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(isToday(today)).toBe(true);
  });

  it("should return false for a past date", () => {
    expect(isToday("2020-01-01")).toBe(false);
  });
});
