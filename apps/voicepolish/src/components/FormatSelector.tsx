"use client";

import {
  Mail,
  Twitter,
  FileText,
  AlignLeft,
  ClipboardList,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import type { OutputFormat } from "@/types";
import { FORMAT_CONFIG } from "@/types";

/**
 * @constant FORMAT_ICONS
 * 格式图标映射
 */
const FORMAT_ICONS: Record<OutputFormat, React.ElementType> = {
  email: Mail,
  tweet: Twitter,
  blog: FileText,
  summary: AlignLeft,
  minutes: ClipboardList,
};

/**
 * @component FormatSelector
 * 输出格式选择器卡片组
 */
export function FormatSelector() {
  const selectedFormat = useStore((s) => s.selectedFormat);
  const setSelectedFormat = useStore((s) => s.setSelectedFormat);
  const tier = useStore((s) => s.settings.subscriptionTier);

  const formats = Object.entries(FORMAT_CONFIG) as [
    OutputFormat,
    (typeof FORMAT_CONFIG)[OutputFormat],
  ][];

  const proOnlyFormats: OutputFormat[] = ["blog", "tweet", "minutes"];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        选择输出格式
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {formats.map(([key, config]) => {
          const Icon = FORMAT_ICONS[key];
          const isSelected = selectedFormat === key;
          const isLocked = tier === "free" && proOnlyFormats.includes(key);

          return (
            <button
              key={key}
              onClick={() => !isLocked && setSelectedFormat(key)}
              disabled={isLocked}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                isSelected
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
              } ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{config.label}</span>
              {isLocked && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                  Pro
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
