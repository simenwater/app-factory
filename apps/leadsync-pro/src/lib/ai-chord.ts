/**
 * @fileoverview AI 辅助和弦识别模块
 * 提供基于规则的和弦进行分析、自动补全、以及 AI API 集成框架
 */

import type { AIChordResult, Measure, ChordSymbol } from "@/types";
import { noteToIndex, indexToNote, NOTE_NAMES } from "./chord-utils";

/**
 * 常见和弦进行模式
 * 用于模式匹配和自动推荐
 */
const COMMON_PROGRESSIONS: Record<string, number[][]> = {
  "ii-V-I": [[2, -1], [7, 0], [0, 0]],
  "I-vi-ii-V": [[0, 0], [9, -1], [2, -1], [7, 0]],
  "I-IV-V": [[0, 0], [5, 0], [7, 0]],
  "iii-vi-ii-V": [[4, -1], [9, -1], [2, -1], [7, 0]],
  "I-V-vi-IV": [[0, 0], [7, 0], [9, -1], [5, 0]],
  "Blues": [[0, 0], [5, 0], [0, 0], [0, 0], [5, 0], [5, 0], [0, 0], [0, 0], [7, 0], [5, 0], [0, 0], [7, 0]],
};

/**
 * 分析调性：根据和弦集合推测最可能的调
 * @param {ChordSymbol[]} chords - 和弦列表
 * @returns {{ key: string; confidence: number }} 调性和置信度
 */
export function detectKey(chords: ChordSymbol[]): { key: string; confidence: number } {
  if (chords.length === 0) return { key: "C", confidence: 0 };

  const scores: Record<string, number> = {};

  for (const keyNote of NOTE_NAMES) {
    const keyIdx = noteToIndex(keyNote);
    let score = 0;

    for (const chord of chords) {
      const chordIdx = noteToIndex(chord.root);
      if (chordIdx < 0) continue;

      const interval = ((chordIdx - keyIdx) + 12) % 12;
      const quality = chord.quality.toLowerCase();

      const diatonicMajor: Record<number, string[]> = {
        0: ["maj", "maj7", "6", ""],
        2: ["m", "m7", "min", "min7"],
        4: ["m", "m7", "min", "min7"],
        5: ["maj", "maj7", "6", ""],
        7: ["7", "dom7", "9", "13", ""],
        9: ["m", "m7", "min", "min7"],
        11: ["m7b5", "dim", "hdim7"],
      };

      if (diatonicMajor[interval]) {
        score += diatonicMajor[interval].some((q) => quality.includes(q)) ? 3 : 1;
      }
    }

    scores[keyNote] = score;
  }

  let bestKey = "C";
  let bestScore = 0;
  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  const maxPossible = chords.length * 3;
  const confidence = maxPossible > 0 ? Math.min(bestScore / maxPossible, 1) : 0;

  return { key: bestKey, confidence };
}

/**
 * 检测和弦进行中的常见模式
 * @param {ChordSymbol[]} chords - 和弦列表
 * @param {string} key - 调性
 * @returns {string[]} 检测到的模式名称列表
 */
export function detectPatterns(chords: ChordSymbol[], key: string): string[] {
  const keyIdx = noteToIndex(key);
  if (keyIdx < 0 || chords.length < 2) return [];

  const intervals = chords.map((c) => {
    return ((noteToIndex(c.root) - keyIdx) + 12) % 12;
  });

  const patterns: string[] = [];

  for (let i = 0; i <= intervals.length - 3; i++) {
    if (intervals[i] === 2 && intervals[i + 1] === 7 && intervals[i + 2] === 0) {
      patterns.push("ii-V-I");
    }
  }

  for (let i = 0; i <= intervals.length - 4; i++) {
    if (
      intervals[i] === 0 &&
      intervals[i + 1] === 9 &&
      intervals[i + 2] === 2 &&
      intervals[i + 3] === 7
    ) {
      patterns.push("I-vi-ii-V");
    }
  }

  return [...new Set(patterns)];
}

