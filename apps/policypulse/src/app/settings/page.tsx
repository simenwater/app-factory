"use client";

import { Settings, Bell, Globe, Shield, Building2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { INDUSTRY_LABELS, type IndustryType } from "@/types";

/**
 * @component SettingsPage
 * 用户设置页面
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const toggleEmailNotifications = useStore((s) => s.toggleEmailNotifications);
  const setLanguage = useStore((s) => s.setLanguage);
  const setSubscribedIndustries = useStore((s) => s.setSubscribedIndustries);

  /**
   * 切换关注行业
   */
  const toggleIndustry = (industry: IndustryType) => {
    const current = settings.subscribedIndustries;
    const next = current.includes(industry)
      ? current.filter((i) => i !== industry)
      : [...current, industry];
    setSubscribedIndustries(next);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            设置
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          自定义您的 PolicyPulse 体验
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            外观与语言
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  深色模式
                </p>
                <p className="text-xs text-slate-500">
                  在夜间使用更舒适的深色界面
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.darkMode ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                    settings.darkMode ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  界面语言
                </p>
                <p className="text-xs text-slate-500">选择您偏好的显示语言</p>
              </div>
              <select
                value={settings.language}
                onChange={(e) =>
                  setLanguage(e.target.value as "zh" | "en")
                }
                className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" />
            通知设置
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                邮件通知
              </p>
              <p className="text-xs text-slate-500">接收重要政策预警的邮件推送</p>
            </div>
            <button
              onClick={toggleEmailNotifications}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.emailNotifications ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                  settings.emailNotifications ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Industries */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            关注行业
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            选择您关注的行业，获取针对性的政策预警
          </p>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(INDUSTRY_LABELS) as IndustryType[]).map(
              (industry) => {
                const isSubscribed =
                  settings.subscribedIndustries.includes(industry);
                return (
                  <button
                    key={industry}
                    onClick={() => toggleIndustry(industry)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      isSubscribed
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300"
                    }`}
                  >
                    {INDUSTRY_LABELS[industry]}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            订阅状态
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                当前方案
              </p>
              <p className="text-xs text-slate-500">
                {settings.subscriptionTier === "pro"
                  ? "专业版 — $14.99/月"
                  : "免费版"}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                settings.subscriptionTier === "pro"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {settings.subscriptionTier === "pro" ? "PRO" : "FREE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
