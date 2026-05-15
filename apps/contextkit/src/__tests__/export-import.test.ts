/**
 * @fileoverview 导出/导入功能单元测试
 */

import {
  createExportBundle,
  validateImportBundle,
  exportProjectContent,
  parseImportFile,
  getFormatInfo,
} from "@/lib/export-import";
import { Project, Template } from "@/types";

const mockProject: Project = {
  id: "test-project-1",
  name: "Test Project",
  description: "A test project",
  agentsContent: "# AGENTS.md — Test Project\n\n## Overview\nTest content",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  syncStatus: "local-only",
};

const mockTemplate: Template = {
  id: "custom-tpl-1",
  name: "Custom Template",
  description: "A custom template",
  category: "custom",
  content: "# Custom Template",
  tags: ["custom"],
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  isBuiltIn: false,
};

const mockBuiltInTemplate: Template = {
  ...mockTemplate,
  id: "built-in-tpl-1",
  isBuiltIn: true,
};

describe("createExportBundle", () => {
  it("应创建包含正确版本的导出包", () => {
    const bundle = createExportBundle([mockProject], [mockTemplate]);
    expect(bundle.version).toBe("1.0.0");
    expect(bundle.exportedAt).toBeTruthy();
  });

  it("应包含所有项目", () => {
    const bundle = createExportBundle([mockProject], []);
    expect(bundle.projects).toHaveLength(1);
    expect(bundle.projects[0].id).toBe("test-project-1");
  });

  it("应排除内置模板", () => {
    const bundle = createExportBundle([], [mockTemplate, mockBuiltInTemplate]);
    expect(bundle.customTemplates).toHaveLength(1);
    expect(bundle.customTemplates[0].id).toBe("custom-tpl-1");
  });
});

describe("validateImportBundle", () => {
  it("应验证有效的导入包", () => {
    const bundle = createExportBundle([mockProject], [mockTemplate]);
    const result = validateImportBundle(bundle);
    expect(result.valid).toBe(true);
    expect(result.bundle).toBeDefined();
  });

  it("应拒绝 null 数据", () => {
    const result = validateImportBundle(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("应拒绝缺少版本的数据", () => {
    const result = validateImportBundle({ exportedAt: "test", projects: [], customTemplates: [] });
    expect(result.valid).toBe(false);
  });

  it("应拒绝缺少项目数据的包", () => {
    const result = validateImportBundle({ version: "1.0.0", exportedAt: "test", customTemplates: [] });
    expect(result.valid).toBe(false);
  });

  it("应拒绝项目数据不完整的包", () => {
    const result = validateImportBundle({
      version: "1.0.0",
      exportedAt: "test",
      projects: [{ id: "1" }],
      customTemplates: [],
    });
    expect(result.valid).toBe(false);
  });
});

describe("exportProjectContent", () => {
  it("应导出 Markdown 格式", () => {
    const result = exportProjectContent(mockProject, "md");
    expect(result).toBe(mockProject.agentsContent);
  });

  it("应导出 JSON 格式", () => {
    const result = exportProjectContent(mockProject, "json");
    const parsed = JSON.parse(result);
    expect(parsed.name).toBe("Test Project");
    expect(parsed.agentsContent).toBeTruthy();
  });

  it("应导出 YAML 格式", () => {
    const result = exportProjectContent(mockProject, "yaml");
    expect(result).toContain("name: \"Test Project\"");
    expect(result).toContain("agents_content: |");
  });
});

describe("parseImportFile", () => {
  it("应解析有效的 JSON 文件", () => {
    const bundle = createExportBundle([mockProject], [mockTemplate]);
    const json = JSON.stringify(bundle);
    const result = parseImportFile(json);
    expect(result.valid).toBe(true);
  });

  it("应拒绝无效的 JSON", () => {
    const result = parseImportFile("not valid json");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("JSON");
  });
});

describe("getFormatInfo", () => {
  it("应返回正确的 md 格式信息", () => {
    const info = getFormatInfo("md");
    expect(info.extension).toBe(".md");
    expect(info.mimeType).toBe("text/markdown");
  });

  it("应返回正确的 json 格式信息", () => {
    const info = getFormatInfo("json");
    expect(info.extension).toBe(".json");
    expect(info.mimeType).toBe("application/json");
  });

  it("应返回正确的 yaml 格式信息", () => {
    const info = getFormatInfo("yaml");
    expect(info.extension).toBe(".yaml");
    expect(info.mimeType).toBe("text/yaml");
  });
});
