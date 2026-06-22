"use client";

/**
 * @fileoverview 设置页 — 深色模式、语气、货币、用户名等偏好设置
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  User,
  Globe,
  MessageCircle,
  Crown,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import type { Currency } from "@/types";

/** 货币选项 */
const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "CNY", label: "¥ 人民币 (CNY)" },
  { value: "USD", label: "$ 美元 (USD)" },
  { value: "EUR", label: "€ 欧元 (EUR)" },
  { value: "GBP", label: "£ 英镑 (GBP)" },
  { value: "JPY", label: "¥ 日元 (JPY)" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, resetStore, analyses } = useStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  /** 处理重置 */
  const handleReset = () => {
    resetStore();
    setShowResetConfirm(false);
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">设置</h1>

      {/* 订阅状态 */}
      <div className="rounded-2xl bg-surface p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Crown size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {settings.subscriptionTier === "premium"
                  ? "高级版"
                  : "免费版"}
              </p>
              <p className="text-xs text-muted">
                {settings.subscriptionTier === "premium"
                  ? "无限使用"
                  : `剩余 ${settings.freeUsesRemaining} 次免费分析`}
              </p>
            </div>
          </div>
          {settings.subscriptionTier !== "premium" && (
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark transition-colors"
            >
              升级
            </button>
          )}
        </div>
      </div>

      {/* 外观设置 */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <h2 className="px-4 pt-4 text-sm font-semibold text-foreground">外观</h2>

        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon size={18} className="text-primary" />
              ) : (
                <Sun size={18} className="text-warning" />
              )}
              <span className="text-sm text-foreground">深色模式</span>
            </div>
            <button
              onClick={() =>
                updateSettings({ darkMode: !settings.darkMode })
              }
              className={`relative h-7 w-12 rounded-full transition-colors ${
                settings.darkMode ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings.darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 个人信息 */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <h2 className="px-4 pt-4 text-sm font-semibold text-foreground">
          个人信息
        </h2>

        <div className="divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <User size={18} className="shrink-0 text-muted" />
            <input
              type="text"
              placeholder="你的名字或公司名"
              value={settings.displayName}
              onChange={(e) =>
                updateSettings({ displayName: e.target.value })
              }
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 偏好设置 */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <h2 className="px-4 pt-4 text-sm font-semibold text-foreground">
          偏好
        </h2>

        <div className="divide-y divide-border">
          {/* 默认语气 */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <MessageCircle size={18} className="text-muted" />
              <span className="text-sm text-foreground">默认语气</span>
            </div>
            <select
              value={settings.defaultTone}
              onChange={(e) =>
                updateSettings({
                  defaultTone: e.target.value as "formal" | "friendly",
                })
              }
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="formal">正式</option>
              <option value="friendly">友好</option>
            </select>
          </div>

          {/* 默认货币 */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-muted" />
              <span className="text-sm text-foreground">默认货币</span>
            </div>
            <select
              value={settings.currency}
              onChange={(e) =>
                updateSettings({ currency: e.target.value as Currency })
              }
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 数据管理 */}
      <section className="rounded-2xl bg-surface border border-border overflow-hidden">
        <h2 className="px-4 pt-4 text-sm font-semibold text-foreground">数据</h2>

        <div className="p-4">
          <p className="mb-3 text-xs text-muted">
            已保存 {analyses.length} 条分析记录。所有数据存储在本地浏览器中，不会上传到服务器。
          </p>

          {showResetConfirm ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-danger/10 p-3 text-xs text-danger">
                <AlertTriangle size={14} />
                此操作不可恢复，确定要清除所有数据吗？
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white hover:bg-danger/90 transition-colors"
                >
                  确认清除
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-xs text-foreground hover:bg-background transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 px-4 py-2.5 text-xs font-medium text-danger hover:bg-danger/5 transition-colors"
            >
              <RotateCcw size={14} />
              清除所有数据
            </button>
          )}
        </div>
      </section>

      <p className="text-center text-xs text-muted">RateGuard v0.1.0 MVP</p>
    </div>
  );
}