/**
 * 根据上下文推荐下一个和弦
 * @param {ChordSymbol[]} previousChords - 前序和弦
 * @param {string} key - 调性
 * @returns {ChordSymbol[]} 推荐和弦列表（最多 5 个）
 */
export function suggestNextChord(
  previousChords: ChordSymbol[],
  key: string
): ChordSymbol[] {
  const keyIdx = noteToIndex(key);
  if (keyIdx < 0) return [];

  const suggestions: ChordSymbol[] = [];
  const last = previousChords[previousChords.length - 1];

  if (!last) {
    return buildDiatonicChords(key).slice(0, 5);
  }

  const lastInterval = ((noteToIndex(last.root) - keyIdx) + 12) % 12;

  const nextMap: Record<number, Array<[number, string]>> = {
    0: [[5, "maj7"], [7, "7"], [2, "m7"], [9, "m7"]],
    2: [[7, "7"], [0, "maj7"], [5, "maj7"]],
    4: [[9, "m7"], [2, "m7"], [5, "maj7"]],
    5: [[7, "7"], [0, "maj7"], [2, "m7"]],
    7: [[0, "maj7"], [9, "m7"], [5, "maj7"]],
    9: [[2, "m7"], [7, "7"], [5, "maj7"]],
    11: [[0, "maj7"], [7, "7"], [2, "m7"]],
  };

  const candidates = nextMap[lastInterval] || [[0, "maj7"]];
  for (const [interval, quality] of candidates) {
    const root = indexToNote(keyIdx + interval);
    suggestions.push({
      root,
      quality,
      display: `${root}${quality}`,
    });
  }

  return suggestions.slice(0, 5);
}

/**
 * 构建某调的自然音阶和弦
 * @param {string} key - 调性
 * @returns {ChordSymbol[]} 七级和弦
 */
function buildDiatonicChords(key: string): ChordSymbol[] {
  const keyIdx = noteToIndex(key);
  const intervals = [0, 2, 4, 5, 7, 9, 11];
  const qualities = ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"];

  return intervals.map((interval, i) => {
    const root = indexToNote(keyIdx + interval);
    return {
      root,
      quality: qualities[i],
      display: `${root}${qualities[i]}`,
    };
  });
}

/**
 * 模拟 AI 和弦识别（从文本描述推断和弦进行）
 * 实际产品中会调用后端 AI API
 * @param {string} description - 如 "12-bar blues in Bb"
 * @returns {Promise<AIChordResult>} AI 识别结果
 */
export async function analyzeChordProgression(
  description: string
): Promise<AIChordResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const lower = description.toLowerCase();
  let key = "C";
  const keyMatch = description.match(/in\s+([A-G][b#]?)/i);
  if (keyMatch) key = keyMatch[1];

  let measures: Measure[] = [];
  let timeSig = "4/4";

  if (lower.includes("blues")) {
    const keyIdx = noteToIndex(key);
    const I = indexToNote(keyIdx);
    const IV = indexToNote(keyIdx + 5);
    const V = indexToNote(keyIdx + 7);

    const chordsPattern = [I, I, I, I, IV, IV, I, I, V, IV, I, V];
    measures = chordsPattern.map((root) => ({
      beats: [
        {
          chord: {
            root,
            quality: "7",
            display: `${root}7`,
          },
        },
      ],
      timeSignature: "4/4",
    }));
  } else if (lower.includes("waltz") || lower.includes("3/4")) {
    timeSig = "3/4";
    measures = buildDiatonicChords(key)
      .slice(0, 4)
      .map((chord) => ({
        beats: [{ chord }],
        timeSignature: "3/4",
      }));
  } else {
    measures = buildDiatonicChords(key)
      .slice(0, 4)
      .map((chord) => ({
        beats: [{ chord }],
        timeSignature: "4/4",
      }));
  }

  return {
    measures,
    confidence: 0.85,
    key,
    timeSignature: timeSig,
  };
}

export { COMMON_PROGRESSIONS };
