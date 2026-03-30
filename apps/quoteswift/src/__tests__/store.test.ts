import { useStore } from "@/store/useStore";
import type { ServiceItem, Quote } from "@/types";

const mockService: ServiceItem = {
  id: "svc-1",
  name: "测试清洁服务",
  description: "测试描述",
  unitPrice: 100,
  unit: "次",
  category: "清洁",
  createdAt: new Date().toISOString(),
};

const mockQuote: Quote = {
  id: "q-1",
  quoteNumber: "QS-202401-0001",
  customer: {
    name: "张三",
    email: "zhang@example.com",
    phone: "13800138000",
    address: "北京市朝阳区",
  },
  items: [
    {
      id: "item-1",
      description: "客厅清洁",
      quantity: 1,
      unitPrice: 50,
      unit: "间",
    },
  ],
  subtotal: 50,
  tax: 5,
  total: 55,
  laborCost: 0,
  materialCost: 0,
  profitMargin: 0,
  status: "draft",
  validUntil: new Date().toISOString(),
  notes: "",
  templateId: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  const { setState } = useStore;
  setState({
    services: [],
    quotes: [],
    settings: {
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
      subscription: "free",
      darkMode: false,
      currency: "USD",
      taxRate: 10,
    },
  });
});

describe("useStore - services", () => {
  it("should add a service", () => {
    useStore.getState().addService(mockService);
    expect(useStore.getState().services).toHaveLength(1);
    expect(useStore.getState().services[0].name).toBe("测试清洁服务");
  });

  it("should update a service", () => {
    useStore.getState().addService(mockService);
    useStore.getState().updateService("svc-1", { unitPrice: 200 });
    expect(useStore.getState().services[0].unitPrice).toBe(200);
  });

  it("should delete a service", () => {
    useStore.getState().addService(mockService);
    useStore.getState().deleteService("svc-1");
    expect(useStore.getState().services).toHaveLength(0);
  });
});

describe("useStore - quotes", () => {
  it("should add a quote", () => {
    useStore.getState().addQuote(mockQuote);
    expect(useStore.getState().quotes).toHaveLength(1);
    expect(useStore.getState().quotes[0].customer.name).toBe("张三");
  });

  it("should update a quote", () => {
    useStore.getState().addQuote(mockQuote);
    useStore.getState().updateQuote("q-1", { status: "sent" });
    expect(useStore.getState().quotes[0].status).toBe("sent");
  });

  it("should delete a quote", () => {
    useStore.getState().addQuote(mockQuote);
    useStore.getState().deleteQuote("q-1");
    expect(useStore.getState().quotes).toHaveLength(0);
  });

  it("should track updatedAt on update", () => {
    useStore.getState().addQuote(mockQuote);
    const before = useStore.getState().quotes[0].updatedAt;

    // Small delay to ensure different timestamp
    useStore.getState().updateQuote("q-1", { status: "accepted" });
    const after = useStore.getState().quotes[0].updatedAt;
    expect(after).not.toBe(before);
  });
});

describe("useStore - settings", () => {
  it("should update settings", () => {
    useStore.getState().updateSettings({ businessName: "我的公司" });
    expect(useStore.getState().settings.businessName).toBe("我的公司");
  });

  it("should toggle dark mode", () => {
    expect(useStore.getState().settings.darkMode).toBe(false);
    useStore.getState().updateSettings({ darkMode: true });
    expect(useStore.getState().settings.darkMode).toBe(true);
  });

  it("should set subscription", () => {
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().settings.subscription).toBe("pro");
  });
});

describe("useStore - free tier limits", () => {
  it("should detect when free tier quote limit is reached", () => {
    for (let i = 0; i < 10; i++) {
      useStore.getState().addQuote({
        ...mockQuote,
        id: `q-${i}`,
        quoteNumber: `QS-TEST-${i}`,
      });
    }
    expect(useStore.getState().isFreeLimitReached()).toBe(true);
  });

  it("should not limit pro users", () => {
    useStore.getState().setSubscription("pro");
    for (let i = 0; i < 15; i++) {
      useStore.getState().addQuote({
        ...mockQuote,
        id: `q-${i}`,
        quoteNumber: `QS-TEST-${i}`,
      });
    }
    expect(useStore.getState().isFreeLimitReached()).toBe(false);
  });
});

describe("useStore - templates", () => {
  it("should return only free templates for free tier", () => {
    const templates = useStore.getState().getAvailableTemplates();
    expect(templates.every((t) => !t.isPremium)).toBe(true);
  });

  it("should return all templates for pro tier", () => {
    useStore.getState().setSubscription("pro");
    const templates = useStore.getState().getAvailableTemplates();
    expect(templates.some((t) => t.isPremium)).toBe(true);
  });
});
