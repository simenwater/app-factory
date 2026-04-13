/**
 * @fileoverview 配置文件生成器
 * 将扫描结果与模板组合生成配置文件
 */

import { ConfigTemplate, GeneratedConfig, ScanResult, TemplateVariable } from "@/types";
import { generateTreeText } from "./scanner";

/**
 * 使用扫描结果填充模板变量
 * @param scanResult - 项目扫描结果
 * @returns 变量键值对
 */
export function buildVariablesFromScan(scanResult: ScanResult): Record<string, string> {
  const primaryLang = scanResult.languages[0]?.language || "Unknown";
  const techStack = [
    ...scanResult.languages.slice(0, 3).map((l) => l.language),
    ...scanResult.frameworks,
  ].join(", ");

  const treeText = generateTreeText(scanResult.fileTree);
  const deps = scanResult.frameworks.map((f) => `- ${f}`).join("\n") || "- None detected";

  return {
    PROJECT_NAME: scanResult.projectName,
    PROJECT_DESCRIPTION: `A ${primaryLang} project using ${scanResult.frameworks.join(", ") || "no specific framework"}`,
    TECH_STACK: techStack,
    PROJECT_STRUCTURE: treeText,
    LANGUAGE: primaryLang,
    FRAMEWORK: scanResult.frameworks[0] || "None",
    DEPENDENCIES: deps,
    BUILD_COMMAND: "npm run build",
    TEST_COMMAND: "npm test",
    LINT_COMMAND: "npm run lint",
    NOTES: `Scanned ${scanResult.totalFiles} files in ${scanResult.totalDirs} directories`,
  };
}

/**
 * 用变量替换模板中的占位符
 * @param template - 模板内容
 * @param variables - 变量键值对
 * @returns 替换后的内容
 */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }
  return result;
}

/**
 * 自定义变量覆盖
 * @param autoVars - 自动生成的变量
 * @param customVars - 用户自定义变量
 * @returns 合并后的变量
 */
export function mergeVariables(
  autoVars: Record<string, string>,
  customVars: Record<string, string>
): Record<string, string> {
  return { ...autoVars, ...customVars };
}

/**
 * 使用模板和扫描结果生成配置文件
 * @param template - 配置模板
 * @param scanResult - 扫描结果
 * @param customVars - 自定义变量覆盖
 * @returns 生成的配置文件
 */
export function generateConfig(
  template: ConfigTemplate,
  scanResult: ScanResult,
  customVars: Record<string, string> = {}
): GeneratedConfig {
  const autoVars = buildVariablesFromScan(scanResult);
  const mergedVars = mergeVariables(autoVars, customVars);
  const content = renderTemplate(template.content, mergedVars);

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    templateId: template.id,
    assistant: template.assistant,
    fileName: template.fileName,
    content,
    generatedAt: new Date().toISOString(),
    scanResultId: scanResult.id,
  };
}

/**
 * 批量生成多个 AI 助手的配置文件
 * @param templates - 模板列表
 * @param scanResult - 扫描结果
 * @param customVars - 自定义变量覆盖
 * @returns 生成的配置文件列表
 */
export function generateMultipleConfigs(
  templates: ConfigTemplate[],
  scanResult: ScanResult,
  customVars: Record<string, string> = {}
): GeneratedConfig[] {
  return templates.map((template) => generateConfig(template, scanResult, customVars));
}

/**
 * 获取模板的默认变量值
 * @param variables - 模板变量定义
 * @returns 默认变量键值对
 */
export function getDefaultVariables(variables: TemplateVariable[]): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const v of variables) {
    defaults[v.key] = v.defaultValue;
  }
  return defaults;
}
