"use client";

import { useState } from "react";
import { Plus, Trash2, FileDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { Invoice, InvoiceItem, ContactInfo, OCRResult } from "@/types";
import { calculateTotals, generateInvoiceNumber } from "@/lib/pdf";

interface InvoiceFormProps {
  ocrData?: OCRResult | null;
  onGenerate: (invoice: Invoice) => void;
}

/**
 * @description 发票创建/编辑表单组件
 */
export function InvoiceForm({ ocrData, onGenerate }: InvoiceFormProps) {
  const [from, setFrom] = useState<ContactInfo>({
    name: "",
    email: "",
    address: "",
    taxId: "",
  });

  const [to, setTo] = useState<ContactInfo>({
    name: ocrData?.vendorName || "",
    email: "",
    address: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    ocrData?.items?.length
      ? ocrData.items.map((item) => ({
          id: uuidv4(),
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        }))
      : [{ id: uuidv4(), description: "", quantity: 1, unitPrice: 0, total: 0 }]
  );

  const [taxRate, setTaxRate] = useState(0);
  const [currency, setCurrency] = useState(ocrData?.currency || "USD");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  const addItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { subtotal, taxAmount, total } = calculateTotals(items, taxRate);

    const invoice: Invoice = {
      id: uuidv4(),
      invoiceNumber: generateInvoiceNumber(),
      from,
      to,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      currency,
      status: "draft",
      createdAt: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      notes,
      reminders: [],
    };

    onGenerate(invoice);
  };

  const totals = calculateTotals(items, taxRate);

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <FileDown className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="font-semibold text-[var(--foreground)]">Create Invoice</h3>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[var(--muted-foreground)]">From (You)</h4>
          <input
            className="input"
            placeholder="Your Name / Company"
            value={from.name}
            onChange={(e) => setFrom({ ...from, name: e.target.value })}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="your@email.com"
            value={from.email}
            onChange={(e) => setFrom({ ...from, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Address (optional)"
            value={from.address}
            onChange={(e) => setFrom({ ...from, address: e.target.value })}
          />
          <input
            className="input"
            placeholder="Tax ID (optional)"
            value={from.taxId}
            onChange={(e) => setFrom({ ...from, taxId: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[var(--muted-foreground)]">To (Client)</h4>
          <input
            className="input"
            placeholder="Client Name / Company"
            value={to.name}
            onChange={(e) => setTo({ ...to, name: e.target.value })}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="client@email.com"
            value={to.email}
            onChange={(e) => setTo({ ...to, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Address (optional)"
            value={to.address}
            onChange={(e) => setTo({ ...to, address: e.target.value })}
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[var(--muted-foreground)]">Items</h4>
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 items-start">
            <input
              className="input flex-1"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              required
            />
            <input
              className="input w-20"
              type="number"
              min="1"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
              required
            />
            <input
              className="input w-28"
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={item.unitPrice || ""}
              onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
              required
            />
            <span className="input w-28 text-right bg-transparent border-none">
              {currency} {(item.quantity * item.unitPrice).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="p-2 text-[var(--destructive)] hover:bg-[var(--secondary)] rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="btn-secondary flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Settings Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-[var(--muted-foreground)]">Currency</label>
          <select
            className="input mt-1"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)]">Tax Rate (%)</label>
          <input
            className="input mt-1"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)]">Due Date</label>
          <input
            className="input mt-1"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs text-[var(--muted-foreground)]">Notes (optional)</label>
        <textarea
          className="input mt-1 min-h-[60px] resize-y"
          placeholder="Payment terms, bank details, thank you note..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Totals */}
      <div className="bg-[var(--muted)] rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
          <span>Subtotal</span>
          <span>{currency} {totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
          <span>Tax ({taxRate}%)</span>
          <span>{currency} {totals.taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-[var(--foreground)] pt-2 border-t border-[var(--border)]">
          <span>Total</span>
          <span>{currency} {totals.total.toFixed(2)}</span>
        </div>
      </div>

      <button type="submit" className="btn-primary w-full text-center">
        Generate Invoice PDF
      </button>
    </form>
  );
}
