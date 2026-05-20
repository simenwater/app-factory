"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { generateId, formatDate, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import type { Client } from "@/types";

/**
 * @description 客户 CRM 列表页面
 */
export default function ClientsPage() {
  const { clients, addClient, quotes, settings } = useStore();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const filtered = clients
    .filter((c) => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        (c.company?.toLowerCase().includes(lower) ?? false)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  /**
   * @description 获取客户的总收入
   */
  const getClientRevenue = (clientId: string) => {
    return quotes
      .filter((q) => q.client.id === clientId && q.paymentStatus === "paid")
      .reduce((sum, q) => sum + q.paidAmount, 0);
  };

  /**
   * @description 获取客户的报价数量
   */
  const getClientQuoteCount = (clientId: string) => {
    return quotes.filter((q) => q.client.id === clientId).length;
  };

  /**
   * @description 添加新客户
   */
  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return;

    const client: Client = {
      id: generateId(),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      company: newClient.company,
      notes: newClient.notes,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addClient(client);
    setNewClient({ name: "", email: "", phone: "", company: "", notes: "" });
    setShowAddModal(false);
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark"
        />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
        />
      </div>

      {/* Client List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add your first client to start creating quotes"
          action={
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Add Client
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium">{client.name}</h3>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {getClientQuoteCount(client.id)} quotes
                </span>
              </div>
              {client.company && (
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {client.company}
                </p>
              )}
              <div className="mt-1 flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
                <span>{client.email}</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(getClientRevenue(client.id), settings.currency)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl dark:bg-surface-dark">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">New Client</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-muted dark:text-text-muted-dark"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name *"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
              <input
                type="email"
                placeholder="Email *"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({ ...newClient, phone: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
              <input
                type="text"
                placeholder="Company"
                value={newClient.company}
                onChange={(e) =>
                  setNewClient({ ...newClient, company: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
              <textarea
                placeholder="Notes"
                value={newClient.notes}
                onChange={(e) =>
                  setNewClient({ ...newClient, notes: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
              <button
                onClick={handleAddClient}
                disabled={!newClient.name || !newClient.email}
                className="w-full rounded-xl bg-primary py-2.5 font-semibold text-white disabled:opacity-50"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
