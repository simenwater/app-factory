/**
 * @fileoverview 摘要工具函数单元测试
 */

import { extractTodosLocally, buildSummaryPrompt } from "@/lib/summary";

describe("extractTodosLocally", () => {
  it("应提取 '需要' 模式的待办事项", () => {
    const text = "我们需要完成报告。然后需要提交审核。";
    const todos = extractTodosLocally(text);
    expect(todos).toContain("完成报告");
    expect(todos).toContain("提交审核");
  });

  it("应提取 '记得' 模式的待办事项", () => {
    const text = "记得发邮件给客户。别忘了更新文档。";
    const todos = extractTodosLocally(text);
    expect(todos).toContain("发邮件给客户");
    expect(todos).toContain("更新文档");
  });

  it("应提取英文 TODO 模式", () => {
    const text = "TODO: review the code。TODO: update tests。";
    const todos = extractTodosLocally(text);
    expect(todos.some((t) => t.includes("review the code"))).toBe(true);
  });

  it("应去除重复项", () => {
    const text = "需要开会。需要开会。";
    const todos = extractTodosLocally(text);
    const unique = [...new Set(todos)];
    expect(todos.length).toBe(unique.length);
  });

  it("应忽略太短的匹配", () => {
    const text = "需要吃。需要完成季度报告的最终版本。";
    const todos = extractTodosLocally(text);
    expect(todos).not.toContain("吃");
    expect(todos).toContain("完成季度报告的最终版本");
  });
});

describe("buildSummaryPrompt", () => {
  it("应返回包含 JSON 结构描述的提示词", () => {
    const prompt = buildSummaryPrompt();
    expect(prompt).toContain("JSON");
    expect(prompt).toContain("title");
    expect(prompt).toContain("summary");
    expect(prompt).toContain("keyPoints");
    expect(prompt).toContain("todoItems");
    expect(prompt).toContain("tags");
  });

  it("应包含优先级说明", () => {
    const prompt = buildSummaryPrompt();
    expect(prompt).toContain("high");
    expect(prompt).toContain("medium");
    expect(prompt).toContain("low");
  });
});
