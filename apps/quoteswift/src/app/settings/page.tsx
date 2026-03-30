"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Crown,
  Check,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Percent,
  DollarSign,
} from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const setSubscription = useStore((s) => s.setSubscription);
  const quotes = useStore((s) => s.quotes);
  const [saved, setSaved] = useState(false);

  /**
   * @description 保存提示
   */
  function showSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  /**
   * @description 更新设置字段
   */
  function handleChange(field: string, value: string | number | boolean) {
    updateSettings({ [field]: value });
    showSaved();
  }

  const INPUT_CLASS =
    "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark";

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          设置
        </h1>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <Check size={14} />
            已保存
          </span>
        )}
      </div>

      <section className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          商家信息
        </h2>
        <div className="space-y-3">
          <div className="relative">
            <Building2
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="商家名称"
              value={settings.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="负责人姓名"
              value={settings.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="email"
              placeholder="邮箱"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="tel"
              placeholder="电话"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="地址"
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          报价设置
        </h2>
        <div className="space-y-3">
          <div className="relative">
            <DollarSign
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <select
              value={settings.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className={`${INPUT_CLASS} pl-10 appearance-none`}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
          <div className="relative">
            <Percent
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="number"
              placeholder="默认税率 (%)"
              value={settings.taxRate}
              onChange={(e) =>
                handleChange("taxRate", parseFloat(e.target.value) || 0)
              }
              className={`${INPUT_CLASS} pl-10`}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          外观
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.darkMode ? (
              <Moon size={20} className="text-primary" />
            ) : (
              <Sun size={20} className="text-warning" />
            )}
            <span className="text-sm text-text dark:text-text-dark">
              {settings.darkMode ? "深色模式" : "浅色模式"}
            </span>
          </div>
          <button
            onClick={() => handleChange("darkMode", !settings.darkMode)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              settings.darkMode ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                settings.darkMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          <Crown size={16} className="text-warning" />
          订阅计划
        </h2>
        <div className="space-y-3">
          <button
            onClick={() => { setSubscription("free"); showSaved(); }}
            className={`w-full rounded-xl border p-4 text-left transition-colors ${
              settings.subscription === "free"
                ? "border-primary bg-primary/5"
                : "border-border dark:border-border-dark"
            }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold text-text dark:text-text-dark">
                免费版
              </span>
              {settings.subscription === "free" && (
                <Check size={18} className="text-primary" />
              )}
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              3 个模板 · 10 份报价单 · 基础功能
            </p>
          </button>
          <button
            onClick={() => { setSubscription("pro"); showSaved(); }}
            className={`w-full rounded-xl border p-4 text-left transition-colors ${
              settings.subscription === "pro"
                ? "border-primary bg-primary/5"
                : "border-border dark:border-border-dark"
            }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text dark:text-text-dark">
                  Pro 版
                </span>
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                  $4.99/月
                </span>
              </div>
              {settings.subscription === "pro" && (
                <Check size={18} className="text-primary" />
              )}
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              无限模板 · 无限报价单 · 自定义 Logo · 云端保存
            </p>
          </button>
        </div>
      </section>

      <div className="mb-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
        <p>已创建 {quotes.length} 份报价单</p>
        <p className="mt-1">QuoteSwift v0.1.0</p>
      </div>
    </div>
  );
}
