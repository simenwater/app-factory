"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Moon,
  Sun,
  Crown,
  Check,
  Download,
  Upload,
  Shield,
} from "lucide-react";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY"];

/**
 * @description 设置页面（含订阅管理、数据备份和深色模式）
 */
export default function SettingsPage() {
  const { settings, updateSettings, setSubscription, jobs, invoices, customers } =
    useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  /**
   * @description 导出全部数据为 JSON 备份文件
   */
  const handleExportData = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      jobs,
      invoices,
      customers,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fieldflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * @description 从 JSON 备份文件恢复数据
   */
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data.jobs || !data.invoices || !data.settings) {
          setImportStatus("Invalid backup file format.");
          return;
        }

        const store = useStore.getState();
        if (data.jobs) data.jobs.forEach((j: typeof jobs[0]) => store.addJob(j));
        if (data.customers)
          data.customers.forEach((c: typeof customers[0]) => store.addCustomer(c));
        if (data.invoices)
          data.invoices.forEach((inv: typeof invoices[0]) => store.addInvoice(inv));
        if (data.settings) store.updateSettings(data.settings);

        setImportStatus("Data restored successfully!");
        setTimeout(() => setImportStatus(null), 3000);
      } catch {
        setImportStatus("Failed to read backup file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark";

  const proFeatures = [
    "Unlimited jobs per month",
    "Unlimited customers",
    "Custom invoice templates",
    "Priority support",
    "Remove branding",
  ];

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      {/* Dark Mode Toggle */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          {settings.darkMode ? (
            <Moon size={20} className="text-purple-400" />
          ) : (
            <Sun size={20} className="text-yellow-500" />
          )}
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              {settings.darkMode ? "Dark theme active" : "Light theme active"}
            </p>
          </div>
        </div>
        <button
          onClick={() => updateSettings({ darkMode: !settings.darkMode })}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            settings.darkMode ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
              settings.darkMode ? "translate-x-5.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Business Info */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Business Information
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Business Name"
            value={settings.businessName}
            onChange={(e) => updateSettings({ businessName: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Owner Name"
            value={settings.ownerName}
            onChange={(e) => updateSettings({ ownerName: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email"
            value={settings.email}
            onChange={(e) => updateSettings({ email: e.target.value })}
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={settings.phone}
            onChange={(e) => updateSettings({ phone: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="Business Address"
            rows={2}
            value={settings.address}
            onChange={(e) => updateSettings({ address: e.target.value })}
            className={inputClass}
          />
        </div>
      </section>

      {/* Currency & Tax */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Currency & Tax
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value })}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              placeholder="Tax Rate"
              value={settings.taxRate || ""}
              onChange={(e) =>
                updateSettings({ taxRate: Number(e.target.value) })
              }
              className={inputClass}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              %
            </span>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Subscription
        </h2>
        <div className="space-y-3">
          {/* Free Tier */}
          <div
            className={`rounded-xl border-2 p-4 transition-colors ${
              settings.subscription === "free"
                ? "border-primary bg-primary/5"
                : "border-border dark:border-border-dark"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Free</h3>
              <span className="text-lg font-bold">$0</span>
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              1 user, 5 jobs/month
            </p>
            {settings.subscription === "free" && (
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Check size={14} /> Current Plan
              </span>
            )}
          </div>

          {/* Pro Tier */}
          <div
            className={`rounded-xl border-2 p-4 transition-colors ${
              settings.subscription === "pro"
                ? "border-primary bg-primary/5"
                : "border-border dark:border-border-dark"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-yellow-500" />
                <h3 className="font-semibold">Pro</h3>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">$9.99</span>
                <span className="text-xs text-text-muted">/month</span>
              </div>
            </div>
            <ul className="mb-3 space-y-1">
              {proFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-text-muted dark:text-text-muted-dark"
                >
                  <Check size={12} className="text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            {settings.subscription === "pro" ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Check size={14} /> Current Plan
              </span>
            ) : (
              <button
                onClick={() => setSubscription("pro")}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Usage
        </h2>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              Total Jobs
            </span>
            <span className="font-medium">{jobs.length}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              Total Invoices
            </span>
            <span className="font-medium">{invoices.length}</span>
          </div>
        </div>
      </section>

      {/* Data Backup */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Data Backup
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface py-3 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-100 dark:bg-surface-dark dark:hover:bg-gray-800"
          >
            <Download size={16} className="text-primary" />
            Export All Data
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface py-3 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-100 dark:bg-surface-dark dark:hover:bg-gray-800"
          >
            <Upload size={16} className="text-primary" />
            Import Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportData}
          />
          {importStatus && (
            <p className="text-center text-sm text-primary">{importStatus}</p>
          )}
          <p className="text-center text-xs text-text-muted dark:text-text-muted-dark">
            Your data is stored locally on this device. Export regularly to avoid
            data loss.
          </p>
        </div>
      </section>

      {/* Legal */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Legal
        </h2>
        <Link
          href="/privacy"
          className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-colors hover:bg-gray-100 dark:bg-surface-dark dark:hover:bg-gray-800"
        >
          <Shield size={18} className="text-text-muted" />
          <span className="text-sm font-medium">Privacy Policy</span>
        </Link>
      </section>
    </div>
  );
}
