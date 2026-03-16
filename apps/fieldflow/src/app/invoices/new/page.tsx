"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { generateId, generateInvoiceNumber } from "@/lib/utils";
import type { Invoice, LineItem, Customer } from "@/types";

/**
 * @description 行项目编辑组件
 */
function LineItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: LineItem;
  onChange: (updated: LineItem) => void;
  onRemove: () => void;
}) {
  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark";

  return (
    <div className="flex items-start gap-2">
      <input
        type="text"
        placeholder="Description"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        className={`${inputClass} flex-1`}
      />
      <input
        type="number"
        placeholder="Qty"
        min={1}
        value={item.quantity}
        onChange={(e) =>
          onChange({ ...item, quantity: Number(e.target.value) })
        }
        className={`${inputClass} w-16`}
      />
      <input
        type="number"
        placeholder="Price"
        min={0}
        step={0.01}
        value={item.unitPrice}
        onChange={(e) =>
          onChange({ ...item, unitPrice: Number(e.target.value) })
        }
        className={`${inputClass} w-24`}
      />
      <button
        type="button"
        onClick={onRemove}
        className="mt-1.5 text-red-400 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

/**
 * @description 内部表单组件（使用 useSearchParams）
 */
function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const { jobs, customers, addInvoice, addCustomer, settings } = useStore();

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    existingId: "",
  });
  const [items, setItems] = useState<LineItem[]>([
    { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (jobId) {
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        setCustomerForm({
          name: job.customer.name,
          email: job.customer.email,
          phone: job.customer.phone,
          address: job.customer.address,
          existingId: job.customer.id,
        });
        setItems([
          {
            id: generateId(),
            description: job.title,
            quantity: 1,
            unitPrice: job.price,
          },
        ]);
      }
    }
    const due = new Date();
    due.setDate(due.getDate() + 30);
    setDueDate(due.toISOString().split("T")[0]);
  }, [jobId, jobs]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  const addLineItem = () => {
    setItems([
      ...items,
      { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const updateItem = (index: number, updated: LineItem) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let customer: Customer;
    if (customerForm.existingId) {
      customer = customers.find((c) => c.id === customerForm.existingId)!;
    } else {
      customer = {
        id: generateId(),
        name: customerForm.name,
        email: customerForm.email,
        phone: customerForm.phone,
        address: customerForm.address,
        createdAt: new Date().toISOString(),
      };
      addCustomer(customer);
    }

    const now = new Date().toISOString();
    const invoice: Invoice = {
      id: generateId(),
      invoiceNumber: generateInvoiceNumber(),
      jobId: jobId ?? undefined,
      customer,
      items,
      subtotal,
      tax,
      total,
      invoiceStatus: "draft",
      paymentStatus: "unpaid",
      dueDate,
      paidAmount: 0,
      notes,
      createdAt: now,
      updatedAt: now,
    };

    addInvoice(invoice);
    router.push(`/invoices/${invoice.id}`);
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Customer */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Customer
        </h2>
        {customers.length > 0 && (
          <select
            value={customerForm.existingId}
            onChange={(e) => {
              const c = customers.find((c) => c.id === e.target.value);
              if (c) {
                setCustomerForm({
                  existingId: c.id,
                  name: c.name,
                  email: c.email,
                  phone: c.phone,
                  address: c.address,
                });
              } else {
                setCustomerForm({
                  existingId: "",
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                });
              }
            }}
            className={`${inputClass} mb-3`}
          >
            <option value="">New Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Customer Name *"
            required
            value={customerForm.name}
            onChange={(e) =>
              setCustomerForm({ ...customerForm, name: e.target.value })
            }
            className={inputClass}
            disabled={!!customerForm.existingId}
          />
          <input
            type="email"
            placeholder="Email"
            value={customerForm.email}
            onChange={(e) =>
              setCustomerForm({ ...customerForm, email: e.target.value })
            }
            className={inputClass}
            disabled={!!customerForm.existingId}
          />
        </div>
      </section>

      {/* Line Items */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Items
        </h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <LineItemRow
              key={item.id}
              item={item}
              onChange={(updated) => updateItem(i, updated)}
              onRemove={() => removeItem(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addLineItem}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Plus size={14} />
          Add Item
        </button>
      </section>

      {/* Summary */}
      <section className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted dark:text-text-muted-dark">
              Subtotal
            </span>
            <span>
              {settings.currency} {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted dark:text-text-muted-dark">
              Tax ({settings.taxRate}%)
            </span>
            <span>
              {settings.currency} {tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold dark:border-border-dark">
            <span>Total</span>
            <span className="text-primary">
              {settings.currency} {total.toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      {/* Due Date & Notes */}
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
            Due Date
          </label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <textarea
          placeholder="Notes (optional)"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
      >
        Create Invoice
      </button>
    </form>
  );
}

/**
 * @description 新建发票页
 */
export default function NewInvoicePage() {
  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/invoices"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">New Invoice</h1>
      </div>
      <Suspense fallback={<div className="p-4 text-center text-sm text-text-muted">Loading...</div>}>
        <NewInvoiceForm />
      </Suspense>
    </div>
  );
}
