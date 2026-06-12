import {
  generateId,
  formatDuration,
  formatDate,
  formatRelativeTime,
  truncateText,
  getCurrentMonthResetDate,
} from "@/lib/utils";

describe("generateId", () => {
  it("should generate a unique UUID string", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).toBeTruthy();
    expect(typeof id1).toBe("string");
    expect(id1).not.toBe(id2);
  });
});

describe("formatDuration", () => {
  it("should format 0 seconds as 00:00", () => {
    expect(formatDuration(0)).toBe("00:00");
  });

  it("should format seconds correctly", () => {
    expect(formatDuration(5)).toBe("00:05");
    expect(formatDuration(59)).toBe("00:59");
  });

  it("should format minutes and seconds correctly", () => {
    expect(formatDuration(60)).toBe("01:00");
    expect(formatDuration(125)).toBe("02:05");
    expect(formatDuration(3661)).toBe("61:01");
  });

  it("should handle decimal seconds", () => {
    expect(formatDuration(5.7)).toBe("00:05");
  });
});

describe("formatDate", () => {
  it("should format a date string with Chinese locale", () => {
    const result = formatDate("2025-03-15T10:30:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("formatRelativeTime", () => {
  it("should return '刚刚' for very recent dates", () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe("刚刚");
  });

  it("should return minutes ago for recent dates", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toBe("5分钟前");
  });

  it("should return hours ago for older dates", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe("2小时前");
  });

  it("should return days ago for multi-day old dates", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe("3天前");
  });
});

describe("truncateText", () => {
  it("should not truncate short text", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("should truncate long text and add ellipsis", () => {
    expect(truncateText("hello world this is a long text", 10)).toBe(
      "hello worl..."
    );
  });

  it("should handle exact length", () => {
    expect(truncateText("hello", 5)).toBe("hello");
  });
});

describe("getCurrentMonthResetDate", () => {
  it("should return first day of current month", () => {
    const resetDate = getCurrentMonthResetDate();
    const date = new Date(resetDate);
    expect(date.getDate()).toBe(1);
    expect(date.getMonth()).toBe(new Date().getMonth());
    expect(date.getFullYear()).toBe(new Date().getFullYear());
  });
});
