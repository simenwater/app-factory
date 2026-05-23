/**
 * @fileoverview 和弦解析与转换工具
 * 将和弦符号（如 Cmaj7, Dm7, G7）解析为结构化数据，
 * 并提供和弦音符频率计算。
 */

import type { Chord, ChordQuality, NoteName, Accidental } from "@/types";

/** 音符到半音数的映射 */
const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3,
  E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8,
  Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

/** 和弦质量对应的音程（半音数） */
const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dominant7: [0, 4, 7, 10],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  "half-diminished": [0, 3, 6, 10],
  minor7b5: [0, 3, 6, 10],
  sus4: [0, 5, 7],
  sus2: [0, 2, 7],
  add9: [0, 4, 7, 14],
  dominant9: [0, 4, 7, 10, 14],
  minor9: [0, 3, 7, 10, 14],
  major9: [0, 4, 7, 11, 14],
  dominant13: [0, 4, 7, 10, 14, 21],
};

/**
 * @description 将和弦质量后缀映射表
 */
const QUALITY_MAP: [RegExp, ChordQuality][] = [
  [/^maj9/, "major9"],
  [/^maj7/, "major7"],
  [/^m9/, "minor9"],
  [/^m7b5/, "minor7b5"],
  [/^m7/, "minor7"],
  [/^min7/, "minor7"],
  [/^min/, "minor"],
  [/^m(?!aj)/, "minor"],
  [/^dim/, "diminished"],
  [/^aug/, "augmented"],
  [/^ø/, "half-diminished"],
  [/^7#9/, "dominant7"],
  [/^7b9/, "dominant7"],
  [/^13/, "dominant13"],
  [/^9/, "dominant9"],
  [/^7/, "dominant7"],
  [/^sus4/, "sus4"],
  [/^sus2/, "sus2"],
  [/^add9/, "add9"],
  [/^6/, "major"],
];

/**
 * @description 解析和弦符号字符串为 Chord 对象
 * @param {string} symbol - 和弦符号，如 "Cmaj7", "Dm7", "G7", "Bb7"
 * @param {number} [beats=4] - 该和弦持续的拍数
 * @returns {Chord | null} 解析后的 Chord 对象，或 null（无法解析时）
 */
export function parseChord(symbol: string, beats: number = 4): Chord | null {
  if (!symbol || symbol.trim().length === 0) return null;

  const trimmed = symbol.trim();
  let idx = 0;

  const rootChar = trimmed[idx]?.toUpperCase();
  if (!rootChar || !"CDEFGAB".includes(rootChar)) return null;
  idx++;

  let accidental: Accidental = "";
  if (trimmed[idx] === "#" || trimmed[idx] === "♯") {
    accidental = "#";
    idx++;
  } else if (trimmed[idx] === "b" || trimmed[idx] === "♭") {
    accidental = "b";
    idx++;
  }

  const suffix = trimmed.slice(idx);
  let quality: ChordQuality = "major";

  if (suffix.length > 0) {
    for (const [pattern, q] of QUALITY_MAP) {
      if (pattern.test(suffix)) {
        quality = q;
        break;
      }
    }
  }

  return {
    root: rootChar as NoteName,
    accidental,
    quality,
    beats,
  };
}

/**
 * @description 将 Chord 对象格式化为显示用符号
 * @param {Chord} chord - 和弦对象
 * @returns {string} 格式化后的和弦符号
 */
export function formatChord(chord: Chord): string {
  const qualitySymbol: Record<ChordQuality, string> = {
    major: "",
    minor: "m",
    dominant7: "7",
    major7: "maj7",
    minor7: "m7",
    diminished: "dim",
    augmented: "aug",
    "half-diminished": "ø7",
    minor7b5: "m7♭5",
    sus4: "sus4",
    sus2: "sus2",
    add9: "add9",
    dominant9: "9",
    minor9: "m9",
    major9: "maj9",
    dominant13: "13",
  };

  return `${chord.root}${chord.accidental}${qualitySymbol[chord.quality]}`;
}

/**
 * @description 获取和弦中各音的 MIDI 编号（基于 C3=60）
 * @param {Chord} chord - 和弦对象
 * @param {number} [octave=3] - 根音所在八度
 * @returns {number[]} MIDI 编号数组
 */
export function getChordMidiNotes(chord: Chord, octave: number = 3): number[] {
  const rootKey = `${chord.root}${chord.accidental === "#" ? "#" : chord.accidental === "b" ? "b" : ""}`;
  const rootSemitone = NOTE_TO_SEMITONE[rootKey];
  if (rootSemitone === undefined) return [];

  const baseMidi = 12 * (octave + 1) + rootSemitone;
  const intervals = CHORD_INTERVALS[chord.quality] || [0, 4, 7];

  return intervals.map((interval) => baseMidi + interval);
}

/**
 * @description 将 MIDI 编号转换为频率（Hz）
 * @param {number} midi - MIDI 编号
 * @returns {number} 频率（Hz）
 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * @description 获取和弦中各音的频率
 * @param {Chord} chord - 和弦对象
 * @param {number} [octave=3] - 根音所在八度
 * @returns {number[]} 频率数组（Hz）
 */
export function getChordFrequencies(chord: Chord, octave: number = 3): number[] {
  return getChordMidiNotes(chord, octave).map(midiToFrequency);
}

/**
 * @description 获取所有 12 调的和弦级数（大调）
 * @param {string} key - 调号，如 "C", "Bb", "F#"
 * @returns {string[]} 七个自然和弦符号
 */
export function getDiatonicChords(key: string): string[] {
  const scalePattern = [0, 2, 4, 5, 7, 9, 11];
  const qualities = ["maj7", "m7", "m7", "maj7", "7", "m7", "m7♭5"];
  const noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

  const rootSemitone = NOTE_TO_SEMITONE[key] ?? 0;

  return scalePattern.map((interval, i) => {
    const noteIdx = (rootSemitone + interval) % 12;
    return `${noteNames[noteIdx]}${qualities[i]}`;
  });
}
