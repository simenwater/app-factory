"use client";

import { Check } from "lucide-react";
import type { ViewAngle } from "@/types";

const ANGLES: { value: ViewAngle; label: string; icon: string }[] = [
  { value: 0, label: "Front", icon: "⬆️" },
  { value: 30, label: "30°", icon: "↗️" },
  { value: 45, label: "45°", icon: "↗️" },
  { value: 90, label: "Side", icon: "➡️" },
  { value: 135, label: "135°", icon: "↘️" },
  { value: 180, label: "Back", icon: "⬇️" },
  { value: 225, label: "225°", icon: "↙️" },
  { value: 270, label: "Left", icon: "⬅️" },
  { value: 315, label: "315°", icon: "↖️" },
];

/**
 * @description 视角选择器组件
 * @param {Object} props
 * @param {ViewAngle[]} props.selected - 已选角度
 * @param {(angles: ViewAngle[]) => void} props.onChange - 角度变更回调
 */
export function AngleSelector({
  selected,
  onChange,
}: {
  selected: ViewAngle[];
  onChange: (angles: ViewAngle[]) => void;
}) {
  const toggleAngle = (angle: ViewAngle) => {
    if (selected.includes(angle)) {
      onChange(selected.filter((a) => a !== angle));
    } else {
      onChange([...selected, angle]);
    }
  };

  const selectAll = () => {
    onChange(ANGLES.map((a) => a.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
          {selected.length} angle{selected.length !== 1 ? "s" : ""} selected
        </span>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-xs font-medium text-text-muted hover:underline dark:text-text-muted-dark"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ANGLES.map((angle) => {
          const isSelected = selected.includes(angle.value);
          return (
            <button
              key={angle.value}
              onClick={() => toggleAngle(angle.value)}
              className={`relative flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 dark:border-border-dark"
              }`}
            >
              {isSelected && (
                <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-0.5">
                  <Check size={10} className="text-white" />
                </div>
              )}
              <span className="text-lg">{angle.icon}</span>
              <span className="text-sm font-medium text-text dark:text-text-dark">
                {angle.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
