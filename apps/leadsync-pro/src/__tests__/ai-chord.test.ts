/**
 * @fileoverview AI 和弦模块单元测试
 */

import {
  detectKey,
  detectPatterns,
  suggestNextChord,
  analyzeChordProgression,
} from "@/lib/ai-chord";
import { parseChord } from "@/lib/chord-utils";
import type { ChordSymbol } from "@/types";

/** 快速构建 ChordSymbol 列表 */
function chords(...names: string[]): ChordSymbol[] {
  return names.map((n) => parseChord(n)!).filter(Boolean);
}

describe("detectKey", () => {
  it("should detect C major from I-IV-V-I", () => {
    const result = detectKey(chords("C", "F", "G", "C"));
    expect(result.key).toBe("C");
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("should detect Bb from typical jazz chords", () => {
    const result = detectKey(chords("Cm7", "F7", "Bbmaj7", "Gm7", "Ebmaj7", "Bbmaj7"));
    expect(result.key).toBe("Bb");
  });

  it("should return C with 0 confidence for empty input", () => {
    const result = detectKey([]);
    expect(result.key).toBe("C");
    expect(result.confidence).toBe(0);
  });

  it("should detect G major from diatonic chords", () => {
    const result = detectKey(chords("G", "Am7", "Bm7", "C", "D7", "Em7"));
    expect(result.key).toBe("G");
  });
});

describe("detectPatterns", () => {
  it("should detect ii-V-I pattern", () => {
    const patterns = detectPatterns(chords("Dm7", "G7", "Cmaj7"), "C");
    expect(patterns).toContain("ii-V-I");
  });

  it("should detect I-vi-ii-V pattern", () => {
    const patterns = detectPatterns(
      chords("Cmaj7", "Am7", "Dm7", "G7"),
      "C"
    );
    expect(patterns).toContain("I-vi-ii-V");
  });

  it("should return empty for unrecognized patterns", () => {
    const patterns = detectPatterns(chords("C", "Db", "Eb"), "C");
    expect(patterns).toHaveLength(0);
  });

  it("should return empty for less than 2 chords", () => {
    const patterns = detectPatterns(chords("C"), "C");
    expect(patterns).toHaveLength(0);
  });
});

describe("suggestNextChord", () => {
  it("should suggest chords after a dominant V", () => {
    const suggestions = suggestNextChord(chords("G7"), "C");
    expect(suggestions.length).toBeGreaterThan(0);
    const roots = suggestions.map((s) => s.root);
    expect(roots).toContain("C");
  });

  it("should suggest chords after ii chord", () => {
    const suggestions = suggestNextChord(chords("Dm7"), "C");
    expect(suggestions.length).toBeGreaterThan(0);
    const roots = suggestions.map((s) => s.root);
    expect(roots).toContain("G");
  });

  it("should return diatonic chords for empty input", () => {
    const suggestions = suggestNextChord([], "C");
    expect(suggestions.length).toBeGreaterThan(0);
  });
});

describe("analyzeChordProgression", () => {
  it("should analyze blues progression", async () => {
    const result = await analyzeChordProgression("12-bar blues in Bb");
    expect(result.key).toBe("Bb");
    expect(result.measures.length).toBe(12);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("should analyze waltz", async () => {
    const result = await analyzeChordProgression("waltz in G");
    expect(result.key).toBe("G");
    expect(result.timeSignature).toBe("3/4");
  });

  it("should default to C major for generic description", async () => {
    const result = await analyzeChordProgression("a simple song");
    expect(result.key).toBe("C");
    expect(result.measures.length).toBeGreaterThan(0);
  });
});
