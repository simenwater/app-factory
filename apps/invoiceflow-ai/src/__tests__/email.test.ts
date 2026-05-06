/**
 * @fileoverview 邮件模块单元测试
 */

import { generateReminderEmail, isOverdue, daysUntilDue } from "@/lib/email";

describe("generateReminderEmail", () => {
  const baseParams = {
    recipientName: "John Doe",
    senderName: "Jane Smith",
    invoiceNumber: "INV-202601-0001",
    amount: 1500,
    currency: "USD",
    dueDate: "2026-02-15",
  };

  it("should generate initial invoice email", () => {
    const { subject, html } = generateReminderEmail({
      ...baseParams,
      type: "initial",
    });
    expect(subject).toContain("INV-202601-0001");
    expect(subject).toContain("Jane Smith");
    expect(html).toContain("John Doe");
    expect(html).toContain("$1,500.00");
  });

  it("should generate followup reminder email", () => {
    const { subject, html } = generateReminderEmail({
      ...baseParams,
      type: "followup",
    });
    expect(subject).toContain("Reminder");
    expect(html).toContain("friendly reminder");
  });

  it("should generate overdue email", () => {
    const { subject, html } = generateReminderEmail({
      ...baseParams,
      type: "overdue",
    });
    expect(subject).toContain("Overdue");
    expect(html).toContain("overdue");
  });

  it("should format amount with correct currency", () => {
    const { html } = generateReminderEmail({
      ...baseParams,
      currency: "EUR",
      amount: 2500,
      type: "initial",
    });
    expect(html).toContain("€2,500.00");
  });
});

describe("isOverdue", () => {
  it("should return true for past dates", () => {
    expect(isOverdue("2020-01-01")).toBe(true);
  });

  it("should return false for future dates", () => {
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    expect(isOverdue(futureDate)).toBe(false);
  });
});

describe("daysUntilDue", () => {
  it("should return positive number for future dates", () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const days = daysUntilDue(futureDate);
    expect(days).toBeGreaterThan(0);
    expect(days).toBeLessThanOrEqual(11);
  });

  it("should return negative number for past dates", () => {
    const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const days = daysUntilDue(pastDate);
    expect(days).toBeLessThan(0);
  });
});
