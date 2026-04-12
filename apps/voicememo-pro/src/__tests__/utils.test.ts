import {
  generateId,
  formatDuration,
  formatDate,
  truncateText,
  wordCount,
  getUsagePercentage,
  TONE_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/lib/utils";

describe("generateId", () => {
  it("应该返回非空字符串", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("两次调用应该返回不同 ID", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});

describe("formatDuration", () => {
  it("应该正确格式化 0 秒", () => {
    expect(formatDuration(0)).toBe("00:00");
  });

  it("应该正确格式化 65 秒", () => {
    expect(formatDuration(65)).toBe("01:05");
  });

  it("应该正确格式化 3661 秒", () => {
    expect(formatDuration(3661)).toBe("61:01");
  });

  it("应该处理小数秒", () => {
    expect(formatDuration(90.7)).toBe("01:30");
  });
});

describe("formatDate", () => {
  it("应该对刚才的日期返回'刚刚'", () => {
    const now = new Date().toISOString();
    expect(formatDate(now)).toBe("刚刚");
  });

  it("应该对5分钟前的日期返回'5 分钟前'", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatDate(fiveMinAgo)).toBe("5 分钟前");
  });

  it("应该对3小时前的日期返回'3 小时前'", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    expect(formatDate(threeHoursAgo)).toBe("3 小时前");
  });

  it("应该对2天前的日期返回'2 天前'", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
    expect(formatDate(twoDaysAgo)).toBe("2 天前");
  });
});

describe("truncateText", () => {
  it("不超过限制时应返回原文", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("超过限制时应截断并加省略号", () => {
    expect(truncateText("hello world", 5)).toBe("hello...");
  });

  it("恰好等于限制时应返回原文", () => {
    expect(truncateText("12345", 5)).toBe("12345");
  });
});

describe("wordCount", () => {
  it("空字符串应返回 0", () => {
    expect(wordCount("")).toBe(0);
  });

  it("纯英文应正确计数", () => {
    expect(wordCount("hello world")).toBe(2);
  });

  it("纯中文应正确计数", () => {
    expect(wordCount("你好世界")).toBe(4);
  });

  it("中英混合应正确计数", () => {
    expect(wordCount("你好 hello world 世界")).toBe(6);
  });
});

describe("getUsagePercentage", () => {
  it("未使用应返回 0", () => {
    expect(getUsagePercentage(0, 500)).toBe(0);
  });

  it("使用一半应返回 50", () => {
    expect(getUsagePercentage(250, 500)).toBe(50);
  });

  it("超过限制应返回 100", () => {
    expect(getUsagePercentage(600, 500)).toBe(100);
  });

  it("限制为 0 应返回 0", () => {
    expect(getUsagePercentage(10, 0)).toBe(0);
  });
});

describe("TONE_OPTIONS", () => {
  it("应包含 3 个选项", () => {
    expect(TONE_OPTIONS).toHaveLength(3);
  });

  it("应包含 professional, casual, marketing", () => {
    const ids = TONE_OPTIONS.map((t) => t.id);
    expect(ids).toContain("professional");
    expect(ids).toContain("casual");
    expect(ids).toContain("marketing");
  });
});

describe("PLATFORM_OPTIONS", () => {
  it("应包含 5 个选项", () => {
    expect(PLATFORM_OPTIONS).toHaveLength(5);
  });

  it("应包含 linkedin, blog, email", () => {
    const ids = PLATFORM_OPTIONS.map((p) => p.id);
    expect(ids).toContain("linkedin");
    expect(ids).toContain("blog");
    expect(ids).toContain("email");
  });
});
