/**
 * @fileoverview 导出功能单元测试
 */

import { exportToMarkdown, exportToNotion, exportToEmail, exportNote } from "@/lib/export";
import type { VoiceNote } from "@/types";

const mockNote: VoiceNote = {
  id: "test-id-1",
  createdAt: new Date("2024-01-15T10:30:00Z"),
  updatedAt: new Date("2024-01-15T10:35:00Z"),
  transcription: {
    text: "今天开会讨论了新产品的发布计划，需要在下周五之前完成设计稿。",
    duration: 180,
    language: "zh",
    confidence: 0.95,
  },
  summary: {
    title: "新产品发布计划会议",
    summary: "团队讨论了新产品的发布计划，确定了设计稿的交付时间线。",
    keyPoints: [
      "新产品下月发布",
      "设计稿下周五截止",
      "需要协调市场团队",
    ],
    todoItems: [
      {
        id: "1",
        content: "完成设计稿",
        completed: false,
        priority: "high",
      },
      {
        id: "2",
        content: "联系市场团队",
        completed: false,
        priority: "medium",
      },
    ],
    tags: ["产品", "会议", "设计"],
  },
};

describe("exportToMarkdown", () => {
  it("应包含标题", () => {
    const result = exportToMarkdown(mockNote);
    expect(result).toContain("# 新产品发布计划会议");
  });

  it("应包含摘要部分", () => {
    const result = exportToMarkdown(mockNote);
    expect(result).toContain("## 摘要");
    expect(result).toContain("团队讨论了新产品的发布计划");
  });

  it("应包含关键要点", () => {
    const result = exportToMarkdown(mockNote);
    expect(result).toContain("## 关键要点");
    expect(result).toContain("- 新产品下月发布");
    expect(result).toContain("- 设计稿下周五截止");
  });

  it("应包含待办事项与优先级标记", () => {
    const result = exportToMarkdown(mockNote);
    expect(result).toContain("## 待办事项");
    expect(result).toContain("[ ]");
    expect(result).toContain("完成设计稿");
  });

  it("应包含标签", () => {
    const result = exportToMarkdown(mockNote);
    expect(result).toContain("#产品");
    expect(result).toContain("#会议");
  });

  it("应包含原始转录", () => {
    const result = exportToMarkdown(mockNote);
    expect(result).toContain("## 原始转录");
    expect(result).toContain("今天开会讨论了新产品的发布计划");
  });
});

describe("exportToNotion", () => {
  it("应包含标题和日期", () => {
    const result = exportToNotion(mockNote);
    expect(result).toContain("新产品发布计划会议");
    expect(result).toContain("📅");
  });

  it("应包含标签", () => {
    const result = exportToNotion(mockNote);
    expect(result).toContain("🏷️");
    expect(result).toContain("产品");
  });

  it("应包含待办事项状态", () => {
    const result = exportToNotion(mockNote);
    expect(result).toContain("✅ 待办事项");
    expect(result).toContain("○");
    expect(result).toContain("完成设计稿");
  });
});

describe("exportToEmail", () => {
  it("应包含主题行", () => {
    const result = exportToEmail(mockNote);
    expect(result).toContain("主题：新产品发布计划会议");
  });

  it("应包含编号要点", () => {
    const result = exportToEmail(mockNote);
    expect(result).toContain("1. 新产品下月发布");
    expect(result).toContain("2. 设计稿下周五截止");
  });

  it("应包含带优先级的行动项目", () => {
    const result = exportToEmail(mockNote);
    expect(result).toContain("[紧急] 完成设计稿");
    expect(result).toContain("[一般] 联系市场团队");
  });
});

describe("exportNote", () => {
  it("应根据格式选择正确的导出器", () => {
    const md = exportNote(mockNote, "markdown");
    expect(md).toContain("# 新产品发布计划会议");

    const notion = exportNote(mockNote, "notion");
    expect(notion).toContain("📅");

    const email = exportNote(mockNote, "email");
    expect(email).toContain("主题：");
  });
});
