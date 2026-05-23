/**
 * @fileoverview AI Lead Sheet 生成引擎
 * 基于规则和模板生成爵士标准曲式的和弦进行与旋律骨架。
 * 在没有 LLM API 时使用本地规则引擎，有 API 时可接入远程生成。
 */

import { v4 as uuidv4 } from "uuid";
import type {
  LeadSheet,
  Measure,
  Chord,
  Note,
  MusicStyle,
  GenerateRequest,
  NoteName,
  Accidental,
  ChordQuality,
} from "@/types";

/**
 * @description 常见爵士和弦进行模板（罗马数字 → 实际和弦需按 key 转换）
 */
interface ProgressionTemplate {
  name: string;
  numerals: string[];
  qualities: ChordQuality[];
}

const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  {
    name: "ii-V-I",
    numerals: ["II", "V", "I", "I"],
    qualities: ["minor7", "dominant7", "major7", "major7"],
  },
  {
    name: "I-vi-ii-V",
    numerals: ["I", "VI", "II", "V"],
    qualities: ["major7", "minor7", "minor7", "dominant7"],
  },
  {
    name: "iii-vi-ii-V",
    numerals: ["III", "VI", "II", "V"],
    qualities: ["minor7", "minor7", "minor7", "dominant7"],
  },
  {
    name: "I-IV-V-I",
    numerals: ["I", "IV", "V", "I"],
    qualities: ["major7", "major7", "dominant7", "major7"],
  },
  {
    name: "Blues",
    numerals: ["I", "I", "IV", "I"],
    qualities: ["dominant7", "dominant7", "dominant7", "dominant7"],
  },
  {
    name: "Minor ii-V-i",
    numerals: ["II", "V", "I", "I"],
    qualities: ["minor7b5", "dominant7", "minor7", "minor7"],
  },
];

/** 大调音阶上每个级数对应的半音偏移 */
const SCALE_DEGREES: Record<string, number> = {
  I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11,
};

const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3,
  E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8,
  Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

/**
 * @description 根据 key 和级数获取实际音符名
 * @param {string} key - 调号
 * @param {string} degree - 罗马数字级数
 * @returns {string} 音符名
 */
function resolveNote(key: string, degree: string): string {
  const keySemitone = NOTE_TO_SEMITONE[key] ?? 0;
  const degreeSemitone = SCALE_DEGREES[degree] ?? 0;
  const idx = (keySemitone + degreeSemitone) % 12;
  return NOTE_NAMES[idx];
}

/**
 * @description 拆分音符名为 root + accidental
 */
function splitNoteName(note: string): { root: NoteName; accidental: Accidental } {
  if (note.length === 2) {
    return {
      root: note[0] as NoteName,
      accidental: note[1] as Accidental,
    };
  }
  return { root: note as NoteName, accidental: "" };
}

/**
 * @description 根据风格选择合适的进行模板
 */
function pickProgressionTemplates(
  style: MusicStyle,
  complexity: "simple" | "moderate" | "complex",
  count: number
): ProgressionTemplate[] {
  const pool = [...PROGRESSION_TEMPLATES];
  const result: ProgressionTemplate[] = [];

  const styleWeights: Record<string, number[]> = {
    "jazz-swing": [3, 3, 2, 1, 0, 1],
    "jazz-bossa": [2, 3, 1, 1, 0, 1],
    "jazz-ballad": [3, 2, 1, 1, 0, 2],
    "jazz-latin": [2, 2, 2, 1, 0, 1],
    "jazz-bebop": [2, 2, 3, 0, 0, 2],
    "jazz-cool": [3, 2, 1, 1, 0, 1],
    blues: [0, 1, 0, 1, 3, 0],
    pop: [1, 3, 0, 2, 0, 0],
    folk: [0, 2, 0, 3, 0, 0],
  };

  const weights = styleWeights[style] || styleWeights["jazz-swing"];

  for (let i = 0; i < count; i++) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    let picked = pool[0];
    for (let j = 0; j < pool.length && j < weights.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        picked = pool[j];
        break;
      }
    }
    result.push(picked);
  }

  return result;
}

