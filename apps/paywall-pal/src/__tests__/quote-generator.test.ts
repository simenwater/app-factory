/**
 * @fileoverview 报价单生成器单元测试
 */

import {
  calculateItemSubtotal,
  calculateTotal,
  formatCurrency,
  generateQuoteText,
  createDefaultQuoteItem,
  SERVICE_PRESETS,
} from "@/lib/quote-generator";
import { Quote, QuoteItem } from "@/types";

describe("calculateItemSubtotal", () => {
  it("should calculate subtotal correctly", () => {
    const item: QuoteItem = {
      id: "1",
      description: "Design",
      unitPrice: 100,
      quantity: 5,
      unit: "hours",
    };
    expect(calculateItemSubtotal(item)).toBe(500);
  });

  it("should handle zero quantity", () => {
    const item: QuoteItem = {
      id: "1",
      description: "Design",
      unitPrice: 100,
      quantity: 0,
      unit: "hours",
    };
    expect(calculateItemSubtotal(item)).toBe(0);
  });

  it("should handle decimal values", () => {
    const item: QuoteItem = {
      id: "1",
      description: "Content",
      unitPrice: 0.15,
      quantity: 2000,
      unit: "words",
    };
    expect(calculateItemSubtotal(item)).toBeCloseTo(300);
  });
});

describe("calculateTotal", () => {
  it("should sum all items", () => {
    const items: QuoteItem[] = [
      { id: "1", description: "A", unitPrice: 100, quantity: 2, unit: "hours" },
      { id: "2", description: "B", unitPrice: 50, quantity: 4, unit: "hours" },
    ];
    expect(calculateTotal(items)).toBe(400);
  });

  it("should return 0 for empty items", () => {
    expect(calculateTotal([])).toBe(0);
  });
});

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    expect(formatCurrency(1000, "USD")).toBe("$1,000.00");
  });

  it("should format EUR correctly", () => {
    expect(formatCurrency(500, "EUR")).toBe("€500.00");
  });

  it("should format CNY correctly", () => {
    expect(formatCurrency(8888, "CNY")).toBe("¥8,888.00");
  });

  it("should handle unknown currency", () => {
    const result = formatCurrency(100, "AUD");
    expect(result).toContain("100.00");
  });
});

describe("generateQuoteText", () => {
  const sampleQuote: Quote = {
    clientName: "Acme Corp",
    projectName: "Website Redesign",
    items: [
      { id: "1", description: "UI Design", unitPrice: 100, quantity: 10, unit: "hours" },
      { id: "2", description: "Development", unitPrice: 120, quantity: 20, unit: "hours" },
    ],
    notes: "Includes 2 rounds of revisions",
    validDays: 14,
    currency: "USD",
  };

  it("should include client name", () => {
    const text = generateQuoteText(sampleQuote);
    expect(text).toContain("Acme Corp");
  });

  it("should include project name", () => {
    const text = generateQuoteText(sampleQuote);
    expect(text).toContain("Website Redesign");
  });

  it("should include total amount", () => {
    const text = generateQuoteText(sampleQuote);
    expect(text).toContain("$3,400.00");
  });

  it("should include notes", () => {
    const text = generateQuoteText(sampleQuote);
    expect(text).toContain("Includes 2 rounds of revisions");
  });

  it("should include terms", () => {
    const text = generateQuoteText(sampleQuote);
    expect(text).toContain("50% deposit");
  });

  it("should include valid days", () => {
    const text = generateQuoteText(sampleQuote);
    expect(text).toContain("14 days");
  });
});

describe("createDefaultQuoteItem", () => {
  it("should create an item with an id", () => {
    const item = createDefaultQuoteItem();
    expect(item.id).toBeTruthy();
  });

  it("should create items with unique ids", () => {
    const item1 = createDefaultQuoteItem();
    const item2 = createDefaultQuoteItem();
    expect(item1.id).not.toBe(item2.id);
  });

  it("should have default values", () => {
    const item = createDefaultQuoteItem();
    expect(item.description).toBe("");
    expect(item.unitPrice).toBe(0);
    expect(item.quantity).toBe(1);
    expect(item.unit).toBe("hours");
  });
});

describe("SERVICE_PRESETS", () => {
  it("should have at least 3 presets", () => {
    expect(SERVICE_PRESETS.length).toBeGreaterThanOrEqual(3);
  });

  it("should have items in each preset", () => {
    for (const preset of SERVICE_PRESETS) {
      expect(preset.label).toBeTruthy();
      expect(preset.items.length).toBeGreaterThan(0);
    }
  });
});
