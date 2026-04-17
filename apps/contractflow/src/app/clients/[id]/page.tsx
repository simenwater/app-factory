/**
 * @fileoverview 客户详情页面
 */

"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useState } from "react";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getClient, updateClient, deleteClient, quotes, contracts, payments, settings } = useStore();
  const client = getClient(id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(client || { name: "", email: "", phone: "", company: "", address: "", notes: "" });

  if (!client) {
    return (
      <div className="px-4 py-6">
        <p className="text-text-muted dark:text-text-muted-dark">Client not found.</p>
        <Link href="/clients" className="text-primary text-sm mt-2 inline-block">Back to clients</Link>
      </div>
    );
  }

  const clientQuotes = quotes.filter((q) => q.clientId === id);
  const clientContracts = contracts.filter((c) => c.clientId === id);
  const clientPayments = payments.filter((p) => p.clientId === id);
  const totalPaid = clientPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  const handleSave = () => {
    updateClient(id, form);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Delete this client? This cannot be undone.")) {
      deleteClient(id);
      router.push("/clients");
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/clients" className="p-1.5 rounded-lg hover:bg-surface dark:hover:bg-surface-dark">
            <ArrowLeft className="w-5 h-5 text-text dark:text-text-dark" />
          </Link>
          <h1 className="text-xl font-bold text-text dark:text-text-dark">{client.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditing(!editing)} className="p-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark">
            <Edit3 className="w-4 h-4 text-text-muted" />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4 text-danger" />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 mb-6">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-3">
              <StatusBadge status={client.status} />
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Added {formatDate(client.createdAt)}
              </span>
            </div>
            {client.company && <p className="text-sm text-text dark:text-text-dark mb-1">{client.company}</p>}
            <p className="text-sm text-text-muted dark:text-text-muted-dark">{client.email}</p>
            {client.phone && <p className="text-sm text-text-muted dark:text-text-muted-dark">{client.phone}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-center">
              <p className="text-lg font-bold text-text dark:text-text-dark">{clientQuotes.length}</p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">Quotes</p>
            </div>
            <div className="p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-center">
              <p className="text-lg font-bold text-text dark:text-text-dark">{clientContracts.length}</p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">Contracts</p>
            </div>
            <div className="p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-center">
              <p className="text-lg font-bold text-text dark:text-text-dark">{formatCurrency(totalPaid, settings.currency)}</p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">Paid</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="space-y-2">
        <Link
          href={`/quotes/new?clientId=${id}`}
          className="block p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm font-medium text-primary hover:border-primary/30 transition-colors text-center"
        >
          Create Quote for {client.name}
        </Link>
        <Link
          href={`/contracts/new?clientId=${id}`}
          className="block p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm font-medium text-primary hover:border-primary/30 transition-colors text-center"
        >
          Create Contract for {client.name}
        </Link>
      </div>
    </div>
  );
}
