"use client";

/**
 * @fileoverview 乐谱编辑器页面
 * 提供和弦网格编辑、AI 和弦推荐、元数据编辑等功能
 */

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Undo2,
  Redo2,
  PenLine,
  Eye,
  Plus,
  Minus,
  Download,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { useLibraryStore } from "@/store/library-store";
import { ChordGrid } from "@/components/ChordGrid";
import { ChordSuggestions } from "@/components/ChordSuggestions";
import { EmptyState } from "@/components/EmptyState";
import { exportToIRealUrl } from "@/lib/ireal-exporter";
import { suggestNextChord, detectKey, detectPatterns } from "@/lib/ai-chord";
import { NOTE_NAMES } from "@/lib/chord-utils";
import type { MusicStyle, ChordSymbol } from "@/types";

const STYLES: MusicStyle[] = [
  "Jazz", "Bossa Nova", "Latin", "Pop", "Blues",
  "Funk", "Rock", "Ballad", "Swing", "Waltz", "Other",
];

const TIME_SIGNATURES = ["4/4", "3/4", "2/4", "5/4", "6/8", "7/8"];

/**
 * @returns {JSX.Element} 编辑器页面
 */
export default function EditorPage() {
  const router = useRouter();
  const [showAI, setShowAI] = useState(false);

  const {
    currentSheet,
    selectedSection,
    selectedMeasure,
    selectedBeat,
    isEditing,
    isDirty,
    setSelection,
    setIsEditing,
    updateTitle,
    updateComposer,
    updateKey,
    updateStyle,
    updateTimeSignature,
    setChordAt,
    clearChordAt,
    addMeasure,
    removeMeasure,
    addSection,
    removeSection,
    undo,
    redo,
    canUndo,
    canRedo,
    createNewSheet,
    markClean,
  } = useEditorStore();

  const { addSheet, updateSheet } = useLibraryStore();

  const allChords = useMemo(() => {
    if (!currentSheet) return [];
    const chords: ChordSymbol[] = [];
    for (const section of currentSheet.sections) {
      for (const measure of section.measures) {
        for (const beat of measure.beats) {
          if (beat.chord) chords.push(beat.chord);
        }
      }
    }
    return chords;
  }, [currentSheet]);

  const aiAnalysis = useMemo(() => {
    if (allChords.length === 0) {
      return { key: "C", confidence: 0, patterns: [], suggestions: [] };
    }
    const { key, confidence } = detectKey(allChords);
    const patterns = detectPatterns(allChords, key);
    const suggestions = suggestNextChord(allChords, key);
    return { key, confidence, patterns, suggestions };
  }, [allChords]);

  const handleSave = useCallback(() => {
    if (!currentSheet) return;
    const now = new Date().toISOString();
    const updated = { ...currentSheet, updatedAt: now };

    const { sheets } = useLibraryStore.getState();
    const exists = sheets.find((s) => s.id === currentSheet.id);
    if (exists) {
      updateSheet(currentSheet.id, updated);
    } else {
      addSheet(updated);
    }
    markClean();
  }, [currentSheet, addSheet, updateSheet, markClean]);

  const handleExport = useCallback(() => {
    if (!currentSheet) return;
    const url = exportToIRealUrl(currentSheet);
    window.open(url, "_blank");
  }, [currentSheet]);

  const handleAISuggestionSelect = useCallback(
    (chord: ChordSymbol) => {
      setChordAt(selectedSection, selectedMeasure, selectedBeat, chord.display);
    },
    [selectedSection, selectedMeasure, selectedBeat, setChordAt]
  );

  if (!currentSheet) {
    return (
      <div className="px-4 animate-fade-in">
        <EmptyState
          icon={<PenLine size={32} />}
          title="No sheet loaded"
          description="Create a new lead sheet or open one from your library."
          action={{
            label: "Create New",
            onClick: createNewSheet,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/library")}
          className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ChevronLeft size={16} /> Library
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => undo()}
            disabled={!canUndo()}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={() => redo()}
            disabled={!canRedo()}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
          >
            <Redo2 size={16} />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-lg p-2 transition-colors ${
              isEditing
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400"
                : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {isEditing ? <PenLine size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={handleExport}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <input
          type="text"
          value={currentSheet.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full bg-transparent text-xl font-bold outline-none placeholder-zinc-300 dark:placeholder-zinc-600"
          placeholder="Song Title"
        />
        <input
          type="text"
          value={currentSheet.composer}
          onChange={(e) => updateComposer(e.target.value)}
          className="w-full bg-transparent text-sm text-zinc-500 outline-none placeholder-zinc-300 dark:text-zinc-400 dark:placeholder-zinc-600"
          placeholder="Composer"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={currentSheet.key}
            onChange={(e) => updateKey(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
          >
            {NOTE_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select
            value={currentSheet.style}
            onChange={(e) => updateStyle(e.target.value as MusicStyle)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={currentSheet.timeSignature}
            onChange={(e) => updateTimeSignature(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
          >
            {TIME_SIGNATURES.map((ts) => (
              <option key={ts} value={ts}>
                {ts}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Toggle */}
      <button
        onClick={() => setShowAI(!showAI)}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
          showAI
            ? "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-purple-200 hover:bg-purple-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-purple-700"
        }`}
      >
        <Sparkles size={16} />
        {showAI ? "Hide AI Assistant" : "Show AI Assistant"}
      </button>

      {/* AI Suggestions */}
      {showAI && (
        <ChordSuggestions
          suggestions={aiAnalysis.suggestions}
          patterns={aiAnalysis.patterns}
          detectedKey={aiAnalysis.key}
          confidence={aiAnalysis.confidence}
          onSelectChord={handleAISuggestionSelect}
        />
      )}

      {/* Chord Grid */}
      <ChordGrid
        sections={currentSheet.sections}
        selectedSection={selectedSection}
        selectedMeasure={selectedMeasure}
        selectedBeat={selectedBeat}
        isEditing={isEditing}
        onSelect={setSelection}
        onChordChange={setChordAt}
        onChordClear={clearChordAt}
      />

      {/* Section / Measure Controls */}
      {isEditing && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addMeasure(selectedSection, selectedMeasure)}
            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Plus size={12} /> Add Bar
          </button>
          <button
            onClick={() => removeMeasure(selectedSection, selectedMeasure)}
            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Minus size={12} /> Remove Bar
          </button>
          <button
            onClick={() => {
              const names = "ABCDEFGH";
              const nextName = names[currentSheet.sections.length] || "X";
              addSection(nextName);
            }}
            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Plus size={12} /> Add Section
          </button>
          {currentSheet.sections.length > 1 && (
            <button
              onClick={() => removeSection(selectedSection)}
              className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Minus size={12} /> Remove Section
            </button>
          )}
        </div>
      )}
    </div>
  );
}
