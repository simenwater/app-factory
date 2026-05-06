"use client";

import { FileText, Plus } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "@/store/useStore";
import { getRemainingInvoices } from "@/lib/subscription";

/**
 * @description 应用顶栏 Header 组件
 */
export function Header({ onNewInvoice }: { onNewInvoice: () => void }) {
  const { subscription } = useStore();
  const remaining = getRemainingInvoices(subscription);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--foreground)]">
                InvoiceFlow AI
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                Smart Invoice Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {remaining !== null && (
              <span className="text-sm text-[var(--muted-foreground)]">
                {remaining} invoices left this month
              </span>
            )}
            {subscription.plan === "free" && (
              <a
                href="#pricing"
                className="text-sm font-medium text-[var(--primary)] hover:underline"
              >
                Upgrade
              </a>
            )}
            <button onClick={onNewInvoice} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Invoice</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
