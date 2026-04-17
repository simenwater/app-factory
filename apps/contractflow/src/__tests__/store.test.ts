/**
 * @fileoverview Store 单元测试
 */

import { useStore } from "@/store/useStore";
import { act } from "@testing-library/react";

beforeEach(() => {
  const { setState } = useStore;
  act(() => {
    setState({
      clients: [],
      quotes: [],
      contracts: [],
      payments: [],
      settings: {
        businessName: "Test Biz",
        ownerName: "Test Owner",
        email: "test@example.com",
        phone: "555-0100",
        address: "123 Main St",
        logo: "",
        taxRate: 10,
        currency: "USD",
        paymentTermsDays: 30,
        stripeEnabled: true,
        stripeAccountId: "acct_test",
        paypalEnabled: true,
        paypalEmail: "pay@example.com",
        autoReminderEnabled: true,
        reminderIntervalDays: 7,
        maxFreeContracts: 3,
      },
      subscription: {
        plan: "free",
        contractsUsedThisMonth: 0,
        maxContractsPerMonth: 3,
        expiresAt: null,
      },
    });
  });
});

describe("Client CRUD", () => {
  it("should add a client", () => {
    const { addClient } = useStore.getState();
    const client = addClient({
      name: "Alice",
      email: "alice@example.com",
      phone: "555-0101",
      company: "Acme",
      address: "456 Oak Ave",
      notes: "VIP client",
    });

    expect(client.id).toBeDefined();
    expect(client.name).toBe("Alice");
    expect(client.status).toBe("lead");
    expect(useStore.getState().clients).toHaveLength(1);
  });

  it("should update a client", () => {
    const { addClient, updateClient } = useStore.getState();
    const client = addClient({
      name: "Bob",
      email: "bob@example.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });

    updateClient(client.id, { name: "Robert", status: "active" });
    const updated = useStore.getState().clients[0];
    expect(updated.name).toBe("Robert");
    expect(updated.status).toBe("active");
  });

  it("should delete a client", () => {
    const { addClient, deleteClient } = useStore.getState();
    const client = addClient({
      name: "Charlie",
      email: "charlie@example.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });

    deleteClient(client.id);
    expect(useStore.getState().clients).toHaveLength(0);
  });
});

describe("Quote CRUD", () => {
  it("should add a quote with calculated totals", () => {
    const { addClient, addQuote } = useStore.getState();
    const client = addClient({
      name: "Diana",
      email: "diana@example.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });

    const quote = addQuote({
      clientId: client.id,
      title: "Test Quote",
      description: "Testing",
      lineItems: [
        { id: "1", description: "Item 1", quantity: 2, unitPrice: 100, total: 200 },
        { id: "2", description: "Item 2", quantity: 1, unitPrice: 300, total: 300 },
      ],
      taxRate: 10,
      status: "draft",
      validUntil: new Date().toISOString(),
      notes: "",
    });

    expect(quote.subtotal).toBe(500);
    expect(quote.taxAmount).toBe(50);
    expect(quote.total).toBe(550);
    expect(quote.quoteNumber).toMatch(/^QT-\d{4}-\d{4}$/);
  });

  it("should delete a quote", () => {
    const { addClient, addQuote, deleteQuote } = useStore.getState();
    const client = addClient({
      name: "Test",
      email: "t@t.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });
    const quote = addQuote({
      clientId: client.id,
      title: "Q",
      description: "",
      lineItems: [],
      taxRate: 0,
      status: "draft",
      validUntil: new Date().toISOString(),
      notes: "",
    });
    deleteQuote(quote.id);
    expect(useStore.getState().quotes).toHaveLength(0);
  });
});

describe("Contract CRUD", () => {
  it("should add a contract and increment usage", () => {
    const { addClient, addContract } = useStore.getState();
    const client = addClient({
      name: "Eve",
      email: "eve@example.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });

    const contract = addContract({
      clientId: client.id,
      quoteId: null,
      title: "Test Contract",
      description: "Testing",
      scope: "All work",
      terms: "Standard terms",
      totalAmount: 1000,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: "draft",
      signedAt: null,
    });

    expect(contract).not.toBeNull();
    expect(contract!.contractNumber).toMatch(/^CT-\d{4}-\d{4}$/);
    expect(useStore.getState().subscription.contractsUsedThisMonth).toBe(1);
  });

  it("should reject contract when free plan limit reached", () => {
    const { addClient, addContract, setState } = useStore.getState();
    useStore.setState({
      subscription: {
        plan: "free",
        contractsUsedThisMonth: 3,
        maxContractsPerMonth: 3,
        expiresAt: null,
      },
    });

    const client = addClient({
      name: "Frank",
      email: "frank@example.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });

    const contract = useStore.getState().addContract({
      clientId: client.id,
      quoteId: null,
      title: "Over Limit",
      description: "",
      scope: "",
      terms: "",
      totalAmount: 500,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: "draft",
      signedAt: null,
    });

    expect(contract).toBeNull();
  });
});

describe("Payment", () => {
  it("should create a Stripe payment from a contract", () => {
    const { addClient, addContract, addPayment } = useStore.getState();
    const client = addClient({
      name: "Grace",
      email: "grace@example.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });

    const contract = addContract({
      clientId: client.id,
      quoteId: null,
      title: "Payment Test",
      description: "",
      scope: "",
      terms: "",
      totalAmount: 750,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: "signed",
      signedAt: new Date().toISOString(),
    });

    const payment = addPayment(contract!.id, "stripe");
    expect(payment.amount).toBe(750);
    expect(payment.method).toBe("stripe");
    expect(payment.paymentLink).toContain("stripe.com");
    expect(payment.status).toBe("pending");
  });

  it("should mark a payment as paid", () => {
    const { addClient, addContract, addPayment, markPaymentPaid } = useStore.getState();
    const client = addClient({
      name: "Hank",
      email: "hank@example.com",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });

    const contract = addContract({
      clientId: client.id,
      quoteId: null,
      title: "Paid Test",
      description: "",
      scope: "",
      terms: "",
      totalAmount: 200,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: "signed",
      signedAt: new Date().toISOString(),
    });

    const payment = addPayment(contract!.id, "paypal");
    markPaymentPaid(payment.id);

    const updated = useStore.getState().payments.find((p) => p.id === payment.id);
    expect(updated!.status).toBe("paid");
    expect(updated!.paidAt).toBeDefined();
  });
});

describe("Subscription", () => {
  it("should upgrade plan", () => {
    const { upgradePlan } = useStore.getState();
    upgradePlan("pro");
    const sub = useStore.getState().subscription;
    expect(sub.plan).toBe("pro");
    expect(sub.maxContractsPerMonth).toBe(Infinity);
    expect(sub.expiresAt).toBeDefined();
  });

  it("should allow unlimited contracts on pro plan", () => {
    const { upgradePlan, addClient, canCreateContract } = useStore.getState();
    upgradePlan("pro");

    useStore.setState((state) => ({
      subscription: { ...state.subscription, contractsUsedThisMonth: 100 },
    }));

    expect(useStore.getState().canCreateContract()).toBe(true);
  });
});