/**
 * @description 生成简单旋律（基于和弦音 + 经过音）
 */
function generateMelody(
  chord: Chord,
  style: MusicStyle,
  complexity: "simple" | "moderate" | "complex"
): Note[] {
  const notes: Note[] = [];
  const chordTones = getScaleTones(chord);
  const noteCount = complexity === "simple" ? 2 : complexity === "moderate" ? 4 : 6;

  for (let i = 0; i < noteCount; i++) {
    const tone = chordTones[Math.floor(Math.random() * chordTones.length)];
    const { root, accidental } = splitNoteName(tone);
    notes.push({
      name: root,
      accidental,
      octave: 4 + Math.floor(Math.random() * 2),
      duration: complexity === "simple" ? "half" : "quarter",
    });
  }

  return notes;
}

/**
 * @description 获取基于和弦的音阶音
 */
function getScaleTones(chord: Chord): string[] {
  const rootSemitone = NOTE_TO_SEMITONE[`${chord.root}${chord.accidental}`] ?? NOTE_TO_SEMITONE[chord.root] ?? 0;
  const majorScale = [0, 2, 4, 5, 7, 9, 11];
  const minorScale = [0, 2, 3, 5, 7, 8, 10];

  const isMinor = chord.quality.includes("minor") || chord.quality === "minor7b5";
  const scale = isMinor ? minorScale : majorScale;

  return scale.map((interval) => {
    const idx = (rootSemitone + interval) % 12;
    return NOTE_NAMES[idx];
  });
}

/**
 * @description 本地规则引擎生成 Lead Sheet
 * @param {GenerateRequest} request - 生成请求参数
 * @returns {LeadSheet} 生成的乐谱
 */
export function generateLeadSheet(request: GenerateRequest): LeadSheet {
  const {
    title,
    style,
    key,
    timeSignature,
    tempo,
    measures: measureCount,
    complexity,
  } = request;

  const sectionsNeeded = Math.ceil(measureCount / 4);
  const templates = pickProgressionTemplates(style, complexity, sectionsNeeded);

  const measures: Measure[] = [];

  for (let section = 0; section < sectionsNeeded; section++) {
    const template = templates[section % templates.length];

    for (let i = 0; i < 4 && measures.length < measureCount; i++) {
      const noteName = resolveNote(key, template.numerals[i]);
      const { root, accidental } = splitNoteName(noteName);

      const chord: Chord = {
        root,
        accidental,
        quality: template.qualities[i],
        beats: timeSignature[0],
      };

      const melody = generateMelody(chord, style, complexity);

      measures.push({
        chords: [chord],
        melody,
        timeSignature,
      });
    }
  }

  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    title: title || "Untitled",
    composer: "AI Generated",
    style,
    key,
    timeSignature,
    tempo,
    measures,
    createdAt: now,
    updatedAt: now,
    isFavorite: false,
    tags: [style, key],
  };
}

/**
 * @description 从曲名推断合适的默认配置
 * @param {string} title - 曲目名称
 * @returns {Partial<GenerateRequest>} 推荐的生成参数
 */
export function suggestDefaults(title: string): Partial<GenerateRequest> {
  const lower = title.toLowerCase();

  if (lower.includes("blues")) {
    return { style: "blues", tempo: 120, measures: 12, complexity: "moderate" };
  }
  if (lower.includes("bossa") || lower.includes("girl from")) {
    return { style: "jazz-bossa", tempo: 140, measures: 32, complexity: "moderate" };
  }
  if (lower.includes("ballad") || lower.includes("round midnight")) {
    return { style: "jazz-ballad", tempo: 72, measures: 32, complexity: "complex" };
  }
  if (lower.includes("bebop") || lower.includes("donna lee")) {
    return { style: "jazz-bebop", tempo: 200, measures: 32, complexity: "complex" };
  }

  return { style: "jazz-swing", tempo: 140, measures: 32, complexity: "moderate" };
}
