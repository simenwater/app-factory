/**
 * @description 工具函数单元测试
 */

import {
  formatCurrency,
  generateInvoiceNumber,
  calculateLineTotal,
  calculateTotals,
  estimateQuarterlyTax,
  cn,
} from "@/lib/utils";

describe("formatCurrency", () => {
  it("应正确格式化美元金额", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(99.9)).toBe("$99.90");
    expect(formatCurrency(1234567.89)).toBe("$1,234,567.89");
  });
});

describe("generateInvoiceNumber", () => {
  it("应生成正确格式的发票编号", () => {
    const year = new Date().getFullYear();
    expect(generateInvoiceNumber(1)).toBe(`INV-${year}-0001`);
    expect(generateInvoiceNumber(42)).toBe(`INV-${year}-0042`);
    expect(generateInvoiceNumber(999)).toBe(`INV-${year}-0999`);
  });
});

describe("calculateLineTotal", () => {
  it("应正确计算行项小计", () => {
    expect(calculateLineTotal(2, 500)).toBe(1000);
    expect(calculateLineTotal(1.5, 200)).toBe(300);
    expect(calculateLineTotal(0, 100)).toBe(0);
  });
});

describe("calculateTotals", () => {
  it("应正确计算含税总额", () => {
    const { taxAmount, total } = calculateTotals(1000, 10);
    expect(taxAmount).toBe(100);
    expect(total).toBe(1100);
  });

  it("零税率时总额等于小计", () => {
    const { taxAmount, total } = calculateTotals(5000, 0);
    expect(taxAmount).toBe(0);
    expect(total).toBe(5000);
  });
});

describe("estimateQuarterlyTax", () => {
  it("应计算自雇税和收入税", () => {
    const result = estimateQuarterlyTax(50000);
    expect(result.selfEmploymentTax).toBeGreaterThan(0);
    expect(result.incomeTax).toBeGreaterThan(0);
    expect(result.totalTax).toBe(result.selfEmploymentTax + result.incomeTax);
    expect(result.quarterlyPayment).toBeCloseTo(result.totalTax / 4, 0);
  });

  it("零收入时税额为零", () => {
    const result = estimateQuarterlyTax(0);
    expect(result.totalTax).toBe(0);
    expect(result.quarterlyPayment).toBe(0);
  });

  it("应考虑支出抵扣", () => {
    const withExpenses = estimateQuarterlyTax(50000, 10000);
    const withoutExpenses = estimateQuarterlyTax(50000, 0);
    expect(withExpenses.totalTax).toBeLessThan(withoutExpenses.totalTax);
  });
});

describe("cn", () => {
  it("应合并有效的类名", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
    expect(cn("a", false, "c")).toBe("a c");
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});
