"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { generateId } from "@/lib/utils";
import type { Job, Customer, JobStatus } from "@/types";

/**
 * @description 新建工作任务页
 */
export default function NewJobPage() {
  const router = useRouter();
  const { addJob, addCustomer, customers, isFreeLimitReached, settings } =
    useStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    location: "",
    scheduledDate: "",
    scheduledTime: "",
    estimatedDuration: 60,
    price: 0,
    notes: "",
    status: "scheduled" as JobStatus,
    existingCustomerId: "",
  });

  const limitReached = isFreeLimitReached();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (limitReached) {
      alert(
        "You've reached the free tier limit (5 jobs/month). Upgrade to Pro for unlimited jobs!"
      );
      return;
    }

    let customer: Customer;

    if (form.existingCustomerId) {
      customer = customers.find((c) => c.id === form.existingCustomerId)!;
    } else {
      customer = {
        id: generateId(),
        name: form.customerName,
        email: form.customerEmail,
        phone: form.customerPhone,
        address: form.customerAddress,
        createdAt: new Date().toISOString(),
      };
      addCustomer(customer);
    }

    const now = new Date().toISOString();
    const job: Job = {
      id: generateId(),
      title: form.title,
      description: form.description,
      customer,
      location: form.location || customer.address,
      status: form.status,
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      estimatedDuration: form.estimatedDuration,
      price: form.price,
      notes: form.notes,
      createdAt: now,
      updatedAt: now,
    };

    addJob(job);
    router.push(`/jobs/${job.id}`);
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectExistingCustomer = (id: string) => {
    const c = customers.find((c) => c.id === id);
    if (c) {
      setForm((prev) => ({
        ...prev,
        existingCustomerId: id,
        customerName: c.name,
        customerEmail: c.email,
        customerPhone: c.phone,
        customerAddress: c.address,
        location: c.address,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        existingCustomerId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
      }));
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark";

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/jobs"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">New Job</h1>
      </div>

      {limitReached && (
        <div className="mb-4 rounded-xl bg-orange-50 p-4 text-sm text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
          <strong>Free tier limit reached.</strong> You&apos;ve used 5 jobs this
          month.{" "}
          <Link href="/settings" className="font-medium underline">
            Upgrade to Pro
          </Link>{" "}
          for unlimited access.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job Info */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Job Details
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Job Title *"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={inputClass}
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Location / Address"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        {/* Customer */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Customer
          </h2>
          {customers.length > 0 && (
            <select
              value={form.existingCustomerId}
              onChange={(e) => selectExistingCustomer(e.target.value)}
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
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              className={inputClass}
              disabled={!!form.existingCustomerId}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.customerEmail}
              onChange={(e) => updateField("customerEmail", e.target.value)}
              className={inputClass}
              disabled={!!form.existingCustomerId}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="tel"
                placeholder="Phone"
                value={form.customerPhone}
                onChange={(e) => updateField("customerPhone", e.target.value)}
                className={inputClass}
                disabled={!!form.existingCustomerId}
              />
              <input
                type="text"
                placeholder="Address"
                value={form.customerAddress}
                onChange={(e) =>
                  updateField("customerAddress", e.target.value)
                }
                className={inputClass}
                disabled={!!form.existingCustomerId}
              />
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Schedule
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              required
              value={form.scheduledDate}
              onChange={(e) => updateField("scheduledDate", e.target.value)}
              className={inputClass}
            />
            <input
              type="time"
              required
              value={form.scheduledTime}
              onChange={(e) => updateField("scheduledTime", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              min={15}
              step={15}
              value={form.estimatedDuration}
              onChange={(e) =>
                updateField("estimatedDuration", Number(e.target.value))
              }
              className={inputClass}
            />
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Pricing
          </h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              {settings.currency}
            </span>
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={form.price || ""}
              onChange={(e) => updateField("price", Number(e.target.value))}
              className={`${inputClass} pl-14`}
            />
          </div>
        </section>

        {/* Notes */}
        <textarea
          placeholder="Additional notes..."
          rows={2}
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          className={inputClass}
        />

        <button
          type="submit"
          disabled={limitReached}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}
