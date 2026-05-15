"use client";

/**
 * @fileoverview 设置页面 — 主题切换、订阅管理、数据管理
 */

import { useState } from "react";
import { Moon, Sun, Crown, Trash2, Download, Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useLibraryStore } from "@/store/library-store";
import { exportPlaylistToIRealUrl } from "@/lib/ireal-exporter";

/**
 * @returns {JSX.Element} 设置页面
 */
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { subscription, setSubscription, sheets } = useLibraryStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpgrade = (plan: "monthly" | "yearly") => {
    setSubscription({
      plan,
      syncCount: subscription.syncCount,
      maxFreeSync: subscription.maxFreeSync,
      expiresAt: new Date(
        Date.now() + (plan === "monthly" ? 30 : 365) * 86400000
      ).toISOString(),
    });
  };

  const handleExportAll = () => {
    if (sheets.length === 0) return;
    const url = exportPlaylistToIRealUrl(sheets);
    window.open(url, "_blank");
  };

  const handleClearData = () => {
    localStorage.removeItem("leadsync-library");
    window.location.reload();
  };

  return (
    <div className="space-y-6 px-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Appearance */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Appearance
        </h2>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon size={20} className="text-indigo-500" />
            ) : (
              <Sun size={20} className="text-amber-500" />
            )}
            <div className="text-left">
              <p className="text-sm font-medium">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Switch to {theme === "dark" ? "light" : "dark"} theme
              </p>
            </div>
          </div>
          <div
            className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
              theme === "dark" ? "bg-indigo-600" : "bg-zinc-300"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                theme === "dark" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>
      </section>

      {/* Subscription */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Subscription
        </h2>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-3 flex items-center gap-2">
            <Crown
              size={18}
              className={
                subscription.plan !== "free"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-400"
              }
            />
            <span className="font-medium">
              {subscription.plan === "free"
                ? "Free Plan"
                : subscription.plan === "monthly"
                ? "Pro Monthly"
                : "Pro Yearly"}
            </span>
            {subscription.plan !== "free" && (
              <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </span>
            )}
          </div>

          {subscription.plan === "free" ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Syncs: {subscription.syncCount}/{subscription.maxFreeSync}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleUpgrade("monthly")}
                  className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-3 text-center transition-all hover:border-indigo-400 dark:border-indigo-800 dark:bg-indigo-950/30 dark:hover:border-indigo-600"
                >
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    $4.99
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    per month
                  </p>
                </button>
                <button
                  onClick={() => handleUpgrade("yearly")}
                  className="relative rounded-xl border-2 border-purple-200 bg-purple-50 p-3 text-center transition-all hover:border-purple-400 dark:border-purple-800 dark:bg-purple-950/30 dark:hover:border-purple-600"
                >
                  <span className="absolute -top-2 right-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    SAVE 33%
                  </span>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    $39.99
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    per year
                  </p>
                </button>
              </div>

              <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                {[
                  "Unlimited cloud sync",
                  "Advanced AI chord analysis",
                  "Bulk import/export",
                  "Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Expires: {subscription.expiresAt
                ? new Date(subscription.expiresAt).toLocaleDateString()
                : "N/A"}
            </p>
          )}
        </div>
      </section>

      {/* Data */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Data
        </h2>

        <button
          onClick={handleExportAll}
          disabled={sheets.length === 0}
          className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
        >
          <Download size={20} className="text-indigo-500" />
          <div className="text-left">
            <p className="text-sm font-medium">Export All to iReal Pro</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {sheets.length} songs in library
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-white p-4 transition-colors hover:border-red-300 dark:border-red-800/50 dark:bg-zinc-800 dark:hover:border-red-700"
        >
          <Trash2 size={20} className="text-red-500" />
          <div className="text-left">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Clear All Data
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Delete all songs and reset settings
            </p>
          </div>
        </button>

        {showConfirm && (
          <div className="animate-slide-up rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="mb-3 text-sm font-medium text-red-900 dark:text-red-100">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearData}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete Everything
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* About */}
      <section className="pb-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <p>LeadSync Pro v0.1.0</p>
        <p className="mt-1">
          Built for jazz &amp; pop musicians
        </p>
      </section>
    </div>
  );
}
