"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  Crown,
  Check,
  LogIn,
  LogOut,
  Upload,
  Download,
  Cloud,
  CloudOff,
  Shield,
} from "lucide-react";
import { generateId } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY"];

/**
 * @description 设置页面（含订阅管理、账号登录和数据备份）
 */
export default function SettingsPage() {
  const {
    user,
    settings,
    updateSettings,
    setSubscription,
    jobs,
    invoices,
    login,
    logout,
    exportData,
    importData,
    syncToCloud,
  } = useStore();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: "", email: "", phone: "" });
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark";

  const proFeatures = [
    "无限工单数量",
    "无限客户数量",
    "自定义发票模板",
    "云端自动备份",
    "优先客服支持",
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: generateId(),
      name: loginForm.name,
      email: loginForm.email,
      phone: loginForm.phone,
      createdAt: new Date().toISOString(),
    };
    login(newUser);
    setShowLoginForm(false);
    setLoginForm({ name: "", email: "", phone: "" });
  };

  const handleLogout = () => {
    if (confirm("退出登录将清除本地数据，请确保已导出备份。是否继续？")) {
      logout();
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fieldflow-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      const success = importData(data);
      if (success) {
        alert("数据导入成功！");
      } else {
        alert("数据导入失败，请检查文件格式。");
      }
    };
    reader.readAsText(file);
  };

  const handleSync = async () => {
    if (!user) {
      alert("请先登录账号才能使用云同步功能。");
      return;
    }
    setSyncing(true);
    setSyncMessage("");
    const success = await syncToCloud();
    setSyncing(false);
    if (success) {
      setSyncMessage("同步成功！");
      setTimeout(() => setSyncMessage(""), 3000);
    } else {
      setSyncMessage("同步失败，请重试。");
    }
  };

  return (
    <div className="px-4 pt-6 pb-20">
      <h1 className="mb-6 text-2xl font-bold">设置</h1>

      {/* Account Section */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          账号管理
        </h2>
        {!user ? (
          <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
            <div className="mb-3 flex items-start gap-3">
              <Shield size={20} className="mt-0.5 text-amber-500" />
              <div className="flex-1">
                <p className="mb-1 font-medium text-amber-600 dark:text-amber-400">
                  数据安全提示
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  当前数据仅保存在本地。登录账号后，数据将自动同步到云端，换手机也不会丢失。
                </p>
              </div>
            </div>
            {!showLoginForm ? (
              <button
                onClick={() => setShowLoginForm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                <LogIn size={16} />
                登录/注册账号
              </button>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="text"
                  placeholder="姓名 *"
                  required
                  value={loginForm.name}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, name: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="邮箱 *"
                  required
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder="手机号"
                  value={loginForm.phone}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, phone: e.target.value })
                  }
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
                  >
                    登录
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-100 dark:bg-surface-dark dark:hover:bg-gray-800"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {user.email}
                </p>
                {user.lastSyncAt && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    最后同步: {new Date(user.lastSyncAt).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:underline dark:text-red-400"
              >
                <LogOut size={14} />
                退出
              </button>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600 disabled:opacity-50"
            >
              {syncing ? (
                <CloudOff size={16} className="animate-pulse" />
              ) : (
                <Cloud size={16} />
              )}
              {syncing ? "同步中..." : "立即同步到云端"}
            </button>
            {syncMessage && (
              <p className="mt-2 text-center text-xs text-green-600 dark:text-green-400">
                {syncMessage}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Data Backup */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          数据备份
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            <Download size={16} />
            导出数据备份
          </button>
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-surface py-3 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-100 dark:bg-surface-dark dark:hover:bg-gray-800">
            <Upload size={16} />
            导入数据备份
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            建议定期导出数据备份到手机相册或云盘，防止数据丢失。
          </p>
        </div>
      </section>

      {/* Business Info */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          业务信息
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="业务名称"
            value={settings.businessName}
            onChange={(e) => updateSettings({ businessName: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="负责人姓名"
            value={settings.ownerName}
            onChange={(e) => updateSettings({ ownerName: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="邮箱"
            value={settings.email}
            onChange={(e) => updateSettings({ email: e.target.value })}
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="联系电话"
            value={settings.phone}
            onChange={(e) => updateSettings({ phone: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="业务地址"
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
          货币与税率
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
              placeholder="税率"
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
          订阅套餐
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
              <h3 className="font-semibold">免费版</h3>
              <span className="text-lg font-bold">¥0</span>
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              每月 5 个工单
            </p>
            {settings.subscription === "free" && (
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Check size={14} /> 当前套餐
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
                <h3 className="font-semibold">专业版</h3>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">¥58</span>
                <span className="text-xs text-text-muted">/月</span>
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
                <Check size={14} /> 当前套餐
              </span>
            ) : (
              <button
                onClick={() => setSubscription("pro")}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                升级到专业版
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          使用统计
        </h2>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              总工单数
            </span>
            <span className="font-medium">{jobs.length}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              总发票数
            </span>
            <span className="font-medium">{invoices.length}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
