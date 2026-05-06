/**
 * @fileoverview PDF 生成模块单元测试
 */

import { calculateTotals, generateInvoiceNumber } from "@/lib/pdf";

describe("calculateTotals", () => {
  it("should calculate correct subtotal without tax", () => {
    const items = [
      { quantity: 2, unitPrice: 50 },
      { quantity: 1, unitPrice: 100 },
    ];
    const result = calculateTotals(items, 0);
    expect(result.subtotal).toBe(200);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(200);
  });

  it("should calculate correct totals with tax", () => {
    const items = [
      { quantity: 1, unitPrice: 100 },
      { quantity: 3, unitPrice: 25 },
    ];
    const result = calculateTotals(items, 10);
    expect(result.subtotal).toBe(175);
    expect(result.taxAmount).toBe(17.5);
    expect(result.total).toBe(192.5);
  });

  it("should handle empty items", () => {
    const result = calculateTotals([], 20);
    expect(result.subtotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(0);
  });

  it("should round to 2 decimal places", () => {
    const items = [{ quantity: 3, unitPrice: 33.33 }];
    const result = calculateTotals(items, 7);
    expect(result.subtotal).toBe(99.99);
    expect(result.taxAmount).toBe(7);
    expect(result.total).toBe(106.99);
  });
});

describe("generateInvoiceNumber", () => {
  it("should generate invoice number with correct format", () => {
    const number = generateInvoiceNumber(1);
    expect(number).toMatch(/^INV-\d{6}-\d{4}$/);
  });

  it("should use provided sequence number", () => {
    const number = generateInvoiceNumber(42);
    expect(number).toContain("0042");
  });

  it("should generate random sequence when no sequence provided", () => {
    const number1 = generateInvoiceNumber();
    const number2 = generateInvoiceNumber();
    expect(number1).toMatch(/^INV-\d{6}-\d{4}$/);
    expect(number2).toMatch(/^INV-\d{6}-\d{4}$/);
  });
});
