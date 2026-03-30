import {
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  calculateProfit,
  generateQuoteNumber,
  formatDate,
  getDefaultValidUntil,
} from "@/lib/utils";
import type { QuoteLineItem } from "@/types";

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    expect(formatCurrency(100, "USD")).toBe("$100.00");
  });

  it("should format zero amount", () => {
    expect(formatCurrency(0, "USD")).toBe("$0.00");
  });

  it("should format large amounts with commas", () => {
    expect(formatCurrency(10000, "USD")).toBe("$10,000.00");
  });

  it("should format EUR correctly", () => {
    const result = formatCurrency(99.99, "EUR");
    expect(result).toContain("99.99");
  });
});

describe("calculateSubtotal", () => {
  it("should calculate subtotal from line items", () => {
    const items: QuoteLineItem[] = [
      { id: "1", description: "Service A", quantity: 2, unitPrice: 50, unit: "次" },
      { id: "2", description: "Service B", quantity: 1, unitPrice: 100, unit: "次" },
    ];
    expect(calculateSubtotal(items)).toBe(200);
  });

  it("should return 0 for empty items", () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it("should handle decimal quantities", () => {
    const items: QuoteLineItem[] = [
      { id: "1", description: "Service", quantity: 1.5, unitPrice: 100, unit: "小时" },
    ];
    expect(calculateSubtotal(items)).toBe(150);
  });
});

describe("calculateTax", () => {
  it("should calculate tax at 10%", () => {
    expect(calculateTax(200, 10)).toBe(20);
  });

  it("should return 0 for 0% tax rate", () => {
    expect(calculateTax(200, 0)).toBe(0);
  });

  it("should handle decimal tax rates", () => {
    expect(calculateTax(100, 8.5)).toBeCloseTo(8.5);
  });
});

describe("calculateTotal", () => {
  it("should add subtotal and tax", () => {
    expect(calculateTotal(200, 20)).toBe(220);
  });

  it("should handle zero tax", () => {
    expect(calculateTotal(150, 0)).toBe(150);
  });
});

describe("calculateProfit", () => {
  it("should calculate profit correctly", () => {
    const result = calculateProfit({
      revenue: 1000,
      laborCost: 300,
      materialCost: 200,
      overhead: 100,
    });
    expect(result.totalCost).toBe(600);
    expect(result.profit).toBe(400);
    expect(result.profitMargin).toBe(40);
  });

  it("should handle zero revenue", () => {
    const result = calculateProfit({
      revenue: 0,
      laborCost: 100,
      materialCost: 50,
      overhead: 0,
    });
    expect(result.profit).toBe(-150);
    expect(result.profitMargin).toBe(0);
  });

  it("should detect negative profit", () => {
    const result = calculateProfit({
      revenue: 100,
      laborCost: 80,
      materialCost: 50,
      overhead: 20,
    });
    expect(result.profit).toBe(-50);
    expect(result.profitMargin).toBe(-50);
  });
});

describe("generateQuoteNumber", () => {
  it("should generate quote number with correct prefix", () => {
    const result = generateQuoteNumber(1);
    expect(result).toMatch(/^QS-\d{6}-0001$/);
  });

  it("should pad index correctly", () => {
    const result = generateQuoteNumber(42);
    expect(result).toMatch(/^QS-\d{6}-0042$/);
  });
});

describe("formatDate", () => {
  it("should format ISO date string", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z");
    expect(result).toContain("2024");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
  });
});

describe("getDefaultValidUntil", () => {
  it("should return a date 30 days from now", () => {
    const result = getDefaultValidUntil();
    const futureDate = new Date(result);
    const now = new Date();
    const diffDays = Math.round(
      (futureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    expect(diffDays).toBeGreaterThanOrEqual(29);
    expect(diffDays).toBeLessThanOrEqual(31);
  });
});
