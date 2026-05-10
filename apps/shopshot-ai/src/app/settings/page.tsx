"use client";

import { ArrowLeft, Moon, Sun, Wand2, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import type { ExportFormat } from "@/types";
import { EXPORT_PRESETS } from "@/lib/exportFormats";
import { getImageLimit } from "@/lib/utils";

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const stats = useStore((s) => s.stats);
  const updateSettings = useStore((s) => s.updateSettings);

  const limit = getImageLimit(settings.subscription);

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full p-2 text-text-muted hover:bg-surface dark:text-text-muted-dark dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-text dark:text-text-dark">
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        {/* Subscription Info */}
        <div className="rounded-2xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Subscription
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize text-text dark:text-text-dark">
                {settings.subscription} Plan
              </p>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                {limit === -1
                  ? "Unlimited images"
                  : `${settings.imagesGeneratedThisMonth}/${limit} images used this month`}
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {settings.subscription === "pro" ? "Manage" : "Upgrade"}
            </Link>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Appearance
          </h2>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-border/30 dark:border-border-dark dark:hover:bg-border-dark/30"
          >
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon size={20} className="text-primary" />
              ) : (
                <Sun size={20} className="text-warning" />
              )}
              <span className="text-sm font-medium text-text dark:text-text-dark">
                Dark Mode
              </span>
            </div>
            <div
              className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                settings.darkMode ? "bg-primary" : "bg-border dark:bg-border-dark"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Processing */}
        <div className="rounded-2xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Processing
          </h2>

          <div className="space-y-3">
            <button
              onClick={() =>
                updateSettings({
                  autoBackgroundRemoval: !settings.autoBackgroundRemoval,
                })
              }
              className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-border/30 dark:border-border-dark dark:hover:bg-border-dark/30"
            >
              <div className="flex items-center gap-3">
                <Wand2 size={20} className="text-primary" />
                <div className="text-left">
                  <span className="block text-sm font-medium text-text dark:text-text-dark">
                    Auto Background Removal
                  </span>
                  <span className="block text-xs text-text-muted dark:text-text-muted-dark">
                    Remove background before generating
                  </span>
                </div>
              </div>
              <div
                className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
                  settings.autoBackgroundRemoval
                    ? "bg-primary"
                    : "bg-border dark:bg-border-dark"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    settings.autoBackgroundRemoval
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="rounded-2xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Default Export Format
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(EXPORT_PRESETS) as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => updateSettings({ defaultExportFormat: format })}
                className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                  settings.defaultExportFormat === format
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-text-muted dark:border-border-dark dark:text-text-muted-dark"
                }`}
              >
                <ImageIcon size={14} />
                {EXPORT_PRESETS[format].name}
              </button>
            ))}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="rounded-2xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Usage Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-text dark:text-text-dark">
                {stats.totalGenerated}
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Total Generated
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text dark:text-text-dark">
                {stats.totalExported}
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Total Exported
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="pb-8 text-center">
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            ShopShot AI v0.1.0 — MVP
          </p>
        </div>
      </div>
    </div>
  );
}
