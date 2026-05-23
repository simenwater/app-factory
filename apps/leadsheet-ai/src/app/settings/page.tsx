"use client";

/**
 * @fileoverview 设置页面
 * 包含主题切换、默认参数配置和订阅管理。
 */

import { Moon, Sun, Monitor } from "lucide-react";
import { useStore } from "@/store/useStore";
import { SubscriptionPlans } from "@/components/SubscriptionBanner";
import type { MusicStyle } from "@/types";

const STYLE_OPTIONS: { value: MusicStyle; label: string }[] = [
  { value: "jazz-swing", label: "Swing" },
  { value: "jazz-bossa", label: "Bossa Nova" },
  { value: "jazz-ballad", label: "Ballad" },
  { value: "jazz-latin", label: "Latin" },
  { value: "jazz-bebop", label: "Bebop" },
  { value: "jazz-cool", label: "Cool Jazz" },
  { value: "blues", label: "Blues" },
  { value: "pop", label: "Pop" },
  { value: "folk", label: "Folk" },
];

const KEY_OPTIONS = [
  "C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B",
];

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">设置</h1>

      {/* Theme */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          外观
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "light" as const, icon: Sun, label: "浅色" },
            { value: "dark" as const, icon: Moon, label: "深色" },
            { value: "system" as const, icon: Monitor, label: "跟随系统" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateSettings({ theme: opt.value })}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 transition-all ${
                settings.theme === opt.value
                  ? "border-primary bg-primary/10"
                  : "border-border dark:border-border-dark"
              }`}
            >
              <opt.icon
                size={20}
                className={settings.theme === opt.value ? "text-primary" : "text-text-muted dark:text-text-muted-dark"}
              />
              <span className="text-xs font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Default Parameters */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          默认参数
        </h2>
        <div className="space-y-4 rounded-2xl bg-surface p-4 dark:bg-surface-dark">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">默认风格</label>
            <select
              value={settings.defaultStyle}
              onChange={(e) =>
                updateSettings({ defaultStyle: e.target.value as MusicStyle })
              }
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm dark:border-border-dark dark:bg-bg-dark"
            >
              {STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">默认调号</label>
            <select
              value={settings.defaultKey}
              onChange={(e) => updateSettings({ defaultKey: e.target.value })}
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm dark:border-border-dark dark:bg-bg-dark"
            >
              {KEY_OPTIONS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              默认速度 <span className="text-text-muted dark:text-text-muted-dark">{settings.defaultTempo} BPM</span>
            </label>
            <input
              type="range"
              min={40}
              max={300}
              value={settings.defaultTempo}
              onChange={(e) =>
                updateSettings({ defaultTempo: Number(e.target.value) })
              }
              className="w-32 accent-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">节拍器</label>
            <button
              onClick={() =>
                updateSettings({
                  metronomeEnabled: !settings.metronomeEnabled,
                })
              }
              className={`relative h-7 w-12 rounded-full transition-colors ${
                settings.metronomeEnabled ? "bg-primary" : "bg-border dark:bg-border-dark"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  settings.metronomeEnabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          订阅方案
        </h2>
        <SubscriptionPlans />
      </section>

      {/* App Info */}
      <section className="mb-8 text-center">
        <p className="text-xs text-text-muted dark:text-text-muted-dark">
          LeadSheet AI v0.1.0
        </p>
        <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
          专为爵士乐手设计的智能乐谱助手
        </p>
      </section>
    </div>
  );
}
