/**
 * @fileoverview 和弦解析器单元测试
 */

import {
  parseChord,
  formatChord,
  getChordMidiNotes,
  midiToFrequency,
  getChordFrequencies,
  getDiatonicChords,
} from "@/lib/chordParser";

describe("parseChord", () => {
  it("should parse a simple major chord", () => {
    const chord = parseChord("C");
    expect(chord).toEqual({
      root: "C",
      accidental: "",
      quality: "major",
      beats: 4,
    });
  });

  it("should parse minor chords", () => {
    const chord = parseChord("Am");
    expect(chord).toEqual({
      root: "A",
      accidental: "",
      quality: "minor",
      beats: 4,
    });
  });

  it("should parse dominant 7th chords", () => {
    const chord = parseChord("G7");
    expect(chord).toEqual({
      root: "G",
      accidental: "",
      quality: "dominant7",
      beats: 4,
    });
  });

  it("should parse major 7th chords", () => {
    const chord = parseChord("Cmaj7");
    expect(chord).toEqual({
      root: "C",
      accidental: "",
      quality: "major7",
      beats: 4,
    });
  });

  it("should parse minor 7th chords", () => {
    const chord = parseChord("Dm7");
    expect(chord).toEqual({
      root: "D",
      accidental: "",
      quality: "minor7",
      beats: 4,
    });
  });

  it("should parse flat root chords", () => {
    const chord = parseChord("Bb7");
    expect(chord).toEqual({
      root: "B",
      accidental: "b",
      quality: "dominant7",
      beats: 4,
    });
  });

  it("should parse sharp root chords", () => {
    const chord = parseChord("F#m7");
    expect(chord).toEqual({
      root: "F",
      accidental: "#",
      quality: "minor7",
      beats: 4,
    });
  });

  it("should parse diminished chords", () => {
    const chord = parseChord("Bdim");
    expect(chord).toEqual({
      root: "B",
      accidental: "",
      quality: "diminished",
      beats: 4,
    });
  });

  it("should parse half-diminished chords", () => {
    const chord = parseChord("Bø");
    expect(chord).toEqual({
      root: "B",
      accidental: "",
      quality: "half-diminished",
      beats: 4,
    });
  });

  it("should respect custom beats parameter", () => {
    const chord = parseChord("C", 2);
    expect(chord?.beats).toBe(2);
  });

  it("should return null for empty string", () => {
    expect(parseChord("")).toBeNull();
  });

  it("should return null for invalid input", () => {
    expect(parseChord("123")).toBeNull();
    expect(parseChord("X")).toBeNull();
  });
});

describe("formatChord", () => {
  it("should format a major chord", () => {
    expect(formatChord({ root: "C", accidental: "", quality: "major", beats: 4 })).toBe("C");
  });

  it("should format a minor 7th chord", () => {
    expect(formatChord({ root: "D", accidental: "", quality: "minor7", beats: 4 })).toBe("Dm7");
  });

  it("should format a flat dominant 7th", () => {
    expect(formatChord({ root: "B", accidental: "b", quality: "dominant7", beats: 4 })).toBe("Bb7");
  });

  it("should format a major 7th chord", () => {
    expect(formatChord({ root: "C", accidental: "", quality: "major7", beats: 4 })).toBe("Cmaj7");
  });
});

describe("getChordMidiNotes", () => {
  it("should return correct MIDI notes for C major at octave 3", () => {
    const notes = getChordMidiNotes(
      { root: "C", accidental: "", quality: "major", beats: 4 },
      3
    );
    expect(notes).toEqual([48, 52, 55]);
  });

  it("should return correct MIDI notes for Cm7 at octave 3", () => {
    const notes = getChordMidiNotes(
      { root: "C", accidental: "", quality: "minor7", beats: 4 },
      3
    );
    expect(notes).toEqual([48, 51, 55, 58]);
  });

  it("should handle sharp roots", () => {
    const notes = getChordMidiNotes(
      { root: "F", accidental: "#", quality: "major", beats: 4 },
      3
    );
    expect(notes).toEqual([54, 58, 61]);
  });
});

describe("midiToFrequency", () => {
  it("should return 440Hz for A4 (MIDI 69)", () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 1);
  });

  it("should return ~261.6Hz for C4 (MIDI 60)", () => {
    expect(midiToFrequency(60)).toBeCloseTo(261.63, 0);
  });
});

describe("getChordFrequencies", () => {
  it("should return frequencies for C major", () => {
    const freqs = getChordFrequencies(
      { root: "C", accidental: "", quality: "major", beats: 4 },
      4
    );
    expect(freqs.length).toBe(3);
    expect(freqs[0]).toBeCloseTo(261.63, 0);
  });
});

describe("getDiatonicChords", () => {
  it("should return 7 chords for C major", () => {
    const chords = getDiatonicChords("C");
    expect(chords).toHaveLength(7);
    expect(chords[0]).toBe("Cmaj7");
    expect(chords[1]).toBe("Dm7");
    expect(chords[4]).toBe("G7");
  });
});
