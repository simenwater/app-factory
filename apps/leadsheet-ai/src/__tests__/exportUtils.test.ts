/**
 * @fileoverview 导出工具单元测试
 */

import { toABC, toMusicXML, toJSON } from "@/lib/exportUtils";
import type { LeadSheet } from "@/types";

const mockSheet: LeadSheet = {
  id: "test-export-1",
  title: "Test Export",
  composer: "AI Generated",
  style: "jazz-swing",
  key: "C",
  timeSignature: [4, 4],
  tempo: 120,
  measures: [
    {
      chords: [{ root: "C", accidental: "", quality: "major7", beats: 4 }],
      melody: [
        { name: "E", accidental: "", octave: 4, duration: "quarter" },
        { name: "G", accidental: "", octave: 4, duration: "quarter" },
      ],
    },
    {
      chords: [{ root: "D", accidental: "", quality: "minor7", beats: 4 }],
      melody: [
        { name: "F", accidental: "", octave: 4, duration: "half" },
      ],
    },
    {
      chords: [{ root: "G", accidental: "", quality: "dominant7", beats: 4 }],
      melody: [],
    },
    {
      chords: [{ root: "C", accidental: "", quality: "major7", beats: 4 }],
      melody: [
        { name: "C", accidental: "", octave: 5, duration: "whole" },
      ],
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  isFavorite: false,
  tags: ["jazz-swing", "C"],
};

describe("toABC", () => {
  it("should generate valid ABC notation header", () => {
    const abc = toABC(mockSheet);
    expect(abc).toContain("X:1");
    expect(abc).toContain("T:Test Export");
    expect(abc).toContain("C:AI Generated");
    expect(abc).toContain("M:4/4");
    expect(abc).toContain("Q:1/4=120");
    expect(abc).toContain("K:C");
  });

  it("should include chord symbols", () => {
    const abc = toABC(mockSheet);
    expect(abc).toContain('"Cmaj7"');
    expect(abc).toContain('"Dm7"');
    expect(abc).toContain('"G7"');
  });

  it("should include bar lines", () => {
    const abc = toABC(mockSheet);
    expect(abc).toContain("|");
  });
});

describe("toMusicXML", () => {
  it("should generate valid XML structure", () => {
    const xml = toMusicXML(mockSheet);
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain("<score-partwise");
    expect(xml).toContain("<work-title>Test Export</work-title>");
    expect(xml).toContain("</score-partwise>");
  });

  it("should include time signature", () => {
    const xml = toMusicXML(mockSheet);
    expect(xml).toContain("<beats>4</beats>");
    expect(xml).toContain("<beat-type>4</beat-type>");
  });

  it("should include tempo", () => {
    const xml = toMusicXML(mockSheet);
    expect(xml).toContain("<per-minute>120</per-minute>");
  });

  it("should include harmony elements", () => {
    const xml = toMusicXML(mockSheet);
    expect(xml).toContain("<harmony>");
    expect(xml).toContain("<root-step>C</root-step>");
  });

  it("should include correct number of measures", () => {
    const xml = toMusicXML(mockSheet);
    const measureCount = (xml.match(/<measure number="/g) || []).length;
    expect(measureCount).toBe(4);
  });
});

describe("toJSON", () => {
  it("should generate valid JSON", () => {
    const json = toJSON(mockSheet);
    const parsed = JSON.parse(json);
    expect(parsed.title).toBe("Test Export");
    expect(parsed.measures).toHaveLength(4);
  });

  it("should preserve all fields", () => {
    const json = toJSON(mockSheet);
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe("test-export-1");
    expect(parsed.key).toBe("C");
    expect(parsed.tempo).toBe(120);
    expect(parsed.style).toBe("jazz-swing");
  });
});
