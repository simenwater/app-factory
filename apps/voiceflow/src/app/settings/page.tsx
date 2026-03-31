"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Monitor,
  Globe,
  FileDown,
  Crown,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import PricingModal from "@/components/PricingModal";
import type { ExportFormat } from "@/types";

/**
 * @description 主题选项
 */
const THEME_OPTIONS = [
  { value: "light" as const, label: "浅色", icon: Sun },
  { value: "dark" as const, label: "深色", icon: Moon },
  { value: "system" as const, label: "跟随系统", icon: Monitor },
];

/**
 * @description 导出格式选项
 */
const EXPORT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: "notion", label: "Notion" },
  { value: "obsidian", label: "Obsidian" },
  { value: "markdown", label: "Markdown" },
  { value: "text", label: "纯文本" },
];

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [showPricing, setShowPricing] = useState(false);

  const planLabels: Record<string, string> = {
    free: "免费版",
    monthly: "月度订阅",
    lifetime: "终身版",
  };

  return (
    <div className="px-4 pt-12">
      <h1 className="mb-6 text-2xl font-bold text-text">设置</h1>

      {/* 订阅状态 */}
      <section className="mb-6">
        <button
          onClick={() => setShowPricing(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-4"
        >
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-semibold text-text">
                {planLabels[settings.subscription]}
              </p>
              {settings.subscription === "free" && (
                <p className="text-xs text-text-muted">
                  已使用 {settings.usageCount}/{settings.freeLimit} 次
                </p>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-text-muted" />
        </button>
      </section>

      {/* 外观 */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">
          外观
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateSettings({ theme: value })}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-sm transition-all ${
                settings.theme === value
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted hover:bg-surface-alt"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 默认导出格式 */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">
          默认导出格式
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {EXPORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSettings({ defaultExportFormat: value })}
              className={`flex items-center gap-2 rounded-xl p-3 text-sm transition-all ${
                settings.defaultExportFormat === value
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted hover:bg-surface-alt"
              }`}
            >
              <FileDown className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 语言 */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">
          语言
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "zh-CN", label: "简体中文" },
            { value: "en", label: "English" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSettings({ language: value })}
              className={`flex items-center gap-2 rounded-xl p-3 text-sm transition-all ${
                settings.language === value
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted hover:bg-surface-alt"
              }`}
            >
              <Globe className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 关于 */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">
          关于
        </h2>
        <div className="rounded-2xl bg-surface p-4">
          <p className="text-sm text-text">VoiceFlow v0.1.0</p>
          <p className="mt-1 text-xs text-text-muted">
            将语音笔记智能整理、重写为清晰文本的工具
          </p>
        </div>
      </section>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}
