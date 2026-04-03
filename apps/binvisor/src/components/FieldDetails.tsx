"use client";

/**
 * @fileoverview 字段详情面板 - 显示选中字段的详细信息
 */

import { useStore } from "@/store/useStore";
import { Info, X } from "lucide-react";

/**
 * 字段详情侧边栏
 * @returns {React.ReactElement | null}
 */
export default function FieldDetails() {
  const structure = useStore((s) => s.structure);
  const selectedFieldIndex = useStore((s) => s.selectedFieldIndex);
  const selectField = useStore((s) => s.selectField);

  if (!structure || selectedFieldIndex === null) return null;

  const field = structure.fields[selectedFieldIndex];
  if (!field) return null;

  const offsetBits = structure.fields
    .slice(0, selectedFieldIndex)
    .reduce((sum, f) => sum + f.bits, 0);

  return (
    <div className="absolute right-4 top-4 w-72 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 z-40 overflow-hidden">
      <div
        className="h-2"
        style={{ backgroundColor: field.color || "#6366f1" }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Field Details
            </h3>
          </div>
          <button
            onClick={() => selectField(null)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <DetailRow label="Name" value={field.name} />
          <DetailRow label="Type" value={field.type} />
          <DetailRow label="Size" value={`${field.bits} bits`} />
          <DetailRow label="Offset" value={`${offsetBits} bits (byte ${offsetBits / 8})`} />
          {field.description && (
            <DetailRow label="Description" value={field.description} />
          )}
          <DetailRow label="Byte Order" value={structure.endianness === "big" ? "Big Endian" : "Little Endian"} />
        </div>
      </div>
    </div>
  );
}

/**
 * 详情行组件
 * @param {{ label: string; value: string }} props
 */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">
        {label}
      </p>
      <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
        {value}
      </p>
    </div>
  );
}
