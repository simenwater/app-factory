/**
 * @fileoverview 设置页面
 * 管理业务信息、付款集成、订阅计划
 */

"use client";

import { useStore } from "@/store/useStore";
import { useTheme } from "@/components/ThemeProvider";
import {
  Sun,
  Moon,
  CreditCard,
  Building,
  CheckCircle,
  Crown,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { settings, updateSettings, subscription, upgradePlan } = useStore();
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-text dark:text-text-dark mb-6">Settings</h1>

      {/* Subscription */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">
          Subscription Plan
        </h2>
        <div className="space-y-2">
          <button
            onClick={() => upgradePlan("free")}
            className={`w-full p-4 rounded-xl border text-left transition-colors ${
              subscription.plan === "free"
                ? "border-primary bg-primary/5"
                : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-text dark:text-text-dark">Free</span>
              <span className="text-sm text-text-muted dark:text-text-muted-dark">$0/mo</span>
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              3 contracts per month, basic templates
            </p>
            {subscription.plan === "free" && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Current Plan
              </span>
            )}
          </button>

          <button
            onClick={() => upgradePlan("pro")}
            className={`w-full p-4 rounded-xl border text-left transition-colors ${
              subscription.plan === "pro"
                ? "border-primary bg-primary/5"
                : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text dark:text-text-dark">Pro</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-sm font-semibold text-text dark:text-text-dark">$9/mo</span>
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              Unlimited contracts, premium templates, auto reminders
            </p>
            {subscription.plan === "pro" && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Current Plan
              </span>
            )}
          </button>

          <button
            onClick={() => upgradePlan("annual")}
            className={`w-full p-4 rounded-xl border text-left transition-colors ${
              subscription.plan === "annual"
                ? "border-primary bg-primary/5"
                : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text dark:text-text-dark">Annual</span>
                <Crown className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-text dark:text-text-dark">$99/yr</span>
                <span className="text-xs text-success ml-1">Save 8%</span>
              </div>
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              Everything in Pro, billed annually
            </p>
            {subscription.plan === "annual" && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Current Plan
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Business Info */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">
          <Building className="inline w-4 h-4 mr-1" />
          Business Information
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Business Name"
            value={settings.businessName}
            onChange={(e) => updateSettings({ businessName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Your Name"
            value={settings.ownerName}
            onChange={(e) => updateSettings({ ownerName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="email"
            placeholder="Business Email"
            value={settings.email}
            onChange={(e) => updateSettings({ email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={settings.phone}
            onChange={(e) => updateSettings({ phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <textarea
            placeholder="Business Address"
            value={settings.address}
            onChange={(e) => updateSettings({ address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Payment Settings */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">
          <CreditCard className="inline w-4 h-4 mr-1" />
          Payment Integration
        </h2>
        <div className="space-y-4">
          {/* Stripe */}
          <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text dark:text-text-dark">Stripe</span>
              <button
                onClick={() => updateSettings({ stripeEnabled: !settings.stripeEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.stripeEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.stripeEnabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {settings.stripeEnabled && (
              <input
                type="text"
                placeholder="Stripe Account ID"
                value={settings.stripeAccountId}
                onChange={(e) => updateSettings({ stripeAccountId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>

          {/* PayPal */}
          <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text dark:text-text-dark">PayPal</span>
              <button
                onClick={() => updateSettings({ paypalEnabled: !settings.paypalEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.paypalEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.paypalEnabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {settings.paypalEnabled && (
              <input
                type="email"
                placeholder="PayPal Email"
                value={settings.paypalEmail}
                onChange={(e) => updateSettings({ paypalEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">
          Preferences
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-sm text-text dark:text-text-dark">Dark Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                theme === "dark" ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  theme === "dark" ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <label className="text-sm text-text dark:text-text-dark block mb-2">Default Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <label className="text-sm text-text dark:text-text-dark block mb-2">Payment Terms (days)</label>
            <input
              type="number"
              min="1"
              value={settings.paymentTermsDays}
              onChange={(e) => updateSettings({ paymentTermsDays: parseInt(e.target.value) || 30 })}
              className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-text dark:text-text-dark">Auto Payment Reminders</label>
              <button
                onClick={() => updateSettings({ autoReminderEnabled: !settings.autoReminderEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.autoReminderEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.autoReminderEnabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {settings.autoReminderEnabled && (
              <div>
                <label className="text-xs text-text-muted dark:text-text-muted-dark block mb-1">
                  Reminder interval (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.reminderIntervalDays}
                  onChange={(e) => updateSettings({ reminderIntervalDays: parseInt(e.target.value) || 7 })}
                  className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <label className="text-sm text-text dark:text-text-dark block mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CNY">CNY (&yen;)</option>
              <option value="JPY">JPY (&yen;)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
      >
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
