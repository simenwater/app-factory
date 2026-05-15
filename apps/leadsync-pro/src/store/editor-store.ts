/**
 * @fileoverview 乐谱编辑器状态管理
 * 管理当前编辑中的 LeadSheet、光标位置、撤销/重做等
 */

import { create } from "zustand";
import type { LeadSheet, Measure, Beat, EditorAction } from "@/types";
import { parseChord } from "@/lib/chord-utils";
import { v4 as uuidv4 } from "uuid";

/** 编辑器 Store 接口 */
interface EditorStore {
  currentSheet: LeadSheet | null;
  selectedSection: number;
  selectedMeasure: number;
  selectedBeat: number;
  isEditing: boolean;
  history: EditorAction[];
  historyIndex: number;
  isDirty: boolean;

  loadSheet: (sheet: LeadSheet) => void;
  createNewSheet: () => void;
  setSelection: (section: number, measure: number, beat: number) => void;
  setIsEditing: (editing: boolean) => void;

  updateTitle: (title: string) => void;
  updateComposer: (composer: string) => void;
  updateKey: (key: string) => void;
  updateStyle: (style: LeadSheet["style"]) => void;
  updateTimeSignature: (ts: string) => void;

  setChordAt: (sectionIdx: number, measureIdx: number, beatIdx: number, chord: string) => void;
  clearChordAt: (sectionIdx: number, measureIdx: number, beatIdx: number) => void;
  addMeasure: (sectionIdx: number, afterMeasureIdx: number) => void;
  removeMeasure: (sectionIdx: number, measureIdx: number) => void;
  addSection: (name: string) => void;
  removeSection: (sectionIdx: number) => void;
  renameSection: (sectionIdx: number, name: string) => void;
  addBeat: (sectionIdx: number, measureIdx: number) => void;
  removeBeat: (sectionIdx: number, measureIdx: number, beatIdx: number) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  getSheet: () => LeadSheet | null;
  markClean: () => void;
}

/**
 * 创建空白乐谱
 * @returns {LeadSheet} 新乐谱
 */
function createEmptySheet(): LeadSheet {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title: "Untitled",
    composer: "Unknown",
    style: "Jazz",
    key: "C",
    timeSignature: "4/4",
    sections: [
      {
        name: "A",
        measures: Array.from({ length: 8 }, () => ({
          beats: [
            { chord: null },
            { chord: null },
            { chord: null },
            { chord: null },
          ],
          timeSignature: "4/4",
        })),
      },
    ],
    createdAt: now,
    updatedAt: now,
    tags: [],
    isFavorite: false,
  };
}

/**
 * 创建空白小节
 * @param {string} timeSignature - 拍号
 * @returns {Measure} 新小节
 */
function createEmptyMeasure(timeSignature: string = "4/4"): Measure {
  const [beatsPerMeasure] = timeSignature.split("/").map(Number);
  return {
    beats: Array.from({ length: beatsPerMeasure || 4 }, () => ({
      chord: null,
    })),
    timeSignature,
  };
}

