/**
 * @fileoverview chord-utils 单元测试
 */

import {
  normalizeNote,
  noteToIndex,
  indexToNote,
  parseChord,
  transposeChord,
  formatChord,
  isValidChord,
  NOTE_NAMES,
} from "@/lib/chord-utils";

describe("normalizeNote", () => {
  it("should convert sharps to flats", () => {
    expect(normalizeNote("C#")).toBe("Db");
    expect(normalizeNote("F#")).toBe("Gb");
    expect(normalizeNote("A#")).toBe("Bb");
  });

  it("should handle enharmonic equivalents", () => {
    expect(normalizeNote("Cb")).toBe("B");
    expect(normalizeNote("Fb")).toBe("E");
    expect(normalizeNote("E#")).toBe("F");
    expect(normalizeNote("B#")).toBe("C");
  });

  it("should pass through standard flat notes", () => {
    expect(normalizeNote("Db")).toBe("Db");
    expect(normalizeNote("Eb")).toBe("Eb");
    expect(normalizeNote("Bb")).toBe("Bb");
  });

  it("should pass through natural notes", () => {
    for (const note of ["C", "D", "E", "F", "G", "A", "B"]) {
      expect(normalizeNote(note)).toBe(note);
    }
  });
});

describe("noteToIndex / indexToNote", () => {
  it("should map C to 0", () => {
    expect(noteToIndex("C")).toBe(0);
  });

  it("should map all 12 notes correctly", () => {
    NOTE_NAMES.forEach((note, i) => {
      expect(noteToIndex(note)).toBe(i);
      expect(indexToNote(i)).toBe(note);
    });
  });

  it("should handle negative indices", () => {
    expect(indexToNote(-1)).toBe("B");
    expect(indexToNote(-12)).toBe("C");
  });

  it("should return -1 for unknown notes", () => {
    expect(noteToIndex("X")).toBe(-1);
  });
});

describe("parseChord", () => {
  it("should parse simple major chord", () => {
    const chord = parseChord("C");
    expect(chord).not.toBeNull();
    expect(chord!.root).toBe("C");
    expect(chord!.quality).toBe("maj");
  });

  it("should parse minor 7th chord", () => {
    const chord = parseChord("Dm7");
    expect(chord).not.toBeNull();
    expect(chord!.root).toBe("D");
    expect(chord!.quality).toBe("m7");
  });

  it("should parse sharp root and normalize", () => {
    const chord = parseChord("F#m7");
    expect(chord).not.toBeNull();
    expect(chord!.root).toBe("Gb");
    expect(chord!.quality).toBe("m7");
  });

  it("should parse slash chord", () => {
    const chord = parseChord("Cmaj7/E");
    expect(chord).not.toBeNull();
    expect(chord!.root).toBe("C");
    expect(chord!.quality).toBe("maj7");
    expect(chord!.bass).toBe("E");
  });

  it("should parse complex chord", () => {
    const chord = parseChord("Bb7b9");
    expect(chord).not.toBeNull();
    expect(chord!.root).toBe("Bb");
    expect(chord!.quality).toBe("7b9");
  });

  it("should return null for empty string", () => {
    expect(parseChord("")).toBeNull();
  });

  it("should return null for invalid chord", () => {
    expect(parseChord("xyz")).toBeNull();
  });
});

describe("transposeChord", () => {
  it("should transpose up a half step", () => {
    const chord = parseChord("C")!;
    const transposed = transposeChord(chord, 1);
    expect(transposed.root).toBe("Db");
  });

  it("should transpose up a whole step", () => {
    const chord = parseChord("Dm7")!;
    const transposed = transposeChord(chord, 2);
    expect(transposed.root).toBe("E");
    expect(transposed.quality).toBe("m7");
  });

  it("should transpose down", () => {
    const chord = parseChord("G7")!;
    const transposed = transposeChord(chord, -2);
    expect(transposed.root).toBe("F");
  });

  it("should wrap around correctly", () => {
    const chord = parseChord("B")!;
    const transposed = transposeChord(chord, 1);
    expect(transposed.root).toBe("C");
  });

  it("should transpose bass note of slash chord", () => {
    const chord = parseChord("Cmaj7/E")!;
    const transposed = transposeChord(chord, 2);
    expect(transposed.root).toBe("D");
    expect(transposed.bass).toBe("Gb");
  });
});

describe("formatChord", () => {
  it("should format chord display", () => {
    const chord = parseChord("Dm7")!;
    expect(formatChord(chord)).toBe("Dm7");
  });

  it("should return empty for null", () => {
    expect(formatChord(null)).toBe("");
  });
});

describe("isValidChord", () => {
  it("should validate correct chords", () => {
    expect(isValidChord("C")).toBe(true);
    expect(isValidChord("Dm7")).toBe(true);
    expect(isValidChord("Bb7#9")).toBe(true);
    expect(isValidChord("Fmaj7/A")).toBe(true);
  });

  it("should reject invalid chords", () => {
    expect(isValidChord("")).toBe(false);
    expect(isValidChord("xyz")).toBe(false);
    expect(isValidChord("123")).toBe(false);
  });
});
