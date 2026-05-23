/**
 * @fileoverview Lead Sheet 生成器单元测试
 */

import { generateLeadSheet, suggestDefaults } from "@/lib/leadSheetGenerator";
import type { GenerateRequest } from "@/types";

describe("generateLeadSheet", () => {
  const baseRequest: GenerateRequest = {
    title: "Test Song",
    style: "jazz-swing",
    key: "C",
    timeSignature: [4, 4],
    tempo: 140,
    measures: 32,
    complexity: "moderate",
  };

  it("should generate a lead sheet with the correct title", () => {
    const sheet = generateLeadSheet(baseRequest);
    expect(sheet.title).toBe("Test Song");
  });

  it("should generate the correct number of measures", () => {
    const sheet = generateLeadSheet(baseRequest);
    expect(sheet.measures).toHaveLength(32);
  });

  it("should set correct metadata", () => {
    const sheet = generateLeadSheet(baseRequest);
    expect(sheet.key).toBe("C");
    expect(sheet.tempo).toBe(140);
    expect(sheet.style).toBe("jazz-swing");
    expect(sheet.timeSignature).toEqual([4, 4]);
    expect(sheet.composer).toBe("AI Generated");
  });

  it("should generate measures with at least one chord each", () => {
    const sheet = generateLeadSheet(baseRequest);
    sheet.measures.forEach((measure) => {
      expect(measure.chords.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("should generate melody notes for each measure", () => {
    const sheet = generateLeadSheet(baseRequest);
    sheet.measures.forEach((measure) => {
      expect(measure.melody).toBeDefined();
      expect(measure.melody!.length).toBeGreaterThan(0);
    });
  });

  it("should generate a valid UUID id", () => {
    const sheet = generateLeadSheet(baseRequest);
    expect(sheet.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("should handle different measure counts", () => {
    const short = generateLeadSheet({ ...baseRequest, measures: 8 });
    expect(short.measures).toHaveLength(8);

    const medium = generateLeadSheet({ ...baseRequest, measures: 12 });
    expect(medium.measures).toHaveLength(12);
  });

  it("should generate in different styles", () => {
    const bossa = generateLeadSheet({ ...baseRequest, style: "jazz-bossa" });
    expect(bossa.style).toBe("jazz-bossa");

    const blues = generateLeadSheet({ ...baseRequest, style: "blues" });
    expect(blues.style).toBe("blues");
  });

  it("should set isFavorite to false initially", () => {
    const sheet = generateLeadSheet(baseRequest);
    expect(sheet.isFavorite).toBe(false);
  });

  it("should include tags", () => {
    const sheet = generateLeadSheet(baseRequest);
    expect(sheet.tags).toContain("jazz-swing");
    expect(sheet.tags).toContain("C");
  });

  it("should set valid timestamps", () => {
    const sheet = generateLeadSheet(baseRequest);
    expect(new Date(sheet.createdAt).getTime()).not.toBeNaN();
    expect(new Date(sheet.updatedAt).getTime()).not.toBeNaN();
  });
});

describe("suggestDefaults", () => {
  it("should suggest blues style for blues titles", () => {
    const defaults = suggestDefaults("12 Bar Blues");
    expect(defaults.style).toBe("blues");
    expect(defaults.measures).toBe(12);
  });

  it("should suggest bossa for bossa-related titles", () => {
    const defaults = suggestDefaults("Girl from Ipanema");
    expect(defaults.style).toBe("jazz-bossa");
  });

  it("should suggest ballad for ballad titles", () => {
    const defaults = suggestDefaults("Round Midnight");
    expect(defaults.style).toBe("jazz-ballad");
  });

  it("should suggest bebop for bebop titles", () => {
    const defaults = suggestDefaults("Donna Lee");
    expect(defaults.style).toBe("jazz-bebop");
  });

  it("should default to swing for unknown titles", () => {
    const defaults = suggestDefaults("My Custom Song");
    expect(defaults.style).toBe("jazz-swing");
  });
});
