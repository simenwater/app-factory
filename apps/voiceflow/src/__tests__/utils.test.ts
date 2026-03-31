import {
  formatFileSize,
  formatDuration,
  formatDate,
  getStatusInfo,
  exportNote,
  isValidAudioFile,
} from "@/lib/utils";
import type { VoiceNote } from "@/types";

describe("formatFileSize", () => {
  it("should format 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("should format bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("should format kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(2560)).toBe("2.5 KB");
  });

  it("should format megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1 MB");
    expect(formatFileSize(5242880)).toBe("5 MB");
  });
});

describe("formatDuration", () => {
  it("should format zero duration", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("should format seconds only", () => {
    expect(formatDuration(45)).toBe("0:45");
  });

  it("should format minutes and seconds", () => {
    expect(formatDuration(125)).toBe("2:05");
  });

  it("should pad seconds with zero", () => {
    expect(formatDuration(63)).toBe("1:03");
  });
});

describe("formatDate", () => {
  it("should show '刚刚' for very recent dates", () => {
    const now = new Date().toISOString();
    expect(formatDate(now)).toBe("刚刚");
  });

  it("should show minutes ago", () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(formatDate(tenMinutesAgo)).toBe("10 分钟前");
  });

  it("should show hours ago", () => {
    const threeHoursAgo = new Date(
      Date.now() - 3 * 60 * 60 * 1000
    ).toISOString();
    expect(formatDate(threeHoursAgo)).toBe("3 小时前");
  });
});

describe("getStatusInfo", () => {
  it("should return correct info for uploading", () => {
    const info = getStatusInfo("uploading");
    expect(info.label).toBe("上传中");
    expect(info.color).toContain("blue");
  });

  it("should return correct info for completed", () => {
    const info = getStatusInfo("completed");
    expect(info.label).toBe("已完成");
    expect(info.color).toContain("emerald");
  });

  it("should return correct info for error", () => {
    const info = getStatusInfo("error");
    expect(info.label).toBe("错误");
    expect(info.color).toContain("red");
  });
});

describe("isValidAudioFile", () => {
  it("should accept MP3 files", () => {
    const file = new File([""], "test.mp3", { type: "audio/mpeg" });
    expect(isValidAudioFile(file)).toBe(true);
  });

  it("should accept WAV files", () => {
    const file = new File([""], "test.wav", { type: "audio/wav" });
    expect(isValidAudioFile(file)).toBe(true);
  });

  it("should accept files by extension when MIME type is missing", () => {
    const file = new File([""], "test.m4a", { type: "" });
    expect(isValidAudioFile(file)).toBe(true);
  });

  it("should reject non-audio files", () => {
    const file = new File([""], "test.pdf", { type: "application/pdf" });
    expect(isValidAudioFile(file)).toBe(false);
  });
});

describe("exportNote", () => {
  const mockNote: VoiceNote = {
    id: "test-id",
    title: "测试笔记",
    fileName: "test.mp3",
    fileSize: 1024,
    duration: 120,
    transcript: "这是测试转录文本。",
    summary: "这是测试摘要。",
    keyPoints: ["要点一", "要点二"],
    actionItems: ["行动项一"],
    status: "completed",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  };

  it("should export to Markdown format", () => {
    const result = exportNote(mockNote, "markdown");
    expect(result).toContain("# 测试笔记");
    expect(result).toContain("## 摘要");
    expect(result).toContain("这是测试摘要。");
    expect(result).toContain("- 要点一");
    expect(result).toContain("- [ ] 行动项一");
  });

  it("should export to Notion format", () => {
    const result = exportNote(mockNote, "notion");
    expect(result).toContain("# 测试笔记");
    expect(result).toContain("📝 摘要");
    expect(result).toContain("<details>");
    expect(result).toContain("完整转录");
  });

  it("should export to Obsidian format with frontmatter", () => {
    const result = exportNote(mockNote, "obsidian");
    expect(result).toContain("---");
    expect(result).toContain('title: "测试笔记"');
    expect(result).toContain("tags: [voice-note]");
  });

  it("should export to plain text format", () => {
    const result = exportNote(mockNote, "text");
    expect(result).toContain("测试笔记");
    expect(result).toContain("【摘要】");
    expect(result).toContain("【关键要点】");
    expect(result).toContain("【行动项】");
  });
});
