import { useStore } from "@/store/useStore";
import type { Job, Invoice, Customer } from "@/types";

/**
 * @description 重置 store 到初始状态以确保测试隔离
 */
function resetStore() {
  useStore.setState({
    jobs: [],
    invoices: [],
    customers: [],
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
    },
  });
}

const mockCustomer: Customer = {
  id: "cust-1",
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0100",
  address: "123 Main St",
  createdAt: new Date().toISOString(),
};

const mockJob: Job = {
  id: "job-1",
  title: "Fix Plumbing",
  description: "Repair kitchen sink",
  customer: mockCustomer,
  location: "123 Main St",
  status: "scheduled",
  scheduledDate: new Date().toISOString().split("T")[0],
  scheduledTime: "09:00",
  estimatedDuration: 60,
  price: 150,
  notes: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockInvoice: Invoice = {
  id: "inv-1",
  invoiceNumber: "INV-202503-0001",
  jobId: "job-1",
  customer: mockCustomer,
  items: [
    { id: "item-1", description: "Plumbing Repair", quantity: 1, unitPrice: 150 },
  ],
  subtotal: 150,
  tax: 0,
  total: 150,
  invoiceStatus: "draft",
  paymentStatus: "unpaid",
  dueDate: "2025-04-15",
  paidAmount: 0,
  notes: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("Store - Jobs", () => {
  beforeEach(resetStore);

  it("should add a job", () => {
    useStore.getState().addJob(mockJob);
    expect(useStore.getState().jobs).toHaveLength(1);
    expect(useStore.getState().jobs[0].title).toBe("Fix Plumbing");
  });

  it("should update a job status", () => {
    useStore.getState().addJob(mockJob);
    useStore.getState().updateJob("job-1", { status: "completed" });
    expect(useStore.getState().jobs[0].status).toBe("completed");
  });

  it("should delete a job", () => {
    useStore.getState().addJob(mockJob);
    useStore.getState().deleteJob("job-1");
    expect(useStore.getState().jobs).toHaveLength(0);
  });
});

describe("Store - Invoices", () => {
  beforeEach(resetStore);

  it("should add an invoice", () => {
    useStore.getState().addInvoice(mockInvoice);
    expect(useStore.getState().invoices).toHaveLength(1);
    expect(useStore.getState().invoices[0].total).toBe(150);
  });

  it("should update invoice payment status", () => {
    useStore.getState().addInvoice(mockInvoice);
    useStore.getState().updateInvoice("inv-1", {
      paymentStatus: "paid",
      paidAmount: 150,
    });
    const inv = useStore.getState().invoices[0];
    expect(inv.paymentStatus).toBe("paid");
    expect(inv.paidAmount).toBe(150);
  });

  it("should delete an invoice", () => {
    useStore.getState().addInvoice(mockInvoice);
    useStore.getState().deleteInvoice("inv-1");
    expect(useStore.getState().invoices).toHaveLength(0);
  });
});

describe("Store - Customers", () => {
  beforeEach(resetStore);

  it("should add a customer", () => {
    useStore.getState().addCustomer(mockCustomer);
    expect(useStore.getState().customers).toHaveLength(1);
  });

  it("should update a customer", () => {
    useStore.getState().addCustomer(mockCustomer);
    useStore.getState().updateCustomer("cust-1", { name: "Jane Doe" });
    expect(useStore.getState().customers[0].name).toBe("Jane Doe");
  });
});

describe("Store - Settings", () => {
  beforeEach(resetStore);

  it("should update settings", () => {
    useStore.getState().updateSettings({ businessName: "My Plumbing Co" });
    expect(useStore.getState().settings.businessName).toBe("My Plumbing Co");
  });

  it("should toggle dark mode", () => {
    useStore.getState().updateSettings({ darkMode: true });
    expect(useStore.getState().settings.darkMode).toBe(true);
  });

  it("should set subscription", () => {
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().settings.subscription).toBe("pro");
  });
});

describe("Store - Free Tier Limit", () => {
  beforeEach(resetStore);

  it("should return false when under limit", () => {
    expect(useStore.getState().isFreeLimitReached()).toBe(false);
  });

  it("should return true when 5 jobs created this month", () => {
    for (let i = 0; i < 5; i++) {
      useStore.getState().addJob({
        ...mockJob,
        id: `job-${i}`,
        createdAt: new Date().toISOString(),
      });
    }
    expect(useStore.getState().isFreeLimitReached()).toBe(true);
  });

  it("should return false for pro users regardless of job count", () => {
    useStore.getState().setSubscription("pro");
    for (let i = 0; i < 10; i++) {
      useStore.getState().addJob({
        ...mockJob,
        id: `job-${i}`,
        createdAt: new Date().toISOString(),
      });
    }
    expect(useStore.getState().isFreeLimitReached()).toBe(false);
  });
});
