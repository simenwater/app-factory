/**
 * @fileoverview 模板管理单元测试
 */

import { allTemplates, getTemplateByAssistant, getTemplateById } from "@/lib/templates";

describe("allTemplates", () => {
  it("应包含所有 5 个 AI 助手的模板", () => {
    expect(allTemplates).toHaveLength(5);
    const assistants = allTemplates.map((t) => t.assistant);
    expect(assistants).toContain("cursor");
    expect(assistants).toContain("codex");
    expect(assistants).toContain("claude-code");
    expect(assistants).toContain("copilot");
    expect(assistants).toContain("windsurf");
  });

  it("每个模板应有唯一 ID", () => {
    const ids = allTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("每个模板应有变量定义", () => {
    for (const template of allTemplates) {
      expect(template.variables.length).toBeGreaterThan(0);
    }
  });

  it("每个模板应有有效的文件名", () => {
    for (const template of allTemplates) {
      expect(template.fileName).toBeTruthy();
      expect(template.fileName.length).toBeGreaterThan(0);
    }
  });

  it("每个模板内容应包含变量占位符", () => {
    for (const template of allTemplates) {
      expect(template.content).toContain("{{PROJECT_NAME}}");
    }
  });
});

describe("getTemplateByAssistant", () => {
  it("应根据助手类型返回正确模板", () => {
    const template = getTemplateByAssistant("cursor");
    expect(template).toBeDefined();
    expect(template!.assistant).toBe("cursor");
    expect(template!.fileName).toBe(".cursorrules");
  });

  it("不存在的助手应返回 undefined", () => {
    expect(getTemplateByAssistant("nonexistent")).toBeUndefined();
  });
});

describe("getTemplateById", () => {
  it("应根据 ID 返回正确模板", () => {
    const template = getTemplateById("cursor-rules");
    expect(template).toBeDefined();
    expect(template!.id).toBe("cursor-rules");
  });

  it("不存在的 ID 应返回 undefined", () => {
    expect(getTemplateById("nonexistent")).toBeUndefined();
  });
});
