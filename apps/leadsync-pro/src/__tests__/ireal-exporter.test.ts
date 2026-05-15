/**
 * @fileoverview iReal Pro 导出器单元测试
 */

import {
  leadSheetToChordString,
  exportToIRealUrl,
  exportPlaylistToIRealUrl,
  exportToIRealHtml,
} from "@/lib/ireal-exporter";
import type { LeadSheet } from "@/types";

/** 创建测试用 LeadSheet */
function createTestSheet(overrides?: Partial<LeadSheet>): LeadSheet {
  return {
    id: "test-1",
    title: "Test Song",
    composer: "Test Composer",
    style: "Jazz",
    key: "C",
    timeSignature: "4/4",
    sections: [
      {
        name: "A",
        measures: [
          {
            beats: [
              { chord: { root: "D", quality: "m7", display: "Dm7" } },
              { chord: { root: "G", quality: "7", display: "G7" } },
            ],
            timeSignature: "4/4",
          },
          {
            beats: [
              { chord: { root: "C", quality: "maj7", display: "Cmaj7" } },
            ],
            timeSignature: "4/4",
          },
        ],
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    tags: [],
    isFavorite: false,
    ...overrides,
  };
}

describe("leadSheetToChordString", () => {
  it("should generate valid chord string", () => {
    const sheet = createTestSheet();
    const result = leadSheetToChordString(sheet);

    expect(result).toContain("T44");
    expect(result).toContain("*A");
    expect(result).toContain("Dm7");
    expect(result).toContain("G7");
    expect(result).toContain("Cmaj7");
    expect(result).toContain("Z");
  });

  it("should include time signature prefix", () => {
    const sheet = createTestSheet({ timeSignature: "3/4" });
    const result = leadSheetToChordString(sheet);
    expect(result).toContain("T34");
  });

  it("should handle multiple sections", () => {
    const sheet = createTestSheet({
      sections: [
        {
          name: "A",
          measures: [
            {
              beats: [{ chord: { root: "C", quality: "maj", display: "C" } }],
              timeSignature: "4/4",
            },
          ],
        },
        {
          name: "B",
          measures: [
            {
              beats: [{ chord: { root: "F", quality: "maj", display: "F" } }],
              timeSignature: "4/4",
            },
          ],
        },
      ],
    });
    const result = leadSheetToChordString(sheet);
    expect(result).toContain("*A");
    expect(result).toContain("*B");
  });

  it("should handle repeat beats", () => {
    const sheet = createTestSheet({
      sections: [
        {
          name: "A",
          measures: [
            {
              beats: [{ chord: null, isRepeat: true }],
              timeSignature: "4/4",
            },
          ],
        },
      ],
    });
    const result = leadSheetToChordString(sheet);
    expect(result).toContain("x");
  });

  it("should handle no-chord beats", () => {
    const sheet = createTestSheet({
      sections: [
        {
          name: "A",
          measures: [
            {
              beats: [{ chord: null, isNoChord: true }],
              timeSignature: "4/4",
            },
          ],
        },
      ],
    });
    const result = leadSheetToChordString(sheet);
    expect(result).toContain("n");
  });
});

describe("exportToIRealUrl", () => {
  it("should generate irealb:// URL", () => {
    const sheet = createTestSheet();
    const url = exportToIRealUrl(sheet);

    expect(url).toMatch(/^irealb:\/\//);
    expect(url).toContain(encodeURIComponent("Test Song"));
    expect(url).toContain(encodeURIComponent("Test Composer"));
  });

  it("should be parseable (roundtrip sanity check)", () => {
    const sheet = createTestSheet();
    const url = exportToIRealUrl(sheet);
    expect(url.length).toBeGreaterThan(20);
    expect(url.startsWith("irealb://")).toBe(true);
  });
});

describe("exportPlaylistToIRealUrl", () => {
  it("should export multiple songs", () => {
    const sheet1 = createTestSheet({ title: "Song 1" });
    const sheet2 = createTestSheet({ title: "Song 2", key: "G" });
    const url = exportPlaylistToIRealUrl([sheet1, sheet2]);

    expect(url).toMatch(/^irealb:\/\//);
    expect(url).toContain("===");
  });

  it("should handle empty list", () => {
    const url = exportPlaylistToIRealUrl([]);
    expect(url).toBe("irealb://");
  });
});

describe("exportToIRealHtml", () => {
  it("should generate valid HTML", () => {
    const sheet = createTestSheet();
    const html = exportToIRealHtml(sheet);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("Test Song");
    expect(html).toContain("Test Composer");
    expect(html).toContain("irealb://");
    expect(html).toContain("Open in iReal Pro");
  });
});
