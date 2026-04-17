/**
 * @fileoverview 新建客户页面
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const { addClient } = useStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(form);
    router.push("/clients");
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/clients" className="p-1.5 rounded-lg hover:bg-surface dark:hover:bg-surface-dark">
          <ArrowLeft className="w-5 h-5 text-text dark:text-text-dark" />
        </Link>
        <h1 className="text-xl font-bold text-text dark:text-text-dark">New Client</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="+1 555 0100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={2}
            placeholder="123 Main St, City, State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
            placeholder="Internal notes about this client..."
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          Add Client
        </button>
      </form>
    </div>
  );
}
