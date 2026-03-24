import { useStore } from "@/store/useStore";
import type { Quote, ClientChecklist } from "@/types";

/**
 * @description 创建测试用的报价单
 */
function createTestQuote(overrides?: Partial<Quote>): Quote {
  return {
    id: "test-quote-1",
    clientName: "Test Client",
    clientEmail: "test@example.com",
    projectName: "Test Project",
    serviceCategory: "design",
    billingMode: "hourly",
    lineItems: [
      {
        id: "li-1",
        description: "Design work",
        quantity: 10,
        unit: "小时",
        unitPrice: 100,
      },
    ],
    notes: "",
    validDays: 14,
    currency: "USD",
    createdAt: new Date().toISOString(),
    status: "draft",
    ...overrides,
  };
}

/**
 * @description 创建测试用的清单
 */
function createTestChecklist(): ClientChecklist {
  return {
    id: "test-cl-1",
    clientName: "Test Client",
    projectName: "Test Project",
    items: [
      { id: "item-1", text: "Task 1", category: "scope", checked: false },
      { id: "item-2", text: "Task 2", category: "payment", checked: false },
    ],
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

beforeEach(() => {
  useStore.getState().resetStore();
});

describe("Store - Quotes", () => {
  it("should add a quote", () => {
    const quote = createTestQuote();
    useStore.getState().addQuote(quote);
    expect(useStore.getState().quotes).toHaveLength(1);
    expect(useStore.getState().quotes[0].id).toBe("test-quote-1");
  });

  it("should update a quote", () => {
    const quote = createTestQuote();
    useStore.getState().addQuote(quote);
    useStore.getState().updateQuote("test-quote-1", { status: "sent" });
    expect(useStore.getState().quotes[0].status).toBe("sent");
  });

  it("should delete a quote", () => {
    useStore.getState().addQuote(createTestQuote());
    useStore.getState().deleteQuote("test-quote-1");
    expect(useStore.getState().quotes).toHaveLength(0);
  });
});

describe("Store - Checklists", () => {
  it("should add a checklist", () => {
    const cl = createTestChecklist();
    useStore.getState().addChecklist(cl);
    expect(useStore.getState().checklists).toHaveLength(1);
  });

  it("should update checklist item", () => {
    const cl = createTestChecklist();
    useStore.getState().addChecklist(cl);
    useStore.getState().updateChecklistItem("test-cl-1", "item-1", true);
    const updated = useStore.getState().checklists[0];
    expect(updated.items[0].checked).toBe(true);
    expect(updated.items[1].checked).toBe(false);
  });

  it("should delete a checklist", () => {
    useStore.getState().addChecklist(createTestChecklist());
    useStore.getState().deleteChecklist("test-cl-1");
    expect(useStore.getState().checklists).toHaveLength(0);
  });
});

describe("Store - Settings", () => {
  it("should update settings", () => {
    useStore.getState().updateSettings({ darkMode: true });
    expect(useStore.getState().settings.darkMode).toBe(true);
  });

  it("should update multiple settings at once", () => {
    useStore.getState().updateSettings({
      defaultCurrency: "EUR",
      defaultHourlyRate: 120,
    });
    expect(useStore.getState().settings.defaultCurrency).toBe("EUR");
    expect(useStore.getState().settings.defaultHourlyRate).toBe(120);
  });
});

describe("Store - Reset", () => {
  it("should reset to initial state", () => {
    useStore.getState().addQuote(createTestQuote());
    useStore.getState().updateSettings({ darkMode: true });
    useStore.getState().resetStore();
    expect(useStore.getState().quotes).toHaveLength(0);
    expect(useStore.getState().settings.darkMode).toBe(false);
  });
});
