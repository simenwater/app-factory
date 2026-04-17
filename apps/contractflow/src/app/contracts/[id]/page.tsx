/**
 * @fileoverview 合同详情页面
 */

"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  ArrowLeft,
  Download,
  Send,
  CreditCard,
  CheckCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateContractPDF } from "@/lib/pdf";
import { useState } from "react";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    getContract,
    getClient,
    updateContract,
    deleteContract,
    addPayment,
    settings,
  } = useStore();
  const contract = getContract(id);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  if (!contract) {
    return (
      <div className="px-4 py-6">
        <p className="text-text-muted dark:text-text-muted-dark">Contract not found.</p>
        <Link href="/contracts" className="text-primary text-sm mt-2 inline-block">Back to contracts</Link>
      </div>
    );
  }

  const client = getClient(contract.clientId);

  const handleSend = () => updateContract(id, { status: "sent" });
  const handleSign = () =>
    updateContract(id, { status: "signed", signedAt: new Date().toISOString() });
  const handleComplete = () => updateContract(id, { status: "completed" });

  const handleDownloadPDF = () => {
    if (client) {
      generateContractPDF(contract, client, settings);
    }
  };

  const handleCreatePayment = (method: "stripe" | "paypal") => {
    addPayment(id, method);
    setShowPaymentOptions(false);
    router.push("/payments");
  };

  const handleDelete = () => {
    if (confirm("Delete this contract?")) {
      deleteContract(id);
      router.push("/contracts");
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/contracts" className="p-1.5 rounded-lg hover:bg-surface dark:hover:bg-surface-dark">
            <ArrowLeft className="w-5 h-5 text-text dark:text-text-dark" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-text dark:text-text-dark">{contract.contractNumber}</h1>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">{contract.title}</p>
          </div>
        </div>
        <StatusBadge status={contract.status} />
      </div>

      {/* Client */}
      <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-3">
        <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Client</p>
        <p className="text-sm font-medium text-text dark:text-text-dark">{client?.name || "Unknown"}</p>
        <p className="text-xs text-text-muted dark:text-text-muted-dark">{client?.email}</p>
      </div>

      {/* Amount & Timeline */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Total Amount</p>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(contract.totalAmount, settings.currency)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Timeline</p>
          <p className="text-sm text-text dark:text-text-dark">
            {formatDate(contract.startDate, "MMM dd")} — {formatDate(contract.endDate, "MMM dd")}
          </p>
        </div>
      </div>

      {/* Description */}
      {contract.description && (
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-3">
          <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Description</p>
          <p className="text-sm text-text dark:text-text-dark whitespace-pre-wrap">{contract.description}</p>
        </div>
      )}

      {/* Scope */}
      {contract.scope && (
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-3">
          <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Scope of Work</p>
          <p className="text-sm text-text dark:text-text-dark whitespace-pre-wrap">{contract.scope}</p>
        </div>
      )}

      {/* Terms */}
      {contract.terms && (
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-6">
          <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Terms & Conditions</p>
          <p className="text-sm text-text dark:text-text-dark whitespace-pre-wrap">{contract.terms}</p>
        </div>
      )}

      {/* Payment Options */}
      {showPaymentOptions && (
        <div className="mb-4 p-4 rounded-xl bg-surface dark:bg-surface-dark border border-primary/30">
          <p className="text-sm font-medium text-text dark:text-text-dark mb-3">Choose payment method:</p>
          <div className="space-y-2">
            {settings.stripeEnabled && (
              <button
                onClick={() => handleCreatePayment("stripe")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-text dark:text-text-dark">Stripe Payment Link</span>
              </button>
            )}
            {settings.paypalEnabled && (
              <button
                onClick={() => handleCreatePayment("paypal")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-text dark:text-text-dark">PayPal Payment Link</span>
              </button>
            )}
            {!settings.stripeEnabled && !settings.paypalEnabled && (
              <div className="text-center py-2">
                <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">
                  No payment methods configured.
                </p>
                <Link href="/settings" className="text-primary text-sm font-medium">
                  Set up payment methods
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {contract.status === "draft" && (
          <button
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <Send className="w-4 h-4" />
            Mark as Sent
          </button>
        )}
        {contract.status === "sent" && (
          <button
            onClick={handleSign}
            className="w-full flex items-center justify-center gap-2 py-3 bg-success text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="w-4 h-4" />
            Mark as Signed
          </button>
        )}
        {contract.status === "signed" && (
          <>
            <button
              onClick={() => setShowPaymentOptions(!showPaymentOptions)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Send Payment Link
            </button>
            <button
              onClick={handleComplete}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Completed
            </button>
          </>
        )}
        <button
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2 py-3 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl font-medium text-text dark:text-text-dark hover:border-primary/30 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 py-3 text-danger text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete Contract
        </button>
      </div>
    </div>
  );
}
