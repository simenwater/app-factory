/**
 * @fileoverview 转录工具函数单元测试
 */

import { formatDuration, countWords } from "@/lib/transcription";

describe("formatDuration", () => {
  it("应正确格式化秒数为 m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(30)).toBe("0:30");
    expect(formatDuration(60)).toBe("1:00");
    expect(formatDuration(90)).toBe("1:30");
    expect(formatDuration(125)).toBe("2:05");
    expect(formatDuration(3600)).toBe("60:00");
  });

  it("应处理小数秒数", () => {
    expect(formatDuration(90.7)).toBe("1:30");
    expect(formatDuration(59.9)).toBe("0:59");
  });
});

describe("countWords", () => {
  it("应正确统计中文字数", () => {
    expect(countWords("今天天气很好")).toBe(6);
    expect(countWords("你好")).toBe(2);
  });

  it("应正确统计英文词数", () => {
    expect(countWords("hello world")).toBe(2);
    expect(countWords("one two three")).toBe(3);
  });

  it("应正确统计中英混合文本", () => {
    expect(countWords("今天是Monday")).toBe(4);
    expect(countWords("我喜欢 React")).toBe(4);
  });

  it("应处理空字符串", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});
