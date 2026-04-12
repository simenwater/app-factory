"use client";

import { Briefcase, Coffee, Megaphone } from "lucide-react";
import type { ToneStyle } from "@/types";
import { TONE_OPTIONS } from "@/lib/utils";

/**
 * @interface ToneSelectorProps
 */
interface ToneSelectorProps {
  selected: ToneStyle;
  onChange: (tone: ToneStyle) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  briefcase: <Briefcase className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
  megaphone: <Megaphone className="w-5 h-5" />,
};

/**
 * @component ToneSelector
 * @description 语气风格选择器
 */
export function ToneSelector({ selected, onChange }: ToneSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        语气风格
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {TONE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
              selected === option.id
                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
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
