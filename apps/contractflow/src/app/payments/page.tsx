/**
 * @fileoverview 付款管理页面
 * 追踪付款状态、发送催款提醒、复制付款链接
 */

"use client";

import { useStore } from "@/store/useStore";
import { CreditCard, Copy, Bell, CheckCircle, Clock } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate, daysUntilDue, shouldSendReminder } from "@/lib/utils";
import { useState } from "react";

export default function PaymentsPage() {
  const { payments, getClient, getContract, markPaymentPaid, sendReminder, settings } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const sorted = [...payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleCopyLink = async (id: string, link: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMarkPaid = (id: string) => {
    if (confirm("Mark this payment as paid?")) {
      markPaymentPaid(id);
    }
  };

  const handleSendReminder = (id: string) => {
    sendReminder(id);
    alert("Reminder sent! (In production, this would send an email)");
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-text dark:text-text-dark mb-6">Payments</h1>

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Payment links are created from signed contracts. Create a contract first."
          action={{ label: "Go to Contracts", href: "/contracts" }}
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((payment) => {
            const client = getClient(payment.clientId);
            const contract = getContract(payment.contractId);
            const days = daysUntilDue(payment.dueDate);
            const needsReminder = shouldSendReminder(payment, settings.reminderIntervalDays);

            return (
              <div
                key={payment.id}
                className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      {client?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {contract?.contractNumber}
                    </p>
                  </div>
                  <StatusBadge status={payment.status} />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-text dark:text-text-dark">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-text-muted dark:text-text-muted-dark">
                    <Clock className="w-3.5 h-3.5" />
                    {payment.status === "paid" ? (
                      <span>Paid {formatDate(payment.paidAt!)}</span>
                    ) : days > 0 ? (
                      <span>Due in {days} days</span>
                    ) : (
                      <span className="text-danger font-medium">Overdue by {Math.abs(days)} days</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs mb-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-text-muted-dark capitalize">
                    {payment.method}
                  </span>
                  {payment.reminderCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                      {payment.reminderCount} reminder{payment.reminderCount > 1 ? "s" : ""} sent
                    </span>
                  )}
                </div>

                {payment.status !== "paid" && payment.status !== "cancelled" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyLink(payment.id, payment.paymentLink)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border dark:border-border-dark text-xs font-medium text-text dark:text-text-dark hover:border-primary/30 transition-colors"
                    >
                      {copiedId === payment.id ? (
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedId === payment.id ? "Copied!" : "Copy Link"}
                    </button>
                    {needsReminder && settings.autoReminderEnabled && (
                      <button
                        onClick={() => handleSendReminder(payment.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs font-medium text-amber-700 dark:text-amber-400"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Send Reminder
                      </button>
                    )}
                    <button
                      onClick={() => handleMarkPaid(payment.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-success/10 border border-success/20 text-xs font-medium text-success"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Paid
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
