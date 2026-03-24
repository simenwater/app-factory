"use client";

import { useStore } from "@/store/useStore";
import { Moon, Sun, RotateCcw } from "lucide-react";

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetStore = useStore((s) => s.resetStore);

  const currencies = [
    { code: "USD", label: "美元 (USD)" },
    { code: "EUR", label: "欧元 (EUR)" },
    { code: "GBP", label: "英镑 (GBP)" },
    { code: "CNY", label: "人民币 (CNY)" },
    { code: "JPY", label: "日元 (JPY)" },
  ];

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          自定义您的 QuoteGuard 体验
        </p>
      </div>

      <div className="space-y-4">
        {/* 外观 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            外观
          </h2>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="flex w-full items-center justify-between rounded-xl bg-bg px-4 py-3 transition-colors hover:bg-border/50 dark:bg-bg-dark dark:hover:bg-border-dark/50"
          >
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon size={20} className="text-accent" />
              ) : (
                <Sun size={20} className="text-warning" />
              )}
              <span className="text-sm font-medium">
                {settings.darkMode ? "深色模式" : "浅色模式"}
              </span>
            </div>
            <div
              className={`h-6 w-11 rounded-full transition-colors ${
                settings.darkMode ? "bg-accent" : "bg-border dark:bg-border-dark"
              }`}
            >
              <div
                className={`h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                  settings.darkMode ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>
        </section>

        {/* 商业信息 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            商业信息
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                商家/个人名称
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) =>
                  updateSettings({ businessName: e.target.value })
                }
                placeholder="您的名称或公司名"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                邮箱
              </label>
              <input
                type="email"
                value={settings.businessEmail}
                onChange={(e) =>
                  updateSettings({ businessEmail: e.target.value })
                }
                placeholder="your@email.com"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
            </div>
          </div>
        </section>

        {/* 默认设置 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            默认值
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                默认货币
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) =>
                  updateSettings({ defaultCurrency: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              >
                {currencies.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                默认时薪 ({settings.defaultCurrency})
              </label>
              <input
                type="number"
                value={settings.defaultHourlyRate}
                onChange={(e) =>
                  updateSettings({
                    defaultHourlyRate: Number(e.target.value),
                  })
                }
                min={1}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                报价默认有效期（天）
              </label>
              <input
                type="number"
                value={settings.defaultValidDays}
                onChange={(e) =>
                  updateSettings({
                    defaultValidDays: Number(e.target.value),
                  })
                }
                min={1}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
            </div>
          </div>
        </section>

        {/* 重置 */}
        <button
          onClick={() => {
            if (confirm("确定要重置所有数据吗？此操作不可撤销。")) {
              resetStore();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-danger/30 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <RotateCcw size={16} />
          重置所有数据
        </button>
      </div>

      <div className="h-8" />
    </div>
  );
}
