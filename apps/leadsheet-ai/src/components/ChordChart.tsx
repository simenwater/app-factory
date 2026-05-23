"use client";

/**
 * @fileoverview 和弦图表组件
 * 以网格形式展示乐谱的和弦进行。
 */

import type { Measure } from "@/types";
import { formatChord } from "@/lib/chordParser";

interface ChordChartProps {
  measures: Measure[];
  currentMeasure?: number;
  measuresPerRow?: number;
}

/**
 * @description 和弦图表展示组件
 */
export function ChordChart({
  measures,
  currentMeasure = -1,
  measuresPerRow = 4,
}: ChordChartProps) {
  const rows: Measure[][] = [];
  for (let i = 0; i < measures.length; i += measuresPerRow) {
    rows.push(measures.slice(i, i + measuresPerRow));
  }

  return (
    <div className="space-y-1">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-0">
          {row.map((measure, colIdx) => {
            const absIdx = rowIdx * measuresPerRow + colIdx;
            const isActive = absIdx === currentMeasure;
            const chordText = measure.chords
              .map(formatChord)
              .join(" ");

            return (
              <div
                key={colIdx}
                className={`flex flex-1 items-center justify-center border border-border/40 px-2 py-4 text-center font-mono text-sm transition-all dark:border-border-dark/40 ${
                  isActive
                    ? "bg-primary/20 text-primary shadow-inner ring-2 ring-primary/40"
                    : "bg-surface/50 text-text hover:bg-surface dark:bg-surface-dark/50 dark:text-text-dark dark:hover:bg-surface-dark"
                } ${colIdx === 0 ? "rounded-l-lg border-l-2 border-l-text-muted/30 dark:border-l-text-muted-dark/30" : ""} ${colIdx === row.length - 1 ? "rounded-r-lg" : ""}`}
              >
                <span className={`font-semibold ${isActive ? "text-lg" : ""}`}>
                  {chordText}
                </span>
              </div>
            );
          })}
          {row.length < measuresPerRow &&
            Array.from({ length: measuresPerRow - row.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex-1" />
            ))}
        </div>
      ))}
    </div>
  );
}
