/**
 * @fileoverview 合同列表页面
 */

"use client";

import { useStore } from "@/store/useStore";
import { FileCheck, Plus } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ContractsPage() {
  const { contracts, getClient, settings } = useStore();
  const sorted = [...contracts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">Contracts</h1>
        <Link
          href="/contracts/new"
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </Link>
      </div>

      {contracts.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No contracts yet"
          description="Create a contract to formalize your agreements and protect your work."
          action={{ label: "Create Contract", href: "/contracts/new" }}
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((contract) => {
            const client = getClient(contract.clientId);
            return (
              <Link
                key={contract.id}
                href={`/contracts/${contract.id}`}
                className="block p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-text-muted dark:text-text-muted-dark">
                    {contract.contractNumber}
                  </span>
                  <StatusBadge status={contract.status} />
                </div>
                <h3 className="font-medium text-text dark:text-text-dark text-sm mb-1">{contract.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted dark:text-text-muted-dark">
                    {client?.name || "Unknown Client"}
                  </span>
                  <span className="text-sm font-semibold text-text dark:text-text-dark">
                    {formatCurrency(contract.totalAmount, settings.currency)}
                  </span>
                </div>
                <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">
                  {formatDate(contract.startDate)} — {formatDate(contract.endDate)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
