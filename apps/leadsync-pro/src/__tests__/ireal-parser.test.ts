/**
 * @fileoverview iReal Pro 解析器单元测试
 */

import {
  scramble,
  unscramble,
  parseIRealUrl,
  parseChordString,
  irealSongToLeadSheet,
} from "@/lib/ireal-parser";

describe("scramble / unscramble", () => {
  it("should be inverse operations for short strings", () => {
    const original = "Hello World";
    const scrambled = scramble(original);
    const result = unscramble(scrambled);
    expect(result.trimEnd()).toBe(original);
  });

  it("should be inverse operations for long strings", () => {
    const original = "T44|*A|Dm7 G7|Cmaj7 |Am7 |Dm7 G7|Cmaj7 |Am7 |Dm7 G7|Cmaj7 |Z";
    const scrambled = scramble(original);
    const result = unscramble(scrambled);
    expect(result.trimEnd()).toBe(original);
  });

  it("should handle strings longer than 50 chars", () => {
    const original = "A".repeat(120);
    const scrambled = scramble(original);
    const result = unscramble(scrambled);
    expect(result.trimEnd()).toBe(original);
  });

  it("should handle empty string", () => {
    expect(unscramble("")).toBe("");
  });
});

describe("parseIRealUrl", () => {
  it("should throw for invalid URL prefix", () => {
    expect(() => parseIRealUrl("https://example.com")).toThrow(
      "Invalid iReal Pro URL"
    );
  });

  it("should parse a single song URL", () => {
    const chordStr = "T44|*A|Dm7 G7|Cmaj7 |Z";
    const scrambled = scramble(chordStr);
    const url = `irealb://${encodeURIComponent("Autumn Leaves")}=${encodeURIComponent("Kosma")}=${encodeURIComponent("Medium Swing")}=${encodeURIComponent("Bb")}=n==${encodeURIComponent(scrambled)}`;

    const songs = parseIRealUrl(url);
    expect(songs).toHaveLength(1);
    expect(songs[0].title).toBe("Autumn Leaves");
    expect(songs[0].composer).toBe("Kosma");
    expect(songs[0].style).toBe("Medium Swing");
    expect(songs[0].key).toBe("Bb");
  });

  it("should parse multiple songs separated by ===", () => {
    const chord1 = scramble("T44|*A|Dm7|G7|Z");
    const chord2 = scramble("T44|*A|Am7|D7|Z");
    const url = `irealb://${encodeURIComponent("Song1")}=${encodeURIComponent("Artist1")}=${encodeURIComponent("Jazz")}=${encodeURIComponent("C")}=n==${encodeURIComponent(chord1)}===${encodeURIComponent("Song2")}=${encodeURIComponent("Artist2")}=${encodeURIComponent("Bossa")}=${encodeURIComponent("G")}=n==${encodeURIComponent(chord2)}`;

    const songs = parseIRealUrl(url);
    expect(songs).toHaveLength(2);
    expect(songs[0].title).toBe("Song1");
    expect(songs[1].title).toBe("Song2");
  });
});

describe("parseChordString", () => {
  it("should parse basic chord progression", () => {
    const sections = parseChordString("T44|Dm7 G7|Cmaj7|Z");
    expect(sections.length).toBeGreaterThanOrEqual(1);

    const allMeasures = sections.flatMap((s) => s.measures);
    expect(allMeasures.length).toBeGreaterThanOrEqual(1);

    const allChords = allMeasures.flatMap((m) =>
      m.beats.filter((b) => b.chord !== null)
    );
    expect(allChords.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle section markers", () => {
    const sections = parseChordString("*A|Dm7|G7|*B|Am7|D7|Z");
    expect(sections.length).toBe(2);
    expect(sections[0].name).toBe("A");
    expect(sections[1].name).toBe("B");
  });

  it("should handle time signature", () => {
    const sections = parseChordString("T34|Dm7|G7|Z");
    expect(sections[0].measures[0].timeSignature).toBe("3/4");
  });

  it("should handle no-chord marker", () => {
    const sections = parseChordString("|n|Dm7|Z");
    const firstMeasureBeats = sections[0].measures[0].beats;
    const hasNoChord = firstMeasureBeats.some((b) => b.isNoChord);
    expect(hasNoChord).toBe(true);
  });

  it("should handle repeat markers", () => {
    const sections = parseChordString("|x|Dm7|Z");
    const firstMeasureBeats = sections[0].measures[0].beats;
    const hasRepeat = firstMeasureBeats.some((b) => b.isRepeat);
    expect(hasRepeat).toBe(true);
  });

  it("should return at least one section for empty input", () => {
    const sections = parseChordString("");
    expect(sections.length).toBeGreaterThanOrEqual(1);
  });
});

describe("irealSongToLeadSheet", () => {
  it("should convert IRealSong to LeadSheet", () => {
    const song = {
      title: "Test Song",
      composer: "Test Composer",
      style: "Medium Swing",
      key: "C",
      chordString: "T44|*A|Dm7 G7|Cmaj7|Z",
    };

    const sheet = irealSongToLeadSheet(song);
    expect(sheet.title).toBe("Test Song");
    expect(sheet.composer).toBe("Test Composer");
    expect(sheet.key).toBe("C");
    expect(sheet.id).toBeDefined();
    expect(sheet.createdAt).toBeDefined();
    expect(sheet.sections.length).toBeGreaterThanOrEqual(1);
    expect(sheet.isFavorite).toBe(false);
  });

  it("should map styles correctly", () => {
    const bossaSong = {
      title: "Bossa",
      composer: "Test",
      style: "Bossa Nova",
      key: "D",
      chordString: "|Dm7|G7|Z",
    };
    const sheet = irealSongToLeadSheet(bossaSong);
    expect(sheet.style).toBe("Bossa Nova");
  });
});
