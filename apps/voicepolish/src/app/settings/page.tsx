"use client";

import { useStore } from "@/store/useStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { OutputFormat } from "@/types";
import { FORMAT_CONFIG } from "@/types";

/**
 * @page SettingsPage
 * 设置页面：主题、语言、默认格式等
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const setLanguage = useStore((s) => s.setLanguage);
  const setSelectedFormat = useStore((s) => s.setSelectedFormat);
  const selectedFormat = useStore((s) => s.selectedFormat);

  return (
    <div className="px-4 md:px-8 py-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          设置
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          个性化你的 VoicePolish 体验
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            外观
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                深色模式
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                切换深色/浅色主题
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            偏好
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                界面语言
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setLanguage(e.target.value as "zh" | "en")
                }
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                默认输出格式
              </label>
              <select
                value={selectedFormat}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as OutputFormat)
                }
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 outline-none"
              >
                {Object.entries(FORMAT_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-3">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            账户
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                订阅方案
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                当前方案：
                {settings.subscriptionTier === "pro" ? "Pro" : "Free"}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                settings.subscriptionTier === "pro"
                  ? "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {settings.subscriptionTier === "pro" ? "Pro" : "Free"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              本月用量
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              已使用 {settings.monthlyMinutesUsed} /{" "}
              {settings.monthlyMinutesLimit} 分钟
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
