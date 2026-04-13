/**
 * @fileoverview 配置生成器单元测试
 */

import {
  buildVariablesFromScan,
  renderTemplate,
  mergeVariables,
  generateConfig,
  generateMultipleConfigs,
  getDefaultVariables,
} from "@/lib/generator";
import { createDemoScanResult } from "@/lib/scanner";
import { allTemplates, getTemplateById } from "@/lib/templates";

describe("renderTemplate", () => {
  it("应正确替换模板变量", () => {
    const template = "Hello {{NAME}}, welcome to {{PROJECT}}!";
    const vars = { NAME: "Developer", PROJECT: "ConfigSync" };
    const result = renderTemplate(template, vars);
    expect(result).toBe("Hello Developer, welcome to ConfigSync!");
  });

  it("应处理缺失变量（保留空字符串）", () => {
    const template = "{{KNOWN}} and {{UNKNOWN}}";
    const result = renderTemplate(template, { KNOWN: "value" });
    expect(result).toContain("value");
  });

  it("应替换同一变量的多次出现", () => {
    const template = "{{X}} + {{X}} = 2 * {{X}}";
    const result = renderTemplate(template, { X: "a" });
    expect(result).toBe("a + a = 2 * a");
  });
});

describe("buildVariablesFromScan", () => {
  it("应从扫描结果生成正确的变量", () => {
    const scan = createDemoScanResult("my-project");
    const vars = buildVariablesFromScan(scan);

    expect(vars.PROJECT_NAME).toBe("my-project");
    expect(vars.TECH_STACK).toBeTruthy();
    expect(vars.PROJECT_STRUCTURE).toBeTruthy();
    expect(vars.LANGUAGE).toBeTruthy();
  });
});

describe("mergeVariables", () => {
  it("应合并变量并优先使用自定义值", () => {
    const auto = { A: "auto-a", B: "auto-b" };
    const custom = { B: "custom-b", C: "custom-c" };
    const result = mergeVariables(auto, custom);

    expect(result.A).toBe("auto-a");
    expect(result.B).toBe("custom-b");
    expect(result.C).toBe("custom-c");
  });
});

describe("generateConfig", () => {
  it("应使用模板和扫描结果生成配置", () => {
    const template = allTemplates[0];
    const scan = createDemoScanResult("test");
    const config = generateConfig(template, scan);

    expect(config.templateId).toBe(template.id);
    expect(config.assistant).toBe(template.assistant);
    expect(config.fileName).toBe(template.fileName);
    expect(config.content).toContain("test");
    expect(config.generatedAt).toBeTruthy();
  });

  it("应支持自定义变量覆盖", () => {
    const template = allTemplates[0];
    const scan = createDemoScanResult("test");
    const config = generateConfig(template, scan, { PROJECT_NAME: "custom-name" });

    expect(config.content).toContain("custom-name");
  });
});

describe("generateMultipleConfigs", () => {
  it("应为多个模板生成配置", () => {
    const scan = createDemoScanResult("test");
    const configs = generateMultipleConfigs(allTemplates.slice(0, 3), scan);

    expect(configs).toHaveLength(3);
    const assistants = configs.map((c) => c.assistant);
    expect(new Set(assistants).size).toBe(3);
  });
});

describe("getDefaultVariables", () => {
  it("应返回模板默认变量", () => {
    const template = getTemplateById("cursor-rules")!;
    const defaults = getDefaultVariables(template.variables);

    expect(defaults.PROJECT_NAME).toBe("My Project");
    expect(Object.keys(defaults).length).toBe(template.variables.length);
  });
});
