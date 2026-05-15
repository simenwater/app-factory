"use client";

/**
 * @fileoverview 分类/风格筛选器组件
 */

import type { Category, MusicStyle } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  styles: MusicStyle[];
  selectedStyle: MusicStyle | null;
  onSelectStyle: (style: MusicStyle | null) => void;
}

/**
 * @param {CategoryFilterProps} props
 * @returns {JSX.Element} 分类与风格筛选栏
 */
export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  styles,
  selectedStyle,
  onSelectStyle,
}: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            selectedCategory === null
              ? "bg-indigo-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              onSelectCategory(selectedCategory === cat.id ? null : cat.id)
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? "text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            }`}
            style={
              selectedCategory === cat.id
                ? { backgroundColor: cat.color }
                : undefined
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectStyle(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            selectedStyle === null
              ? "bg-amber-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          }`}
        >
          All Styles
        </button>
        {styles.map((style) => (
          <button
            key={style}
            onClick={() =>
              onSelectStyle(selectedStyle === style ? null : style)
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedStyle === style
                ? "bg-amber-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
