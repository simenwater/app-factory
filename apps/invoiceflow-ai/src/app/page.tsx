"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ReceiptUploader } from "@/components/ReceiptUploader";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { PaymentTracker } from "@/components/PaymentTracker";
import { PricingSection } from "@/components/PricingCard";
import { useStore } from "@/store/useStore";
import { canCreateInvoice } from "@/lib/subscription";
import type { Invoice, OCRResult } from "@/types";

/**
 * @description 应用主页面
 */
export default function Home() {
  const { invoices, addInvoice, subscription, incrementUsage } = useStore();
  const [view, setView] = useState<"dashboard" | "create" | "preview">("dashboard");
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);

  const handleNewInvoice = () => {
    const check = canCreateInvoice(subscription);
    if (!check.allowed) {
      setLimitError(check.reason || "已达本月限额");
      return;
    }
    setLimitError(null);
    setOcrResult(null);
    setView("create");
  };

  const handleOCRResult = (result: OCRResult) => {
    const check = canCreateInvoice(subscription);
    if (!check.allowed) {
      setLimitError(check.reason || "已达本月限额");
      return;
    }
    setLimitError(null);
    setOcrResult(result);
    setView("create");
  };

  const handleGenerate = (invoice: Invoice) => {
    addInvoice(invoice);
    incrementUsage();
    setSelectedInvoice(invoice);
    setView("preview");
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setView("preview");
  };

  return (
    <div className="min-h-screen">
      <Header onNewInvoice={handleNewInvoice} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {limitError && (
          <div className="mb-6 p-4 bg-[var(--accent)] border border-[var(--primary)] rounded-lg">
            <p className="text-sm text-[var(--foreground)]">{limitError}</p>
            <a href="#pricing" className="text-sm font-medium text-[var(--primary)] hover:underline">
              View pricing →
            </a>
          </div>
        )}

        {view === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ReceiptUploader onResult={handleOCRResult} />
              </div>
              <div className="lg:col-span-2">
                <PaymentTracker
                  invoices={invoices}
                  onSelect={handleSelectInvoice}
                />
              </div>
            </div>
            <PricingSection />
          </div>
        )}

        {view === "create" && (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setView("dashboard")}
              className="btn-secondary mb-4"
            >
              ← Back to Dashboard
            </button>
            <InvoiceForm ocrData={ocrResult} onGenerate={handleGenerate} />
          </div>
        )}

        {view === "preview" && selectedInvoice && (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setView("dashboard")}
              className="btn-secondary mb-4"
            >
              ← Back to Dashboard
            </button>
            <InvoicePreview
              invoice={selectedInvoice}
              onClose={() => setView("dashboard")}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              © 2026 InvoiceFlow AI. Built for freelancers.
            </p>
            <div className="flex gap-4 text-sm text-[var(--muted-foreground)]">
              <a href="#" className="hover:text-[var(--foreground)]">Privacy</a>
              <a href="#" className="hover:text-[var(--foreground)]">Terms</a>
              <a href="#" className="hover:text-[var(--foreground)]">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
