/**
 * @fileoverview 项目上下文导出/导入功能
 */

import { ExportBundle, ExportFormat, Project, Template } from "@/types";

const EXPORT_VERSION = "1.0.0";

/**
 * 将项目列表和自定义模板导出为 JSON 格式
 * @param projects - 项目列表
 * @param customTemplates - 自定义模板列表
 * @returns 导出数据包
 */
export function createExportBundle(
  projects: Project[],
  customTemplates: Template[]
): ExportBundle {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    projects,
    customTemplates: customTemplates.filter((t) => !t.isBuiltIn),
  };
}

/**
 * 验证导入的数据包格式是否正确
 * @param data - 待验证的数据
 * @returns 验证结果与解析后的数据包
 */
export function validateImportBundle(data: unknown): {
  valid: boolean;
  bundle?: ExportBundle;
  error?: string;
} {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "无效的导入数据格式" };
  }

  const obj = data as Record<string, unknown>;

  if (!obj.version || typeof obj.version !== "string") {
    return { valid: false, error: "缺少版本信息" };
  }

  if (!obj.exportedAt || typeof obj.exportedAt !== "string") {
    return { valid: false, error: "缺少导出时间信息" };
  }

  if (!Array.isArray(obj.projects)) {
    return { valid: false, error: "缺少项目数据" };
  }

  for (const project of obj.projects) {
    if (!project.id || !project.name || !project.agentsContent) {
      return { valid: false, error: "项目数据不完整" };
    }
  }

  if (!Array.isArray(obj.customTemplates)) {
    return { valid: false, error: "缺少自定义模板数据" };
  }

  return { valid: true, bundle: data as ExportBundle };
}

/**
 * 将单个项目的 AGENTS.md 内容导出为指定格式的字符串
 * @param project - 项目对象
 * @param format - 导出格式
 * @returns 格式化后的字符串
 */
export function exportProjectContent(
  project: Project,
  format: ExportFormat
): string {
  switch (format) {
    case "md":
      return project.agentsContent;
    case "json":
      return JSON.stringify(
        {
          name: project.name,
          description: project.description,
          agentsContent: project.agentsContent,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      );
    case "yaml":
      return [
        `name: "${project.name}"`,
        `description: "${project.description}"`,
        `exported_at: "${new Date().toISOString()}"`,
        `agents_content: |`,
        ...project.agentsContent.split("\n").map((line) => `  ${line}`),
      ].join("\n");
    default:
      return project.agentsContent;
  }
}

/**
 * 触发浏览器下载文件
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mimeType - MIME 类型
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 从文件内容解析导入数据
 * @param fileContent - 文件内容字符串
 * @returns 解析结果
 */
export function parseImportFile(fileContent: string): {
  valid: boolean;
  bundle?: ExportBundle;
  error?: string;
} {
  try {
    const data = JSON.parse(fileContent);
    return validateImportBundle(data);
  } catch {
    return { valid: false, error: "无法解析文件内容，请确保是有效的 JSON 格式" };
  }
}

/**
 * 获取导出格式对应的文件扩展名和 MIME 类型
 * @param format - 导出格式
 * @returns 文件扩展名和 MIME 类型
 */
export function getFormatInfo(format: ExportFormat): {
  extension: string;
  mimeType: string;
} {
  const formatMap: Record<ExportFormat, { extension: string; mimeType: string }> = {
    md: { extension: ".md", mimeType: "text/markdown" },
    json: { extension: ".json", mimeType: "application/json" },
    yaml: { extension: ".yaml", mimeType: "text/yaml" },
  };
  return formatMap[format];
}
