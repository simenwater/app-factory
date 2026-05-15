"use client";

/**
 * @fileoverview 乐谱库页面 — 展示、搜索、管理所有 LeadSheet
 */

import { useRouter } from "next/navigation";
import { Plus, Star, ArrowUpDown } from "lucide-react";
import { Music2 } from "lucide-react";
import { useLibraryStore } from "@/store/library-store";
import { useEditorStore } from "@/store/editor-store";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LeadSheetCard } from "@/components/LeadSheetCard";
import { EmptyState } from "@/components/EmptyState";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { exportToIRealUrl } from "@/lib/ireal-exporter";
import type { MusicStyle } from "@/types";

const MUSIC_STYLES: MusicStyle[] = [
  "Jazz",
  "Bossa Nova",
  "Latin",
  "Pop",
  "Blues",
  "Funk",
  "Rock",
  "Ballad",
  "Swing",
  "Waltz",
];

/**
 * @returns {JSX.Element} 乐谱库页面
 */
export default function LibraryPage() {
  const router = useRouter();
  const {
    categories,
    searchQuery,
    selectedCategory,
    selectedStyle,
    showFavoritesOnly,
    subscription,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStyle,
    setShowFavoritesOnly,
    setSortBy,
    setSortOrder,
    toggleFavorite,
    removeSheet,
    getFilteredSheets,
    sheets,
  } = useLibraryStore();

  const { loadSheet, createNewSheet } = useEditorStore();

  const filteredSheets = getFilteredSheets();

  const handleOpen = (id: string) => {
    const sheet = sheets.find((s) => s.id === id);
    if (sheet) {
      loadSheet(sheet);
      router.push("/editor");
    }
  };

  const handleExport = (id: string) => {
    const sheet = sheets.find((s) => s.id === id);
    if (!sheet) return;
    const url = exportToIRealUrl(sheet);
    window.open(url, "_blank");
  };

  const handleNewSheet = () => {
    createNewSheet();
    router.push("/editor");
  };

  const handleUpgrade = () => {
    router.push("/settings");
  };

  const toggleSort = () => {
    if (sortBy === "updatedAt") {
      setSortBy("title");
      setSortOrder("asc");
    } else {
      setSortBy("updatedAt");
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-4 px-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Library</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`rounded-lg p-2 transition-colors ${
              showFavoritesOnly
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Star size={18} />
          </button>
          <button
            onClick={toggleSort}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowUpDown size={18} />
          </button>
          <button
            onClick={handleNewSheet}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Plus size={16} />
            New
          </button>
        </div>
      </div>

      <SubscriptionBanner
        subscription={subscription}
        onUpgrade={handleUpgrade}
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        styles={MUSIC_STYLES}
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
      />

      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        {filteredSheets.length} of {sheets.length} songs
        {sortBy === "title" ? " (A-Z)" : " (Recent)"}
      </div>

      {filteredSheets.length === 0 ? (
        <EmptyState
          icon={<Music2 size={32} />}
          title="No songs yet"
          description="Import from iReal Pro or create a new lead sheet to get started."
          action={{ label: "Create New", onClick: handleNewSheet }}
        />
      ) : (
        <div className="space-y-2">
          {filteredSheets.map((sheet) => (
            <LeadSheetCard
              key={sheet.id}
              sheet={sheet}
              onOpen={handleOpen}
              onToggleFavorite={toggleFavorite}
              onDelete={removeSheet}
              onExport={handleExport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
