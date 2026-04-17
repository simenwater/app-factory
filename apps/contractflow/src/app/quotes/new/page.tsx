/**
 * @fileoverview 新建报价单页面
 */

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { generateId, formatCurrency } from "@/lib/utils";
import type { QuoteLineItem } from "@/types";
import { addDays } from "date-fns";

function NewQuoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clients, addQuote, settings } = useStore();
  const preselectedClientId = searchParams.get("clientId") || "";

  const [form, setForm] = useState({
    clientId: preselectedClientId,
    title: "",
    description: "",
    notes: "",
    taxRate: settings.taxRate,
    validUntil: addDays(new Date(), 30).toISOString().split("T")[0],
  });

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([
    { id: generateId(), description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: generateId(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof QuoteLineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      })
    );
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * (form.taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemsWithTotals = lineItems.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));
    addQuote({
      ...form,
      lineItems: itemsWithTotals,
      status: "draft",
      validUntil: new Date(form.validUntil).toISOString(),
    });
    router.push("/quotes");
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/quotes" className="p-1.5 rounded-lg hover:bg-surface dark:hover:bg-surface-dark">
          <ArrowLeft className="w-5 h-5 text-text dark:text-text-dark" />
        </Link>
        <h1 className="text-xl font-bold text-text dark:text-text-dark">New Quote</h1>
      </div>

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
            placeholder="Website Redesign Project"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
            placeholder="Brief description of the project..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Valid Until</label>
          <input
            type="date"
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text dark:text-text-dark">Line Items</label>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-1 text-xs text-primary font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {lineItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted dark:text-text-muted-dark">Item {idx + 1}</span>
                  <button type="button" onClick={() => removeLineItem(item.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-danger" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark mb-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-text-muted dark:text-text-muted-dark">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-text-muted dark:text-text-muted-dark">Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-text-muted dark:text-text-muted-dark">Total</label>
                    <p className="px-3 py-2 text-sm font-medium text-text dark:text-text-dark">
                      {formatCurrency(item.quantity * item.unitPrice, settings.currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Tax Rate (%)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.taxRate}
            onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Totals */}
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-muted dark:text-text-muted-dark">Subtotal</span>
            <span className="text-text dark:text-text-dark">{formatCurrency(subtotal, settings.currency)}</span>
          </div>
          {form.taxRate > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted dark:text-text-muted-dark">Tax ({form.taxRate}%)</span>
              <span className="text-text dark:text-text-dark">{formatCurrency(taxAmount, settings.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold border-t border-border dark:border-border-dark pt-2 mt-2">
            <span className="text-text dark:text-text-dark">Total</span>
            <span className="text-primary">{formatCurrency(total, settings.currency)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={2}
            placeholder="Payment terms, additional notes..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          Create Quote
        </button>
      </form>
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 text-text-muted">Loading...</div>}>
      <NewQuoteForm />
    </Suspense>
  );
}
