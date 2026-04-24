import { formatDuration, truncateText, formatDate } from "@/lib/utils";

describe("formatDuration", () => {
  it("should format 0 seconds as 00:00", () => {
    expect(formatDuration(0)).toBe("00:00");
  });

  it("should format 65 seconds as 01:05", () => {
    expect(formatDuration(65)).toBe("01:05");
  });

  it("should format 3600 seconds as 60:00", () => {
    expect(formatDuration(3600)).toBe("60:00");
  });

  it("should format single digit seconds with leading zero", () => {
    expect(formatDuration(5)).toBe("00:05");
  });
});

describe("truncateText", () => {
  it("should return original text if shorter than maxLength", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("should truncate and add ellipsis", () => {
    expect(truncateText("hello world", 5)).toBe("hello...");
  });

  it("should return original text if equal to maxLength", () => {
    expect(truncateText("hello", 5)).toBe("hello");
  });

  it("should handle empty string", () => {
    expect(truncateText("", 10)).toBe("");
  });
});

describe("formatDate", () => {
  it("should return a formatted date string", () => {
    const result = formatDate("2025-01-15T10:30:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
