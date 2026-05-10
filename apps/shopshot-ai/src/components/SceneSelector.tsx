"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SCENES, SCENE_CATEGORIES } from "@/lib/scenes";
import type { SceneType } from "@/types";

/**
 * @description 场景选择器组件
 * @param {Object} props
 * @param {SceneType[]} props.selected - 已选场景
 * @param {(scenes: SceneType[]) => void} props.onChange - 场景变更回调
 */
export function SceneSelector({
  selected,
  onChange,
}: {
  selected: SceneType[];
  onChange: (scenes: SceneType[]) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredScenes =
    activeCategory === "all"
      ? SCENES
      : SCENES.filter((s) => s.category === activeCategory);

  const toggleScene = (id: SceneType) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {SCENE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-white"
                : "bg-surface text-text-muted hover:bg-primary/10 dark:bg-surface-dark dark:text-text-muted-dark"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredScenes.map((scene) => {
          const isSelected = selected.includes(scene.id);
          return (
            <button
              key={scene.id}
              onClick={() => toggleScene(scene.id)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30 dark:border-border-dark"
              }`}
            >
              {isSelected && (
                <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <span className="mb-2 block text-2xl">{scene.thumbnail}</span>
              <p className="text-sm font-medium text-text dark:text-text-dark">
                {scene.name}
              </p>
              <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
                {scene.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
