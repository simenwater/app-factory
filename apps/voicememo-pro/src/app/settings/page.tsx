"use client";

import { useStore } from "@/store/useStore";
import { TONE_OPTIONS, PLATFORM_OPTIONS, getUsagePercentage } from "@/lib/utils";
import type { ToneStyle, PlatformFormat } from "@/types";

/**
 * @component SettingsPage
 * @description 设置页面
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const setDefaultTone = useStore((s) => s.setDefaultTone);
  const setDefaultPlatform = useStore((s) => s.setDefaultPlatform);

  const pct = getUsagePercentage(
    settings.monthlyMinutesUsed,
    settings.monthlyMinutesLimit
  );

  return (
    <div className="space-y-8 max-w-2xl mx-auto fade-in">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        设置
      </h1>

      {/* 账户信息 */}
      <Section title="账户信息">
        <InfoRow
          label="订阅方案"
          value={
            settings.subscriptionTier === "free"
              ? "免费版"
              : settings.subscriptionTier === "monthly"
              ? "专业版（月付）"
              : "买断版"
          }
        />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">本月用量</span>
            <span className="text-slate-800 dark:text-slate-200">
              {settings.monthlyMinutesUsed} / {settings.monthlyMinutesLimit} 分钟
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </Section>

      {/* 外观 */}
      <Section title="外观">
        <ToggleRow
          label="深色模式"
          description="使用暗色主题以减轻眼睛疲劳"
          checked={settings.darkMode}
          onChange={toggleDarkMode}
        />
      </Section>

      {/* 默认设置 */}
      <Section title="默认偏好">
        <SelectRow
          label="默认语气风格"
          value={settings.defaultTone}
          options={TONE_OPTIONS.map((t) => ({ value: t.id, label: t.label }))}
          onChange={(v) => setDefaultTone(v as ToneStyle)}
        />
        <SelectRow
          label="默认输出格式"
          value={settings.defaultPlatform}
          options={PLATFORM_OPTIONS.map((p) => ({ value: p.id, label: p.label }))}
          onChange={(v) => setDefaultPlatform(v as PlatformFormat)}
        />
      </Section>
    </div>
  );
}

/**
 * @component Section
 * @description 设置分组
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-5 pt-4 pb-2">
        {title}
      </h2>
      <div className="divide-y divide-slate-100 dark:divide-slate-700 px-5 pb-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

/**
 * @component InfoRow
 * @description 信息行
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm pt-2">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="text-slate-800 dark:text-slate-200 font-medium">
        {value}
      </span>
    </div>
  );
}

/**
 * @component ToggleRow
 * @description 开关行
 */
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-violet-500" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

/**
 * @component SelectRow
 * @description 下拉选择行
 */
function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
