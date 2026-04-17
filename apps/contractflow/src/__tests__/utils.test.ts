/**
 * @fileoverview 工具函数单元测试
 */

import {
  generateId,
  generateQuoteNumber,
  generateContractNumber,
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  generateStripePaymentLink,
  generatePayPalPaymentLink,
  calculateDashboardStats,
  shouldSendReminder,
  cn,
  isOverdue,
  daysUntilDue,
} from "@/lib/utils";
import type { QuoteLineItem, Payment, Client, Quote, Contract } from "@/types";

describe("generateId", () => {
  it("should generate a valid UUID", () => {
    const id = generateId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("should generate unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("generateQuoteNumber", () => {
  it("should generate formatted quote number", () => {
    const year = new Date().getFullYear();
    expect(generateQuoteNumber(0)).toBe(`QT-${year}-0001`);
    expect(generateQuoteNumber(9)).toBe(`QT-${year}-0010`);
    expect(generateQuoteNumber(99)).toBe(`QT-${year}-0100`);
  });
});

describe("generateContractNumber", () => {
  it("should generate formatted contract number", () => {
    const year = new Date().getFullYear();
    expect(generateContractNumber(0)).toBe(`CT-${year}-0001`);
    expect(generateContractNumber(42)).toBe(`CT-${year}-0043`);
  });
});

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    expect(formatCurrency(1000, "USD")).toBe("$1,000.00");
    expect(formatCurrency(0, "USD")).toBe("$0.00");
    expect(formatCurrency(99.9, "USD")).toBe("$99.90");
  });

  it("should format EUR correctly", () => {
    const formatted = formatCurrency(1000, "EUR");
    expect(formatted).toContain("1,000.00");
  });
});

describe("calculateSubtotal", () => {
  it("should calculate subtotal from line items", () => {
    const items: QuoteLineItem[] = [
      { id: "1", description: "Design", quantity: 1, unitPrice: 500, total: 500 },
      { id: "2", description: "Development", quantity: 10, unitPrice: 100, total: 1000 },
    ];
    expect(calculateSubtotal(items)).toBe(1500);
  });

  it("should return 0 for empty items", () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe("calculateTax", () => {
  it("should calculate tax amount", () => {
    expect(calculateTax(1000, 10)).toBe(100);
    expect(calculateTax(1000, 0)).toBe(0);
    expect(calculateTax(500, 8.5)).toBe(42.5);
  });
});

describe("generateStripePaymentLink", () => {
  it("should generate valid Stripe link", () => {
    const link = generateStripePaymentLink(100, "USD", "Test Payment");
    expect(link).toContain("checkout.stripe.com");
    expect(link).toContain("amount=10000");
    expect(link).toContain("currency=USD");
  });
});

describe("generatePayPalPaymentLink", () => {
  it("should generate valid PayPal link", () => {
    const link = generatePayPalPaymentLink(50, "USD", "test@example.com");
    expect(link).toContain("paypal.com");
    expect(link).toContain("amount=50.00");
    expect(link).toContain("test%40example.com");
  });
});

describe("calculateDashboardStats", () => {
  it("should compute stats correctly", () => {
    const clients: Client[] = [
      { id: "1", name: "A", email: "a@b.c", phone: "", company: "", address: "", status: "active", notes: "", createdAt: "", updatedAt: "" },
    ];
    const quotes: Quote[] = [
      { id: "1", quoteNumber: "Q1", clientId: "1", title: "T", description: "", lineItems: [], subtotal: 0, taxRate: 0, taxAmount: 0, total: 100, status: "sent", validUntil: "", notes: "", createdAt: "", updatedAt: "" },
    ];
    const contracts: Contract[] = [
      { id: "1", contractNumber: "C1", quoteId: null, clientId: "1", title: "T", description: "", scope: "", terms: "", totalAmount: 100, startDate: "", endDate: "", status: "signed", signedAt: null, createdAt: "", updatedAt: "" },
    ];
    const payments: Payment[] = [
      { id: "1", contractId: "1", clientId: "1", amount: 100, currency: "USD", method: "stripe", paymentLink: "", status: "paid", dueDate: "", paidAt: "", reminderSentAt: null, reminderCount: 0, createdAt: "", updatedAt: "" },
      { id: "2", contractId: "1", clientId: "1", amount: 50, currency: "USD", method: "stripe", paymentLink: "", status: "pending", dueDate: "", paidAt: null, reminderSentAt: null, reminderCount: 0, createdAt: "", updatedAt: "" },
    ];

    const stats = calculateDashboardStats(clients, quotes, contracts, payments);
    expect(stats.totalClients).toBe(1);
    expect(stats.activeQuotes).toBe(1);
    expect(stats.activeContracts).toBe(1);
    expect(stats.pendingPayments).toBe(1);
    expect(stats.totalRevenue).toBe(100);
  });
});

describe("shouldSendReminder", () => {
  it("should return false for paid payments", () => {
    const payment: Payment = {
      id: "1", contractId: "1", clientId: "1", amount: 100, currency: "USD",
      method: "stripe", paymentLink: "", status: "paid",
      dueDate: new Date().toISOString(), paidAt: new Date().toISOString(),
      reminderSentAt: null, reminderCount: 0, createdAt: "", updatedAt: "",
    };
    expect(shouldSendReminder(payment, 7)).toBe(false);
  });

  it("should return true for overdue payments with no reminder", () => {
    const past = new Date(Date.now() - 86400000 * 10).toISOString();
    const payment: Payment = {
      id: "1", contractId: "1", clientId: "1", amount: 100, currency: "USD",
      method: "stripe", paymentLink: "", status: "pending",
      dueDate: past, paidAt: null,
      reminderSentAt: null, reminderCount: 0, createdAt: "", updatedAt: "",
    };
    expect(shouldSendReminder(payment, 7)).toBe(true);
  });
});

describe("cn", () => {
  it("should join class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("should filter falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("isOverdue", () => {
  it("should return true for past dates", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(isOverdue(past)).toBe(true);
  });

  it("should return false for future dates", () => {
    const future = new Date(Date.now() + 86400000 * 30).toISOString();
    expect(isOverdue(future)).toBe(false);
  });
});
