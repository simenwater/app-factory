/**
 * @fileoverview 和弦工具函数 — 解析、格式化、移调
 */

import type { ChordSymbol } from "@/types";

const NOTE_NAMES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

const SHARP_TO_FLAT: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "E#": "F",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
  "B#": "C",
};

const ENHARMONIC: Record<string, string> = {
  ...SHARP_TO_FLAT,
  Cb: "B",
  Fb: "E",
};

/**
 * 将音名标准化为降号表示
 * @param {string} note - 原始音名（如 "F#"）
 * @returns {string} 标准化后的音名（如 "Gb"）
 */
export function normalizeNote(note: string): string {
  if (ENHARMONIC[note]) return ENHARMONIC[note];
  if (NOTE_NAMES.includes(note)) return note;
  return note;
}

/**
 * 获取音名对应的半音索引（0–11）
 * @param {string} note - 音名
 * @returns {number} 半音索引，未知音名返回 -1
 */
export function noteToIndex(note: string): number {
  const normalized = normalizeNote(note);
  return NOTE_NAMES.indexOf(normalized);
}

/**
 * 将半音索引转为音名
 * @param {number} index - 半音索引
 * @returns {string} 音名
 */
export function indexToNote(index: number): string {
  const normalized = ((index % 12) + 12) % 12;
  return NOTE_NAMES[normalized];
}

/**
 * 从和弦字符串解析出 ChordSymbol
 * @param {string} chordStr - 如 "Cmaj7", "Dm7b5/A"
 * @returns {ChordSymbol | null} 解析结果
 */
export function parseChord(chordStr: string): ChordSymbol | null {
  if (!chordStr || chordStr.trim() === "") return null;

  const str = chordStr.trim();
  const rootMatch = str.match(/^([A-G][b#]?)/);
  if (!rootMatch) return null;

  const root = normalizeNote(rootMatch[1]);
  let rest = str.slice(rootMatch[1].length);

  let bass: string | undefined;
  const slashIdx = rest.lastIndexOf("/");
  if (slashIdx >= 0) {
    const bassCandidate = rest.slice(slashIdx + 1);
    if (/^[A-G][b#]?$/.test(bassCandidate)) {
      bass = normalizeNote(bassCandidate);
      rest = rest.slice(0, slashIdx);
    }
  }

  return {
    root,
    quality: rest || "maj",
    bass,
    display: chordStr.trim(),
  };
}

/**
 * 将和弦移调指定半音数
 * @param {ChordSymbol} chord - 原始和弦
 * @param {number} semitones - 移调半音数（正数升调，负数降调）
 * @returns {ChordSymbol} 移调后的和弦
 */
export function transposeChord(
  chord: ChordSymbol,
  semitones: number
): ChordSymbol {
  const rootIdx = noteToIndex(chord.root);
  if (rootIdx < 0) return chord;

  const newRoot = indexToNote(rootIdx + semitones);
  let newBass: string | undefined;
  if (chord.bass) {
    const bassIdx = noteToIndex(chord.bass);
    if (bassIdx >= 0) {
      newBass = indexToNote(bassIdx + semitones);
    }
  }

  const display =
    newRoot + chord.quality + (newBass ? `/${newBass}` : "");

  return {
    root: newRoot,
    quality: chord.quality,
    bass: newBass,
    display,
  };
}

/**
 * 格式化和弦符号为显示字符串
 * @param {ChordSymbol | null} chord - 和弦
 * @returns {string} 显示文本
 */
export function formatChord(chord: ChordSymbol | null): string {
  if (!chord) return "";
  return chord.display;
}

/**
 * 检查字符串是否为有效和弦符号
 * @param {string} str - 待检查字符串
 * @returns {boolean} 是否有效
 */
export function isValidChord(str: string): boolean {
  return parseChord(str) !== null;
}

/**
 * 常用和弦品质缩写映射表（用于 UI 选择器）
 */
export const CHORD_QUALITIES: { label: string; value: string }[] = [
  { label: "Major", value: "" },
  { label: "Minor", value: "m" },
  { label: "7", value: "7" },
  { label: "Maj7", value: "maj7" },
  { label: "Min7", value: "m7" },
  { label: "Dim", value: "dim" },
  { label: "Dim7", value: "dim7" },
  { label: "Half-dim", value: "m7b5" },
  { label: "Aug", value: "aug" },
  { label: "Sus4", value: "sus4" },
  { label: "Sus2", value: "sus2" },
  { label: "6", value: "6" },
  { label: "Min6", value: "m6" },
  { label: "9", value: "9" },
  { label: "Maj9", value: "maj9" },
  { label: "Min9", value: "m9" },
  { label: "11", value: "11" },
  { label: "13", value: "13" },
  { label: "7b9", value: "7b9" },
  { label: "7#9", value: "7#9" },
  { label: "7b5", value: "7b5" },
  { label: "7#5", value: "7#5" },
];

export { NOTE_NAMES };
