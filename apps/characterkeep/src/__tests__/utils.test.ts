/**
 * @fileoverview 工具函数单元测试
 */

import {
  randomAvatarColor,
  AVATAR_COLORS,
  truncateText,
  severityColor,
  conflictLevelColor,
} from "@/lib/utils";

describe("randomAvatarColor", () => {
  it("应返回预设颜色中的一个", () => {
    const color = randomAvatarColor();
    expect(AVATAR_COLORS).toContain(color);
  });

  it("多次调用应都返回有效颜色", () => {
    for (let i = 0; i < 20; i++) {
      expect(AVATAR_COLORS).toContain(randomAvatarColor());
    }
  });
});

describe("truncateText", () => {
  it("短文本不应被截断", () => {
    expect(truncateText("你好", 10)).toBe("你好");
  });

  it("超长文本应被截断并加省略号", () => {
    const text = "这是一段很长的测试文本";
    const result = truncateText(text, 5);
    expect(result.length).toBe(6); // 5 chars + "…"
    expect(result.endsWith("…")).toBe(true);
  });

  it("恰好等于最大长度时不截断", () => {
    expect(truncateText("12345", 5)).toBe("12345");
  });
});

describe("severityColor", () => {
  it("error 应返回红色类", () => {
    expect(severityColor("error")).toBe("text-red-500");
  });

  it("warning 应返回琥珀色类", () => {
    expect(severityColor("warning")).toBe("text-amber-500");
  });

  it("info 应返回蓝色类", () => {
    expect(severityColor("info")).toBe("text-blue-500");
  });
});

describe("conflictLevelColor", () => {
  it("级别 >= 4 应返回红色", () => {
    expect(conflictLevelColor(4)).toBe("text-red-500");
    expect(conflictLevelColor(5)).toBe("text-red-500");
  });

  it("级别 3 应返回琥珀色", () => {
    expect(conflictLevelColor(3)).toBe("text-amber-500");
  });

  it("级别 < 3 应返回蓝色", () => {
    expect(conflictLevelColor(1)).toBe("text-blue-500");
    expect(conflictLevelColor(2)).toBe("text-blue-500");
  });
});
