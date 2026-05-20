import {
  matchPricingRules,
  generateQuoteItems,
  generateQuoteNotes,
  generateAIQuote,
} from "@/lib/ai";

describe("matchPricingRules", () => {
  it("should match website-related keywords", () => {
    const rules = matchPricingRules("I need a website redesign");
    expect(rules.length).toBeGreaterThan(0);
    expect(rules[0].description).toContain("Website");
  });

  it("should match logo design keywords", () => {
    const rules = matchPricingRules("Create a logo for my brand");
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.some((r) => r.description.includes("Logo"))).toBe(true);
  });

  it("should match SEO keywords", () => {
    const rules = matchPricingRules("SEO optimization for my site");
    expect(rules.length).toBeGreaterThan(0);
  });

  it("should match Chinese keywords", () => {
    const rules = matchPricingRules("我需要网站设计");
    expect(rules.length).toBeGreaterThan(0);
  });

  it("should return empty for unrecognized descriptions", () => {
    const rules = matchPricingRules("xyz abc random");
    expect(rules.length).toBe(0);
  });

  it("should match multiple services", () => {
    const rules = matchPricingRules("website design with logo and SEO");
    expect(rules.length).toBeGreaterThanOrEqual(3);
  });
});

describe("generateQuoteItems", () => {
  it("should generate items for recognized services", () => {
    const items = generateQuoteItems("website design project");
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].unitPrice).toBeGreaterThan(0);
    expect(items[0].id).toBeTruthy();
  });

  it("should generate fallback items for unrecognized services", () => {
    const items = generateQuoteItems("some custom unrecognized service task");
    expect(items.length).toBe(2);
    expect(items[0].description).toBe("Professional Service");
    expect(items[1].description).toContain("Project Management");
  });

  it("should set quantity to 1 by default", () => {
    const items = generateQuoteItems("logo design");
    items.forEach((item) => {
      expect(item.quantity).toBe(1);
    });
  });
});

describe("generateQuoteNotes", () => {
  it("should include client name", () => {
    const notes = generateQuoteNotes("web design", "Alice");
    expect(notes).toContain("Alice");
  });

  it("should include service description", () => {
    const notes = generateQuoteNotes("mobile app development", "Bob");
    expect(notes).toContain("mobile app development");
  });

  it("should include payment terms", () => {
    const notes = generateQuoteNotes("consulting", "Charlie");
    expect(notes).toContain("50%");
  });
});

describe("generateAIQuote", () => {
  it("should return a complete quote result", () => {
    const result = generateAIQuote("website design", "Alice", 10);

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.notes).toBeTruthy();
    expect(result.suggestedTotal).toBeGreaterThan(0);
  });

  it("should include tax in suggested total", () => {
    const result = generateAIQuote("logo design", "Bob", 10);
    const subtotal = result.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const expectedTotal = subtotal + subtotal * 0.1;
    expect(result.suggestedTotal).toBeCloseTo(expectedTotal, 2);
  });

  it("should work with zero tax rate", () => {
    const result = generateAIQuote("consulting", "Charlie", 0);
    const subtotal = result.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    expect(result.suggestedTotal).toBe(subtotal);
  });
});
