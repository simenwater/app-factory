/**
 * @fileoverview 客户列表页面
 */

"use client";

import { useStore } from "@/store/useStore";
import { Users, Plus, Search } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";

export default function ClientsPage() {
  const { clients } = useStore();
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">Clients</h1>
        <Link
          href="/clients/new"
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </Link>
      </div>

      {clients.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-text-muted-dark" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add your first client to start creating quotes and contracts."
          action={{ label: "Add Client", href: "/clients/new" }}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="block p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-text dark:text-text-dark">{client.name}</h3>
                <StatusBadge status={client.status} />
              </div>
              {client.company && (
                <p className="text-sm text-text-muted dark:text-text-muted-dark">{client.company}</p>
              )}
              <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">{client.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
