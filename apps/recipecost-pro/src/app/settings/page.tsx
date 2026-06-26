"use client";

import { useStore } from "@/store/useStore";
import { Moon, Sun, DollarSign, Trash2, Crown, Percent } from "lucide-react";
import type { Currency } from "@/types";

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const ingredients = useStore((s) => s.ingredients);
  const recipes = useStore((s) => s.recipes);
  const resetStore = useStore((s) => s.resetStore);

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold text-text dark:text-text-dark">
        设置
      </h1>

      <div className="space-y-4">
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            外观
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
                  深色模式
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {settings.darkMode ? "当前使用深色主题" : "当前使用浅色主题"}
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
            偏好设置
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-text dark:text-text-dark">
                    货币
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    用于显示价格的货币单位
                  </p>
                </div>
              </div>
              <select
                value={settings.currency}
                onChange={(e) =>
                  updateSettings({ currency: e.target.value as Currency })
                }
                className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              >
                <option value="CNY">CNY (¥)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Percent size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-text dark:text-text-dark">
                    默认利润率
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    新食谱的默认利润率
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={Math.round(settings.defaultProfitMargin * 100)}
                  onChange={(e) =>
                    updateSettings({
                      defaultProfitMargin: (parseInt(e.target.value) || 0) / 100,
                    })
                  }
                  min="0"
                  max="99"
                  className="w-16 rounded-lg border border-border bg-bg px-2 py-1.5 text-center text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
                <span className="text-sm text-text-muted dark:text-text-muted-dark">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Percent size={20} className="text-accent" />
                <div>
                  <p className="text-sm font-medium text-text dark:text-text-dark">
                    默认税率
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    新食谱的默认税率
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={Math.round(settings.defaultTaxRate * 100)}
                  onChange={(e) =>
                    updateSettings({
                      defaultTaxRate: (parseInt(e.target.value) || 0) / 100,
                    })
                  }
                  min="0"
                  max="50"
                  className="w-16 rounded-lg border border-border bg-bg px-2 py-1.5 text-center text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
                <span className="text-sm text-text-muted dark:text-text-muted-dark">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            订阅
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
                    ? "Premium 专业版"
                    : "Free 免费版"}
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {settings.subscriptionTier === "premium"
                    ? "$4.99/月 · 无限食谱"
                    : "免费试用 3 个食谱"}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  subscriptionTier:
                    settings.subscriptionTier === "premium" ? "free" : "premium",
                })
              }
              className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
            >
              {settings.subscriptionTier === "premium" ? "管理" : "升级"}
            </button>
          </div>
          {settings.subscriptionTier === "free" && (
            <div className="mt-3 rounded-lg bg-bg p-3 dark:bg-bg-dark">
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                升级方案：$4.99/月 或 一次性购买 $29.99 解锁无限食谱
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            数据
          </h2>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bg p-3 dark:bg-bg-dark">
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                食材数量
              </p>
              <p className="text-lg font-bold text-text dark:text-text-dark">
                {ingredients.length}
              </p>
            </div>
            <div className="rounded-lg bg-bg p-3 dark:bg-bg-dark">
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                食谱数量
              </p>
              <p className="text-lg font-bold text-text dark:text-text-dark">
                {recipes.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (
                confirm("确定要清除所有数据吗？此操作不可恢复。")
              ) {
                resetStore();
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
          >
            <Trash2 size={16} />
            清除所有数据
          </button>
        </div>

        <p className="text-center text-xs text-text-muted dark:text-text-muted-dark">
          RecipeCost Pro v0.1.0 · MVP
        </p>
      </div>
    </div>
  );
}
