"use client";

/**
 * @fileoverview 乐谱库管理页面
 * 支持搜索、筛选、删除和导出操作。
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Music,
  Star,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { EmptyState } from "@/components/EmptyState";
import { exportSheet } from "@/lib/exportUtils";
import { getAllSheets, deleteSheet as dbDeleteSheet, importFromJson, exportAllAsJson } from "@/lib/db";
import type { LeadSheet, MusicStyle, ExportFormat } from "@/types";

/**
 * @description 乐谱库页面
 */
export default function LibraryPage() {
  const sheets = useStore((s) => s.sheets);
  const setSheets = useStore((s) => s.setSheets);
  const removeSheet = useStore((s) => s.removeSheet);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const [search, setSearch] = useState("");
  const [filterStyle, setFilterStyle] = useState<MusicStyle | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);

  useEffect(() => {
    async function loadFromDB() {
      try {
        const dbSheets = await getAllSheets();
        if (dbSheets.length > 0 && sheets.length === 0) {
          setSheets(dbSheets);
        }
      } catch {
        // IndexedDB not available
      }
    }
    loadFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = sheets.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !s.title.toLowerCase().includes(q) &&
        !s.composer.toLowerCase().includes(q) &&
        !s.tags.some((tag: string) => tag.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    if (filterStyle !== "all" && s.style !== filterStyle) return false;
    if (showFavoritesOnly && !s.isFavorite) return false;
    return true;
  });

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("确定要删除这份乐谱吗？")) return;
      removeSheet(id);
      try {
        await dbDeleteSheet(id);
      } catch {
        // DB might not be available
      }
    },
    [removeSheet]
  );

  const handleExport = useCallback(
    (sheet: LeadSheet, format: ExportFormat) => {
      exportSheet(sheet, format);
      setShowExportMenu(null);
    },
    []
  );

  const handleExportAll = useCallback(async () => {
    try {
      const json = await exportAllAsJson();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leadsheet-ai-library.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      const json = JSON.stringify(sheets, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leadsheet-ai-library.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [sheets]);

  const handleImport = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const imported: LeadSheet[] = JSON.parse(text);
        for (const s of imported) {
          useStore.getState().addSheet(s);
        }
        try {
          await importFromJson(text);
        } catch {
          // DB fallback
        }
        alert(`成功导入 ${imported.length} 份乐谱`);
      } catch {
        alert("导入失败：无效的 JSON 文件");
      }
    };
    input.click();
  }, []);

  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">乐谱库</h1>
        <div className="flex gap-2">
          <button
            onClick={handleImport}
            className="rounded-lg p-2 hover:bg-surface dark:hover:bg-surface-dark"
            title="导入"
          >
            <Upload size={18} />
          </button>
          <button
            onClick={handleExportAll}
            className="rounded-lg p-2 hover:bg-surface dark:hover:bg-surface-dark"
            title="导出全部"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索曲名、作曲家或标签..."
          className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm dark:border-border-dark dark:bg-surface-dark"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            showFavoritesOnly
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-surface text-text-muted dark:bg-surface-dark dark:text-text-muted-dark"
          }`}
        >
          <Star size={12} />
          收藏
        </button>
        {(["all", "jazz-swing", "jazz-bossa", "blues", "pop"] as const).map(
          (style) => (
            <button
              key={style}
              onClick={() => setFilterStyle(style)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                filterStyle === style
                  ? "bg-primary/10 text-primary"
                  : "bg-surface text-text-muted dark:bg-surface-dark dark:text-text-muted-dark"
              }`}
            >
              {style === "all" ? "全部" : style.replace("jazz-", "")}
            </button>
          )
        )}
      </div>

      {/* Sheet List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Music}
          title="暂无乐谱"
          description={search ? "没有找到匹配的乐谱" : "点击生成按钮创建你的第一份乐谱"}
          action={
            <Link
              href="/generate"
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white"
            >
              AI 生成
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((sheet) => (
            <div
              key={sheet.id}
              className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark"
            >
              <div className="flex items-start justify-between">
                <Link
                  href={`/player/${sheet.id}`}
                  className="flex-1"
                >
                  <h3 className="font-medium text-text dark:text-text-dark">
                    {sheet.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-text-muted dark:text-text-muted-dark">
                    {sheet.key} · {sheet.tempo} BPM · {sheet.measures.length} 小节 ·{" "}
                    {sheet.style.replace("jazz-", "")}
                  </p>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavorite(sheet.id)}
                    className="rounded-lg p-1.5 hover:bg-bg dark:hover:bg-bg-dark"
                  >
                    <Star
                      size={16}
                      className={sheet.isFavorite ? "fill-amber-500 text-amber-500" : "text-text-muted dark:text-text-muted-dark"}
                    />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowExportMenu(
                          showExportMenu === sheet.id ? null : sheet.id
                        )
                      }
                      className="rounded-lg p-1.5 hover:bg-bg dark:hover:bg-bg-dark"
                    >
                      <Download size={16} className="text-text-muted dark:text-text-muted-dark" />
                    </button>

                    {showExportMenu === sheet.id && (
                      <div className="absolute right-0 top-8 z-10 min-w-[120px] rounded-xl border border-border bg-surface p-1 shadow-xl dark:border-border-dark dark:bg-surface-dark">
                        {(["pdf", "abc", "musicxml", "json"] as ExportFormat[]).map(
                          (fmt) => (
                            <button
                              key={fmt}
                              onClick={() => handleExport(sheet, fmt)}
                              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-bg dark:hover:bg-bg-dark"
                            >
                              {fmt.toUpperCase()}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(sheet.id)}
                    className="rounded-lg p-1.5 hover:bg-danger/10"
                  >
                    <Trash2 size={16} className="text-danger" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
