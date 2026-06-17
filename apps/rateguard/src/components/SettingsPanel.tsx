"use client";

/**
 * @fileoverview 设置面板组件 - 用户配置行业、经验等信息
 */

import { X } from "lucide-react";
import { useAppStore } from "@/store";
import { Industry, ExperienceLevel } from "@/types";
import { INDUSTRY_RATES } from "@/lib/industry-rates";

/** 经验等级选项 */
const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "junior", label: "初级 (0-2年)" },
  { value: "mid", label: "中级 (2-5年)" },
  { value: "senior", label: "高级 (5-10年)" },
  { value: "expert", label: "专家 (10年+)" },
];

/**
 * SettingsPanel - 用户设置面板（侧滑弹出）
 * @param props.open - 是否打开
 * @param props.onClose - 关闭回调
 */
export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useAppStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">设置</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* 行业选择 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              行业
            </label>
            <select
              value={profile.industry}
              onChange={(e) => updateProfile({ industry: e.target.value as Industry })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {Object.entries(INDUSTRY_RATES).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.label}
                </option>
              ))}
            </select>
          </div>

          {/* 经验等级 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              经验等级
            </label>
            <select
              value={profile.experienceLevel}
              onChange={(e) =>
                updateProfile({ experienceLevel: e.target.value as ExperienceLevel })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 工作年限 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              工作年限
            </label>
            <input
              type="number"
              min={0}
              max={40}
              value={profile.yearsOfExperience}
              onChange={(e) =>
                updateProfile({ yearsOfExperience: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* 最低时薪 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              最低可接受时薪 (USD)
            </label>
            <input
              type="number"
              min={0}
              value={profile.minimumHourlyRate}
              onChange={(e) =>
                updateProfile({ minimumHourlyRate: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* 货币 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              首选货币
            </label>
            <select
              value={profile.currency}
              onChange={(e) => updateProfile({ currency: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
