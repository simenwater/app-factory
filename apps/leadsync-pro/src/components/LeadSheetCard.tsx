"use client";

/**
 * @fileoverview 乐谱卡片组件 — 在列表中展示单个 LeadSheet 的摘要
 */

import type { LeadSheet } from "@/types";
import { Heart, MoreVertical, Music2 } from "lucide-react";
import { useState } from "react";

interface LeadSheetCardProps {
  sheet: LeadSheet;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

/**
 * @param {LeadSheetCardProps} props
 * @returns {JSX.Element} 乐谱卡片
 */
export function LeadSheetCard({
  sheet,
  onOpen,
  onToggleFavorite,
  onDelete,
  onExport,
}: LeadSheetCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const totalMeasures = sheet.sections.reduce(
    (sum, s) => sum + s.measures.length,
    0
  );

  return (
    <div
      className="group relative rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-indigo-600"
      onClick={() => onOpen(sheet.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Music2 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {sheet.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {sheet.composer}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(sheet.id);
            }}
            className="rounded-full p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            <Heart
              size={16}
              className={
                sheet.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-zinc-400"
              }
            />
          </button>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="rounded-full p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <MoreVertical size={16} className="text-zinc-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(sheet.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Export to iReal Pro
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sheet.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {sheet.key}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {sheet.style}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {totalMeasures} bars
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {sheet.timeSignature}
        </span>
      </div>
    </div>
  );
}