export const useEditorStore = create<EditorStore>()((set, get) => ({
  currentSheet: null,
  selectedSection: 0,
  selectedMeasure: 0,
  selectedBeat: 0,
  isEditing: false,
  history: [],
  historyIndex: -1,
  isDirty: false,

  loadSheet: (sheet) =>
    set({
      currentSheet: structuredClone(sheet),
      selectedSection: 0,
      selectedMeasure: 0,
      selectedBeat: 0,
      isEditing: false,
      history: [],
      historyIndex: -1,
      isDirty: false,
    }),

  createNewSheet: () =>
    set({
      currentSheet: createEmptySheet(),
      selectedSection: 0,
      selectedMeasure: 0,
      selectedBeat: 0,
      isEditing: false,
      history: [],
      historyIndex: -1,
      isDirty: true,
    }),

  setSelection: (section, measure, beat) =>
    set({
      selectedSection: section,
      selectedMeasure: measure,
      selectedBeat: beat,
    }),

  setIsEditing: (editing) => set({ isEditing: editing }),

  updateTitle: (title) =>
    set((state) => ({
      currentSheet: state.currentSheet
        ? { ...state.currentSheet, title }
        : null,
      isDirty: true,
    })),

  updateComposer: (composer) =>
    set((state) => ({
      currentSheet: state.currentSheet
        ? { ...state.currentSheet, composer }
        : null,
      isDirty: true,
    })),

  updateKey: (key) =>
    set((state) => ({
      currentSheet: state.currentSheet
        ? { ...state.currentSheet, key }
        : null,
      isDirty: true,
    })),

  updateStyle: (style) =>
    set((state) => ({
      currentSheet: state.currentSheet
        ? { ...state.currentSheet, style }
        : null,
      isDirty: true,
    })),

  updateTimeSignature: (ts) =>
    set((state) => ({
      currentSheet: state.currentSheet
        ? { ...state.currentSheet, timeSignature: ts }
        : null,
      isDirty: true,
    })),

  setChordAt: (sectionIdx, measureIdx, beatIdx, chordStr) => {
    const state = get();
    if (!state.currentSheet) return;

    const chord = parseChord(chordStr);
    if (!chord) return;

    const sections = structuredClone(state.currentSheet.sections);
    const section = sections[sectionIdx];
    if (!section) return;
    const measure = section.measures[measureIdx];
    if (!measure) return;

    while (measure.beats.length <= beatIdx) {
      measure.beats.push({ chord: null });
    }

    const prevValue = measure.beats[beatIdx];
    measure.beats[beatIdx] = { chord };

    const action: EditorAction = {
      type: "modify",
      target: "chord",
      sectionIndex: sectionIdx,
      measureIndex: measureIdx,
      beatIndex: beatIdx,
      previousValue: prevValue,
      newValue: { chord },
      timestamp: Date.now(),
    };

    set({
      currentSheet: { ...state.currentSheet, sections },
      history: [...state.history.slice(0, state.historyIndex + 1), action],
      historyIndex: state.historyIndex + 1,
      isDirty: true,
    });
  },

  clearChordAt: (sectionIdx, measureIdx, beatIdx) => {
    const state = get();
    if (!state.currentSheet) return;

    const sections = structuredClone(state.currentSheet.sections);
    const section = sections[sectionIdx];
    if (!section) return;
    const measure = section.measures[measureIdx];
    if (!measure || !measure.beats[beatIdx]) return;

    measure.beats[beatIdx] = { chord: null };

    set({
      currentSheet: { ...state.currentSheet, sections },
      isDirty: true,
    });
  },

  addMeasure: (sectionIdx, afterMeasureIdx) => {
    const state = get();
    if (!state.currentSheet) return;

    const sections = structuredClone(state.currentSheet.sections);
    const section = sections[sectionIdx];
    if (!section) return;

    const ts = state.currentSheet.timeSignature;
    section.measures.splice(afterMeasureIdx + 1, 0, createEmptyMeasure(ts));

    set({
      currentSheet: { ...state.currentSheet, sections },
      isDirty: true,
    });
  },

  removeMeasure: (sectionIdx, measureIdx) => {
    const state = get();
    if (!state.currentSheet) return;

    const sections = structuredClone(state.currentSheet.sections);
    const section = sections[sectionIdx];
    if (!section || section.measures.length <= 1) return;

    section.measures.splice(measureIdx, 1);

    set({
      currentSheet: { ...state.currentSheet, sections },
      isDirty: true,
    });
  },

  addSection: (name) => {
    const state = get();
    if (!state.currentSheet) return;

    const ts = state.currentSheet.timeSignature;
    const sections = [
      ...state.currentSheet.sections,
      {
        name,
        measures: Array.from({ length: 8 }, () => createEmptyMeasure(ts)),
      },
    ];

    set({
      currentSheet: { ...state.currentSheet, sections },
      isDirty: true,
    });
  },

  removeSection: (sectionIdx) => {
    const state = get();
    if (!state.currentSheet || state.currentSheet.sections.length <= 1) return;

    const sections = state.currentSheet.sections.filter(
      (_, i) => i !== sectionIdx
    );

    set({
      currentSheet: { ...state.currentSheet, sections },
      selectedSection: Math.min(state.selectedSection, sections.length - 1),
      isDirty: true,
    });
  },

  renameSection: (sectionIdx, name) => {
    const state = get();
    if (!state.currentSheet) return;

    const sections = structuredClone(state.currentSheet.sections);
    if (sections[sectionIdx]) {
      sections[sectionIdx].name = name;
    }

    set({
      currentSheet: { ...state.currentSheet, sections },
      isDirty: true,
    });
  },

  addBeat: (sectionIdx, measureIdx) => {
    const state = get();
    if (!state.currentSheet) return;

    const sections = structuredClone(state.currentSheet.sections);
    const measure = sections[sectionIdx]?.measures[measureIdx];
    if (!measure) return;

    measure.beats.push({ chord: null });

    set({
      currentSheet: { ...state.currentSheet, sections },
      isDirty: true,
    });
  },

  removeBeat: (sectionIdx, measureIdx, beatIdx) => {
    const state = get();
    if (!state.currentSheet) return;

    const sections = structuredClone(state.currentSheet.sections);
    const measure = sections[sectionIdx]?.measures[measureIdx];
    if (!measure || measure.beats.length <= 1) return;

    measure.beats.splice(beatIdx, 1);

    set({
      currentSheet: { ...state.currentSheet, sections },
      isDirty: true,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex < 0 || !state.currentSheet) return;

    const action = state.history[state.historyIndex];
    const sections = structuredClone(state.currentSheet.sections);

    if (action.target === "chord" && action.beatIndex !== undefined) {
      const measure = sections[action.sectionIndex]?.measures[action.measureIndex];
      if (measure) {
        measure.beats[action.beatIndex] = action.previousValue as Beat;
      }
    }

    set({
      currentSheet: { ...state.currentSheet, sections },
      historyIndex: state.historyIndex - 1,
    });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1 || !state.currentSheet) return;

    const action = state.history[state.historyIndex + 1];
    const sections = structuredClone(state.currentSheet.sections);

    if (action.target === "chord" && action.beatIndex !== undefined) {
      const measure = sections[action.sectionIndex]?.measures[action.measureIndex];
      if (measure) {
        measure.beats[action.beatIndex] = action.newValue as Beat;
      }
    }

    set({
      currentSheet: { ...state.currentSheet, sections },
      historyIndex: state.historyIndex + 1,
    });
  },

  canUndo: () => get().historyIndex >= 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  getSheet: () => get().currentSheet,
  markClean: () => set({ isDirty: false }),
}));
