import { useStore } from "@/store/useStore";
import type { Quote, Client } from "@/types";

/**
 * @description Zustand store 重置工具
 */
const resetStore = () => {
  useStore.setState({
    quotes: [],
    clients: [],
    followUps: [],
    settings: {
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
      subscription: "free",
      darkMode: false,
      currency: "USD",
      taxRate: 0,
      defaultPaymentTerms: 30,
    },
  });
};

const mockClient: Client = {
  id: "client-1",
  name: "Alice",
  email: "alice@example.com",
  phone: "555-1234",
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockQuote: Quote = {
  id: "quote-1",
  quoteNumber: "QF-202501-0001",
  client: mockClient,
  serviceDescription: "Website Design",
  items: [
    { id: "item-1", description: "Design", quantity: 1, unitPrice: 1000 },
  ],
  subtotal: 1000,
  tax: 100,
  total: 1100,
  quoteStatus: "draft",
  paymentStatus: "unpaid",
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  paidAmount: 0,
  notes: "Test quote",
  aiGenerated: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("useStore - Quotes", () => {
  beforeEach(resetStore);

  it("should add a quote", () => {
    useStore.getState().addQuote(mockQuote);
    expect(useStore.getState().quotes).toHaveLength(1);
    expect(useStore.getState().quotes[0].id).toBe("quote-1");
  });

  it("should update a quote", () => {
    useStore.getState().addQuote(mockQuote);
    useStore.getState().updateQuote("quote-1", { quoteStatus: "sent" });
    expect(useStore.getState().quotes[0].quoteStatus).toBe("sent");
  });

  it("should delete a quote", () => {
    useStore.getState().addQuote(mockQuote);
    useStore.getState().deleteQuote("quote-1");
    expect(useStore.getState().quotes).toHaveLength(0);
  });
});

describe("useStore - Clients", () => {
  beforeEach(resetStore);

  it("should add a client", () => {
    useStore.getState().addClient(mockClient);
    expect(useStore.getState().clients).toHaveLength(1);
  });

  it("should update a client", () => {
    useStore.getState().addClient(mockClient);
    useStore.getState().updateClient("client-1", { name: "Alice Updated" });
    expect(useStore.getState().clients[0].name).toBe("Alice Updated");
  });

  it("should delete a client", () => {
    useStore.getState().addClient(mockClient);
    useStore.getState().deleteClient("client-1");
    expect(useStore.getState().clients).toHaveLength(0);
  });
});

describe("useStore - Settings", () => {
  beforeEach(resetStore);

  it("should update settings", () => {
    useStore.getState().updateSettings({ businessName: "My Agency" });
    expect(useStore.getState().settings.businessName).toBe("My Agency");
  });

  it("should set subscription", () => {
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().settings.subscription).toBe("pro");
  });

  it("should toggle dark mode", () => {
    useStore.getState().updateSettings({ darkMode: true });
    expect(useStore.getState().settings.darkMode).toBe(true);
  });
});

describe("useStore - Free Limit", () => {
  beforeEach(resetStore);

  it("should not be reached with zero quotes", () => {
    expect(useStore.getState().isFreeLimitReached()).toBe(false);
  });

  it("should be reached after 5 quotes this month", () => {
    for (let i = 0; i < 5; i++) {
      useStore.getState().addQuote({
        ...mockQuote,
        id: `quote-${i}`,
        createdAt: new Date().toISOString(),
      });
    }
    expect(useStore.getState().isFreeLimitReached()).toBe(true);
  });

  it("should not apply to pro users", () => {
    useStore.getState().setSubscription("pro");
    for (let i = 0; i < 10; i++) {
      useStore.getState().addQuote({
        ...mockQuote,
        id: `quote-${i}`,
        createdAt: new Date().toISOString(),
      });
    }
    expect(useStore.getState().isFreeLimitReached()).toBe(false);
  });
});

describe("useStore - Query Helpers", () => {
  beforeEach(resetStore);

  it("should get client quotes", () => {
    useStore.getState().addQuote(mockQuote);
    useStore.getState().addQuote({
      ...mockQuote,
      id: "quote-2",
      client: { ...mockClient, id: "client-2", name: "Bob" },
    });

    const clientQuotes = useStore.getState().getClientQuotes("client-1");
    expect(clientQuotes).toHaveLength(1);
    expect(clientQuotes[0].client.id).toBe("client-1");
  });
});
