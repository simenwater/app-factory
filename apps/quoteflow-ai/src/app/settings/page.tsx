"use client";

import { useStore } from "@/store/useStore";
import { Sun, Moon, CreditCard } from "lucide-react";
import Link from "next/link";

/**
 * @description 设置页面 — 商家信息、主题、订阅管理
 */
export default function SettingsPage() {
  const { settings, updateSettings } = useStore();

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      {/* Business Info */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Business Information
        </h2>
        <div className="space-y-3 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Business Name
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) =>
                updateSettings({ businessName: e.target.value })
              }
              placeholder="Your Business Name"
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Owner Name
            </label>
            <input
              type="text"
              value={settings.ownerName}
              onChange={(e) =>
                updateSettings({ ownerName: e.target.value })
              }
              placeholder="Your Name"
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                updateSettings({ email: e.target.value })
              }
              placeholder="you@business.com"
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Phone
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) =>
                updateSettings({ phone: e.target.value })
              }
              placeholder="+1 (555) 123-4567"
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) =>
                updateSettings({ address: e.target.value })
              }
              placeholder="123 Main St, City, State"
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
        </div>
      </section>

      {/* Billing Preferences */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Billing Preferences
        </h2>
        <div className="space-y-3 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) =>
                updateSettings({ currency: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
              <option value="CNY">CNY (&yen;)</option>
              <option value="JPY">JPY (&yen;)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) =>
                updateSettings({
                  taxRate: Math.max(0, parseFloat(e.target.value) || 0),
                })
              }
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
              Default Payment Terms (days)
            </label>
            <input
              type="number"
              min="1"
              value={settings.defaultPaymentTerms}
              onChange={(e) =>
                updateSettings({
                  defaultPaymentTerms: Math.max(
                    1,
                    parseInt(e.target.value) || 30
                  ),
                })
              }
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Appearance
        </h2>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <button
            onClick={() =>
              updateSettings({ darkMode: !settings.darkMode })
            }
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon size={18} className="text-indigo-400" />
              ) : (
                <Sun size={18} className="text-amber-500" />
              )}
              <span className="text-sm font-medium">
                {settings.darkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <div
              className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                settings.darkMode ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings.darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>
      </section>

      {/* Subscription */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Subscription
        </h2>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium capitalize">
                  {settings.subscription} Plan
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {settings.subscription === "pro"
                    ? "$9.90/month — Active"
                    : "5 quotes/month limit"}
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
            >
              {settings.subscription === "pro" ? "Manage" : "Upgrade"}
            </Link>
          </div>
        </div>
      </section>

      <p className="mb-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
        QuoteFlow AI v0.1.0
      </p>
    </div>
  );
}
