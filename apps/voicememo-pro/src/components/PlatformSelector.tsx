"use client";

import { Linkedin, FileText, Mail, Twitter, AlignLeft } from "lucide-react";
import type { PlatformFormat } from "@/types";
import { PLATFORM_OPTIONS } from "@/lib/utils";

/**
 * @interface PlatformSelectorProps
 */
interface PlatformSelectorProps {
  selected: PlatformFormat;
  onChange: (platform: PlatformFormat) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-5 h-5" />,
  "file-text": <FileText className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  "align-left": <AlignLeft className="w-5 h-5" />,
};

/**
 * @component PlatformSelector
 * @description 平台格式选择器
 */
export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        输出格式
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {PLATFORM_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
              selected === option.id
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
            }`}
          >
            {ICON_MAP[option.icon]}
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
