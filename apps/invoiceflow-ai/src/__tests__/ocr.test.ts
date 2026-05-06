/**
 * @fileoverview OCR 模块单元测试
 */

import { parseLineItems, validateOCRResult } from "@/lib/ocr";
import type { OCRResult } from "@/types";

describe("parseLineItems", () => {
  it("should parse valid line items array", () => {
    const data = [
      { description: "Web Development", quantity: 10, unitPrice: 100, total: 1000 },
      { description: "Design", quantity: 5, unitPrice: 80, total: 400 },
    ];
    const result = parseLineItems(data);
    expect(result).toHaveLength(2);
    expect(result[0].description).toBe("Web Development");
    expect(result[0].total).toBe(1000);
    expect(result[1].description).toBe("Design");
  });

  it("should handle invalid input gracefully", () => {
    expect(parseLineItems(null)).toEqual([]);
    expect(parseLineItems(undefined)).toEqual([]);
    expect(parseLineItems("string")).toEqual([]);
    expect(parseLineItems(123)).toEqual([]);
  });

  it("should filter out items without required fields", () => {
    const data = [
      { description: "Valid Item", total: 100 },
      { noDescription: true, total: 50 },
      { description: "Another Valid", total: 200 },
    ];
    const result = parseLineItems(data);
    expect(result).toHaveLength(2);
  });

  it("should default quantity to 1 and use total as unitPrice when missing", () => {
    const data = [{ description: "Single item", total: 150 }];
    const result = parseLineItems(data);
    expect(result[0].quantity).toBe(1);
    expect(result[0].unitPrice).toBe(150);
  });
});

describe("validateOCRResult", () => {
  it("should validate complete result as valid", () => {
    const result: OCRResult = {
      vendorName: "Acme Corp",
      amount: 500,
      currency: "USD",
      date: "2026-01-15",
      items: [{ description: "Service", quantity: 1, unitPrice: 500, total: 500 }],
      rawText: "raw text",
      confidence: 0.9,
    };
    const validation = validateOCRResult(result);
    expect(validation.valid).toBe(true);
    expect(validation.missing).toHaveLength(0);
  });

  it("should detect missing vendor name", () => {
    const result: OCRResult = {
      vendorName: "",
      amount: 100,
      currency: "USD",
      date: "2026-01-15",
      items: [{ description: "Item", quantity: 1, unitPrice: 100, total: 100 }],
      rawText: "text",
      confidence: 0.8,
    };
    const validation = validateOCRResult(result);
    expect(validation.valid).toBe(false);
    expect(validation.missing).toContain("商家名称");
  });

  it("should detect missing amount", () => {
    const result: OCRResult = {
      vendorName: "Test",
      amount: 0,
      currency: "USD",
      date: "2026-01-15",
      items: [{ description: "Item", quantity: 1, unitPrice: 0, total: 0 }],
      rawText: "text",
      confidence: 0.8,
    };
    const validation = validateOCRResult(result);
    expect(validation.valid).toBe(false);
    expect(validation.missing).toContain("金额");
  });

  it("should detect empty items list", () => {
    const result: OCRResult = {
      vendorName: "Test",
      amount: 100,
      currency: "USD",
      date: "2026-01-15",
      items: [],
      rawText: "text",
      confidence: 0.8,
    };
    const validation = validateOCRResult(result);
    expect(validation.valid).toBe(false);
    expect(validation.missing).toContain("项目明细");
  });

  it("should report all missing fields", () => {
    const result: OCRResult = {
      vendorName: "",
      amount: 0,
      currency: "USD",
      date: "",
      items: [],
      rawText: "",
      confidence: 0,
    };
    const validation = validateOCRResult(result);
    expect(validation.valid).toBe(false);
    expect(validation.missing).toHaveLength(4);
  });
});
