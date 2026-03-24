import {
  generateLineItems,
  generateQuote,
  calculateQuoteTotal,
  getSuggestedRate,
  SERVICE_RATES,
} from "@/lib/quote";
import type { QuoteInput } from "@/types";

/**
 * @description 创建测试用的报价输入
 */
function createTestInput(overrides?: Partial<QuoteInput>): QuoteInput {
  return {
    clientName: "张三",
    clientEmail: "zhang@example.com",
    projectName: "品牌设计",
    serviceCategory: "design",
    billingMode: "hourly",
    description: "Logo 和品牌视觉设计",
    estimatedHours: 20,
    hourlyRate: 100,
    currency: "USD",
    ...overrides,
  };
}

describe("generateLineItems", () => {
  it("should generate hourly line items", () => {
    const input = createTestInput({ billingMode: "hourly" });
    const items = generateLineItems(input);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(20);
    expect(items[0].unit).toBe("小时");
    expect(items[0].unitPrice).toBe(100);
  });

  it("should generate fixed price line items", () => {
    const input = createTestInput({ billingMode: "fixed" });
    const items = generateLineItems(input);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].unit).toBe("项");
    expect(items[0].unitPrice).toBe(2000);
  });

  it("should generate daily line items", () => {
    const input = createTestInput({
      billingMode: "daily",
      estimatedHours: 24,
      hourlyRate: 50,
    });
    const items = generateLineItems(input);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(items[0].unit).toBe("天");
    expect(items[0].unitPrice).toBe(400);
  });

  it("should generate monthly line items", () => {
    const input = createTestInput({
      billingMode: "monthly",
      estimatedHours: 320,
      hourlyRate: 50,
    });
    const items = generateLineItems(input);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(items[0].unit).toBe("月");
    expect(items[0].unitPrice).toBe(8000);
  });

  it("should use default rate when hourlyRate is 0", () => {
    const input = createTestInput({ hourlyRate: 0 });
    const items = generateLineItems(input);
    expect(items[0].unitPrice).toBe(SERVICE_RATES.design.defaultRate);
  });
});

describe("generateQuote", () => {
  it("should create a complete quote", () => {
    const input = createTestInput();
    const quote = generateQuote(input, 30);
    expect(quote.clientName).toBe("张三");
    expect(quote.projectName).toBe("品牌设计");
    expect(quote.serviceCategory).toBe("design");
    expect(quote.validDays).toBe(30);
    expect(quote.status).toBe("draft");
    expect(quote.lineItems.length).toBeGreaterThan(0);
    expect(quote.id).toBeDefined();
    expect(quote.createdAt).toBeDefined();
  });

  it("should default to 14 days validity", () => {
    const quote = generateQuote(createTestInput());
    expect(quote.validDays).toBe(14);
  });
});

describe("calculateQuoteTotal", () => {
  it("should sum all line items correctly", () => {
    const items = [
      { id: "1", description: "a", quantity: 2, unit: "h", unitPrice: 100 },
      { id: "2", description: "b", quantity: 3, unit: "h", unitPrice: 50 },
    ];
    expect(calculateQuoteTotal(items)).toBe(350);
  });

  it("should return 0 for empty items", () => {
    expect(calculateQuoteTotal([])).toBe(0);
  });
});

describe("getSuggestedRate", () => {
  it("should return rates for known categories", () => {
    const rate = getSuggestedRate("development");
    expect(rate.min).toBe(60);
    expect(rate.max).toBe(250);
    expect(rate.defaultRate).toBe(100);
  });

  it("should return rates for other category", () => {
    const rate = getSuggestedRate("other");
    expect(rate.min).toBeGreaterThan(0);
    expect(rate.max).toBeGreaterThan(rate.min);
  });
});

describe("SERVICE_RATES", () => {
  it("should contain all service categories", () => {
    const categories = [
      "design",
      "development",
      "consulting",
      "writing",
      "marketing",
      "photography",
      "video",
      "translation",
      "teaching",
      "other",
    ];
    categories.forEach((cat) => {
      expect(SERVICE_RATES[cat as keyof typeof SERVICE_RATES]).toBeDefined();
    });
  });
});
