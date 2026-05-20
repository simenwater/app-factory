"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import {
  generateId,
  generateQuoteNumber,
  calculateSubtotal,
  calculateTax,
  formatCurrency,
} from "@/lib/utils";
import { generateAIQuote } from "@/lib/ai";
import type { LineItem, Client, Quote } from "@/types";

/**
 * @description 新建报价单页面，支持 AI 自动生成
 */
export default function NewQuotePage() {
  const router = useRouter();
  const { clients, addClient, addQuote, settings, isFreeLimitReached } =
    useStore();

  const [serviceDescription, setServiceDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [showNewClient, setShowNewClient] = useState(false);
  const [items, setItems] = useState<LineItem[]>([
    { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [validDays, setValidDays] = useState(settings.defaultPaymentTerms);

  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, settings.taxRate);
  const total = subtotal + tax;

  /**
   * @description 使用 AI 自动生成报价
   */
  const handleAIGenerate = () => {
    if (!serviceDescription.trim()) return;

    const clientName =
      selectedClientId
        ? clients.find((c) => c.id === selectedClientId)?.name ?? "Client"
        : newClient.name || "Client";

    setIsGenerating(true);

    setTimeout(() => {
      const result = generateAIQuote(
        serviceDescription,
        clientName,
        settings.taxRate
      );
      setItems(result.items);
      setNotes(result.notes);
      setIsGenerating(false);
    }, 800);
  };

  /**
   * @description 添加行项目
   */
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  /**
   * @description 删除行项目
   */
  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * @description 更新行项目
   */
  const updateItem = (id: string, updates: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  /**
   * @description 提交保存报价单
   */
  const handleSubmit = () => {
    if (isFreeLimitReached()) return;

    let client: Client;
    if (selectedClientId) {
      const found = clients.find((c) => c.id === selectedClientId);
      if (!found) return;
      client = found;
    } else {
      if (!newClient.name || !newClient.email) return;
      client = {
        id: generateId(),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        company: newClient.company,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addClient(client);
    }

    const now = new Date().toISOString();
    const validUntil = new Date(
      Date.now() + validDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const quote: Quote = {
      id: generateId(),
      quoteNumber: generateQuoteNumber(),
      client,
      serviceDescription,
      items,
      subtotal,
      tax,
      total,
      quoteStatus: "draft",
      paymentStatus: "unpaid",
      validUntil,
      paidAmount: 0,
      notes,
      aiGenerated: isGenerating === false && notes.includes("Thank you"),
      createdAt: now,
      updatedAt: now,
    };

    addQuote(quote);
    router.push(`/quotes/${quote.id}`);
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-bold">New Quote</h1>
      </div>

      {/* Service Description + AI Generate */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium">
          Service Description
        </label>
        <textarea
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          placeholder="Describe the service you'll provide (e.g., 'Website redesign with 5 pages, modern UI, mobile responsive')"
          rows={3}
          className="w-full rounded-xl border border-border bg-surface p-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-surface-dark"
        />
        <button
          onClick={handleAIGenerate}
          disabled={!serviceDescription.trim() || isGenerating}
          className="mt-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-opacity disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {isGenerating ? "Generating..." : "AI Generate Quote"}
        </button>
      </div>

      {/* Client Selection */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium">Client</label>
        {!showNewClient ? (
          <div>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface p-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-surface-dark"
            >
              <option value="">Select a client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ""}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowNewClient(true)}
              className="mt-2 text-xs font-medium text-primary hover:underline"
            >
              + Add New Client
            </button>
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-border p-3 dark:border-border-dark">
            <input
              type="text"
              placeholder="Client Name *"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-surface p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
            />
            <input
              type="email"
              placeholder="Email *"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-surface p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-surface p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
            />
            <input
              type="text"
              placeholder="Company"
              value={newClient.company}
              onChange={(e) =>
                setNewClient({ ...newClient, company: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-surface p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
            />
            <button
              onClick={() => {
                setShowNewClient(false);
                setSelectedClientId("");
              }}
              className="text-xs text-text-muted hover:underline dark:text-text-muted-dark"
            >
              Cancel — Select existing client
            </button>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium">Line Items</label>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-border p-3 dark:border-border-dark"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  Item {idx + 1}
                </span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, { description: e.target.value })
                }
                className="mb-2 w-full rounded-lg border border-border bg-surface p-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-0.5 block text-xs text-text-muted dark:text-text-muted-dark">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, {
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface p-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-0.5 block text-xs text-text-muted dark:text-text-muted-dark">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, {
                        unitPrice: Math.max(
                          0,
                          parseFloat(e.target.value) || 0
                        ),
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface p-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-0.5 block text-xs text-text-muted dark:text-text-muted-dark">
                    Total
                  </label>
                  <p className="rounded-lg bg-gray-50 p-2 text-sm font-medium dark:bg-gray-800">
                    {formatCurrency(
                      item.quantity * item.unitPrice,
                      settings.currency
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted dark:text-text-muted-dark">
            Subtotal
          </span>
          <span>{formatCurrency(subtotal, settings.currency)}</span>
        </div>
        {settings.taxRate > 0 && (
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              Tax ({settings.taxRate}%)
            </span>
            <span>{formatCurrency(tax, settings.currency)}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-border pt-2 text-lg font-bold dark:border-border-dark">
          <span>Total</span>
          <span className="text-primary">
            {formatCurrency(total, settings.currency)}
          </span>
        </div>
      </div>

      {/* Validity */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium">
          Valid for (days)
        </label>
        <input
          type="number"
          min="1"
          value={validDays}
          onChange={(e) => setValidDays(parseInt(e.target.value) || 30)}
          className="w-full rounded-xl border border-border bg-surface p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
        />
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes for the client..."
          rows={4}
          className="w-full rounded-xl border border-border bg-surface p-3 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isFreeLimitReached()}
        className="mb-6 w-full rounded-xl bg-primary py-3 text-center font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isFreeLimitReached() ? "Free Limit Reached — Upgrade" : "Save Quote"}
      </button>
    </div>
  );
}
