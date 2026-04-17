/**
 * @fileoverview 新建合同页面
 */

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { addDays } from "date-fns";

function NewContractForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clients, addContract, getQuote, canCreateContract, subscription } = useStore();
  const quoteId = searchParams.get("quoteId") || "";
  const preselectedClientId = searchParams.get("clientId") || "";

  const quote = quoteId ? getQuote(quoteId) : null;

  const [form, setForm] = useState({
    clientId: quote?.clientId || preselectedClientId,
    quoteId: quoteId || null,
    title: quote?.title || "",
    description: quote?.description || "",
    scope: "",
    terms: "1. Payment is due within 30 days of invoice.\n2. Late payments incur a 1.5% monthly fee.\n3. Either party may terminate with 14 days written notice.\n4. All work remains property of provider until payment is received in full.",
    totalAmount: quote?.total || 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: addDays(new Date(), 30).toISOString().split("T")[0],
    status: "draft" as const,
    signedAt: null,
  });

  const canCreate = canCreateContract();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    const contract = addContract({
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    });
    if (contract) {
      router.push(`/contracts/${contract.id}`);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/contracts" className="p-1.5 rounded-lg hover:bg-surface dark:hover:bg-surface-dark">
          <ArrowLeft className="w-5 h-5 text-text dark:text-text-dark" />
        </Link>
        <h1 className="text-xl font-bold text-text dark:text-text-dark">New Contract</h1>
      </div>

      {!canCreate && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Free plan limit reached</p>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-500">
            You&apos;ve used {subscription.contractsUsedThisMonth}/{subscription.maxContractsPerMonth} contracts this month.{" "}
            <Link href="/settings" className="underline font-medium">Upgrade to Pro</Link> for unlimited contracts.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Client *</label>
          <select
            required
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Title *</label>
          <input
            required
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Website Redesign Contract"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
            placeholder="Project description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Scope of Work</label>
          <textarea
            value={form.scope}
            onChange={(e) => setForm({ ...form, scope: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={4}
            placeholder="Detailed scope of deliverables..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Terms & Conditions</label>
          <textarea
            value={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Total Amount *</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.totalAmount}
            onChange={(e) => setForm({ ...form, totalAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canCreate}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {canCreate ? "Create Contract" : "Upgrade to Create More"}
        </button>
      </form>
    </div>
  );
}

export default function NewContractPage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 text-text-muted">Loading...</div>}>
      <NewContractForm />
    </Suspense>
  );
}
