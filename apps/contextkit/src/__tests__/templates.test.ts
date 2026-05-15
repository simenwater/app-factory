/**
 * @fileoverview 模板库单元测试
 */

import {
  builtInTemplates,
  filterTemplatesByCategory,
  searchTemplates,
  applyTemplate,
  getCategoryLabel,
} from "@/lib/templates";

describe("builtInTemplates", () => {
  it("应包含至少 5 个内置模板", () => {
    expect(builtInTemplates.length).toBeGreaterThanOrEqual(5);
  });

  it("每个模板应包含必要字段", () => {
    builtInTemplates.forEach((template) => {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.content).toBeTruthy();
      expect(template.tags.length).toBeGreaterThan(0);
      expect(template.isBuiltIn).toBe(true);
    });
  });

  it("每个模板的内容应以 # AGENTS.md 开头", () => {
    builtInTemplates.forEach((template) => {
      expect(template.content).toMatch(/^# AGENTS\.md/);
    });
  });
});

describe("filterTemplatesByCategory", () => {
  it("过滤 'all' 应返回全部模板", () => {
    const result = filterTemplatesByCategory(builtInTemplates, "all");
    expect(result.length).toBe(builtInTemplates.length);
  });

  it("过滤 'frontend' 应只返回前端模板", () => {
    const result = filterTemplatesByCategory(builtInTemplates, "frontend");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((t) => expect(t.category).toBe("frontend"));
  });

  it("过滤不存在的分类应返回空数组", () => {
    const result = filterTemplatesByCategory(builtInTemplates, "custom");
    expect(result.length).toBe(0);
  });
});

describe("searchTemplates", () => {
  it("搜索 'React' 应返回包含 React 标签或描述的模板", () => {
    const result = searchTemplates(builtInTemplates, "React");
    expect(result.length).toBeGreaterThan(0);
  });

  it("搜索空字符串应返回全部模板", () => {
    const result = searchTemplates(builtInTemplates, "");
    expect(result.length).toBe(builtInTemplates.length);
  });

  it("搜索应大小写不敏感", () => {
    const result1 = searchTemplates(builtInTemplates, "react");
    const result2 = searchTemplates(builtInTemplates, "REACT");
    expect(result1.length).toBe(result2.length);
  });

  it("搜索不存在的关键词应返回空数组", () => {
    const result = searchTemplates(builtInTemplates, "xyz-nonexistent-12345");
    expect(result.length).toBe(0);
  });
});

describe("applyTemplate", () => {
  it("应将模板中的项目名替换为指定名称", () => {
    const template = builtInTemplates[0];
    const result = applyTemplate(template, "TestProject");
    expect(result).toContain("# AGENTS.md — TestProject");
  });

  it("应保留模板的其余内容", () => {
    const template = builtInTemplates[0];
    const result = applyTemplate(template, "TestProject");
    expect(result).toContain("## Project Overview");
  });
});

describe("getCategoryLabel", () => {
  it("应返回正确的中文标签", () => {
    expect(getCategoryLabel("all")).toBe("全部");
    expect(getCategoryLabel("frontend")).toBe("前端");
    expect(getCategoryLabel("backend")).toBe("后端");
    expect(getCategoryLabel("fullstack")).toBe("全栈");
    expect(getCategoryLabel("mobile")).toBe("移动端");
    expect(getCategoryLabel("devops")).toBe("DevOps");
    expect(getCategoryLabel("data")).toBe("数据工程");
    expect(getCategoryLabel("custom")).toBe("自定义");
  });
});
