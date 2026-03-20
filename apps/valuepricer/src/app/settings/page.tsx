"use client";

import { useStore } from "@/store/useStore";
import { Moon, Sun, DollarSign, Trash2, Crown, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

/**
 * @description Settings page
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const inputs = useStore((s) => s.inputs);
  const recommendations = useStore((s) => s.recommendations);
  const resetStore = useStore((s) => s.resetStore);
  const { data: session } = useSession();

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold text-text dark:text-text-dark">
        Settings
      </h1>

      <div className="space-y-4">
        {session?.user && (
          <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
              Account
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-text dark:text-text-dark">
                    {session.user.email}
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    Signed in
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon size={20} className="text-primary" />
              ) : (
                <Sun size={20} className="text-warning" />
              )}
              <div>
                <p className="text-sm font-medium text-text dark:text-text-dark">
                  Dark Mode
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {settings.darkMode ? "Currently using dark theme" : "Currently using light theme"}
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                settings.darkMode ? "bg-primary" : "bg-border dark:bg-border-dark"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  settings.darkMode ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Preferences
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-success" />
              <div>
                <p className="text-sm font-medium text-text dark:text-text-dark">
                  Currency
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  Currency used in reports
                </p>
              </div>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CNY">CNY (¥)</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Subscription
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown
                size={20}
                className={
                  settings.subscriptionTier === "premium"
                    ? "text-primary"
                    : "text-text-muted dark:text-text-muted-dark"
                }
              />
              <div>
                <p className="text-sm font-medium text-text dark:text-text-dark">
                  {settings.subscriptionTier === "premium"
                    ? "Premium"
                    : "Free"}
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {settings.subscriptionTier === "premium"
                    ? "$9/mo · Full feature access"
                    : "Basic features · 3 reports/month"}
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
            >
              {settings.subscriptionTier === "premium" ? "Manage" : "Upgrade"}
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Data
          </h2>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bg p-3 dark:bg-bg-dark">
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Analyses
              </p>
              <p className="text-lg font-bold text-text dark:text-text-dark">
                {inputs.length}
              </p>
            </div>
            <div className="rounded-lg bg-bg p-3 dark:bg-bg-dark">
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Reports
              </p>
              <p className="text-lg font-bold text-text dark:text-text-dark">
                {recommendations.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to clear all data? This action cannot be undone."
                )
              ) {
                resetStore();
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
          >
            <Trash2 size={16} />
            Clear All Data
          </button>
        </div>

        <p className="text-center text-xs text-text-muted dark:text-text-muted-dark">
          ValuePricer v0.1.0
        </p>
      </div>
    </div>
  );
}
