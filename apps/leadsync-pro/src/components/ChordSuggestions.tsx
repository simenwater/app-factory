"use client";

/**
 * @fileoverview AI 和弦推荐面板组件
 */

import type { ChordSymbol } from "@/types";
import { Sparkles } from "lucide-react";

interface ChordSuggestionsProps {
  suggestions: ChordSymbol[];
  patterns: string[];
  detectedKey: string;
  confidence: number;
  onSelectChord: (chord: ChordSymbol) => void;
}

/**
 * @param {ChordSuggestionsProps} props
 * @returns {JSX.Element} AI 和弦推荐面板
 */
export function ChordSuggestions({
  suggestions,
  patterns,
  detectedKey,
  confidence,
  onSelectChord,
}: ChordSuggestionsProps) {
  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-800/50 dark:bg-purple-950/20">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
        <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
          AI Suggestions
        </span>
        <span className="ml-auto rounded-full bg-purple-200 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-800 dark:text-purple-200">
          Key: {detectedKey} ({Math.round(confidence * 100)}%)
        </span>
      </div>

      {patterns.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs text-purple-600 dark:text-purple-400">
            Detected patterns:
          </p>
          <div className="flex flex-wrap gap-1">
            {patterns.map((p) => (
              <span
                key={p}
                className="rounded-md bg-purple-200 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-800 dark:text-purple-200"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="mb-2 text-xs text-purple-600 dark:text-purple-400">
        Next chord suggestions:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((chord, i) => (
          <button
            key={i}
            onClick={() => onSelectChord(chord)}
            className="rounded-lg border border-purple-300 bg-white px-3 py-1.5 text-sm font-medium text-purple-800 transition-all hover:border-purple-400 hover:bg-purple-100 dark:border-purple-600 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-800/60"
          >
            {chord.display}
          </button>
        ))}
      </div>
    </div>
  );
}
