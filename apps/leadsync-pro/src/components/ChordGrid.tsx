"use client";

/**
 * @fileoverview 和弦网格组件 — 以网格形式展示和编辑乐谱中的和弦
 */

import { useState } from "react";
import type { Section } from "@/types";
import { formatChord, isValidChord } from "@/lib/chord-utils";

interface ChordGridProps {
  sections: Section[];
  selectedSection: number;
  selectedMeasure: number;
  selectedBeat: number;
  isEditing: boolean;
  onSelect: (section: number, measure: number, beat: number) => void;
  onChordChange: (section: number, measure: number, beat: number, chord: string) => void;
  onChordClear: (section: number, measure: number, beat: number) => void;
}

/**
 * @param {ChordGridProps} props
 * @returns {JSX.Element} 和弦网格
 */
export function ChordGrid({
  sections,
  selectedSection,
  selectedMeasure,
  selectedBeat,
  isEditing,
  onSelect,
  onChordChange,
  onChordClear,
}: ChordGridProps) {
  const [editValue, setEditValue] = useState("");
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const handleCellClick = (sectionIdx: number, measureIdx: number, beatIdx: number) => {
    onSelect(sectionIdx, measureIdx, beatIdx);

    if (isEditing) {
      const key = `${sectionIdx}-${measureIdx}-${beatIdx}`;
      const beat = sections[sectionIdx]?.measures[measureIdx]?.beats[beatIdx];
      setEditingCell(key);
      setEditValue(beat?.chord ? formatChord(beat.chord) : "");
    }
  };

  const handleEditSubmit = (sectionIdx: number, measureIdx: number, beatIdx: number) => {
    if (editValue.trim() === "") {
      onChordClear(sectionIdx, measureIdx, beatIdx);
    } else if (isValidChord(editValue)) {
      onChordChange(sectionIdx, measureIdx, beatIdx, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    sectionIdx: number,
    measureIdx: number,
    beatIdx: number
  ) => {
    if (e.key === "Enter") {
      handleEditSubmit(sectionIdx, measureIdx, beatIdx);
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleEditSubmit(sectionIdx, measureIdx, beatIdx);
      const measure = sections[sectionIdx]?.measures[measureIdx];
      if (measure && beatIdx < measure.beats.length - 1) {
        handleCellClick(sectionIdx, measureIdx, beatIdx + 1);
      } else if (sections[sectionIdx]?.measures[measureIdx + 1]) {
        handleCellClick(sectionIdx, measureIdx + 1, 0);
      }
    }
  };

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
              {section.name}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {section.measures.length} bars
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {section.measures.map((measure, measureIdx) => (
              <div
                key={measureIdx}
                className={`rounded-lg border p-1 ${
                  selectedSection === sectionIdx && selectedMeasure === measureIdx
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                }`}
              >
                <div className="flex min-h-[48px] items-stretch gap-0.5">
                  {measure.beats.map((beat, beatIdx) => {
                    const cellKey = `${sectionIdx}-${measureIdx}-${beatIdx}`;
                    const isSelected =
                      selectedSection === sectionIdx &&
                      selectedMeasure === measureIdx &&
                      selectedBeat === beatIdx;
                    const isEditingThis = editingCell === cellKey;

                    return (
                      <div
                        key={beatIdx}
                        onClick={() => handleCellClick(sectionIdx, measureIdx, beatIdx)}
                        className={`flex flex-1 cursor-pointer items-center justify-center rounded px-0.5 text-center text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-indigo-500 text-white shadow-sm"
                            : beat.chord
                            ? "text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700"
                            : "text-zinc-300 hover:bg-zinc-50 dark:text-zinc-600 dark:hover:bg-zinc-750"
                        }`}
                      >
                        {isEditingThis ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleEditSubmit(sectionIdx, measureIdx, beatIdx)}
                            onKeyDown={(e) => handleKeyDown(e, sectionIdx, measureIdx, beatIdx)}
                            className="w-full bg-transparent text-center text-sm outline-none"
                            autoFocus
                          />
                        ) : beat.isRepeat ? (
                          <span className="text-zinc-400">%</span>
                        ) : beat.isNoChord ? (
                          <span className="text-zinc-400 italic">N.C.</span>
                        ) : beat.chord ? (
                          formatChord(beat.chord)
                        ) : (
                          <span className="text-[10px]">&mdash;</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {measure.isRepeatStart && (
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-indigo-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
