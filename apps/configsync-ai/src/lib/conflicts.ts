/**
 * @fileoverview 配置文件冲突检测与合并建议引擎
 */

import { ConflictItem, ConflictResult, GeneratedConfig } from "@/types";

/**
 * 逐行比较两段文本内容
 * @param contentA - 文件A内容
 * @param contentB - 文件B内容
 * @returns 差异行列表
 */
export function diffLines(contentA: string, contentB: string): ConflictItem[] {
  const linesA = contentA.split("\n");
  const linesB = contentB.split("\n");
  const maxLen = Math.max(linesA.length, linesB.length);
  const conflicts: ConflictItem[] = [];

  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i] ?? "";
    const lineB = linesB[i] ?? "";

    if (lineA !== lineB) {
      let type: ConflictItem["type"];
      if (!lineA.trim() && lineB.trim()) {
        type = "addition";
      } else if (lineA.trim() && !lineB.trim()) {
        type = "deletion";
      } else {
        type = "modification";
      }

      conflicts.push({
        lineNumber: i + 1,
        type,
        contentA: lineA,
        contentB: lineB,
        suggestion: generateSuggestion(type, lineA, lineB),
      });
    }
  }

  return conflicts;
}

/**
 * 为冲突生成合并建议
 * @param type - 冲突类型
 * @param lineA - 文件A的行内容
 * @param lineB - 文件B的行内容
 * @returns 建议文本
 */
function generateSuggestion(
  type: ConflictItem["type"],
  lineA: string,
  lineB: string
): string {
  switch (type) {
    case "addition":
      return `建议保留新增内容: "${lineB.trim()}"`;
    case "deletion":
      return `被删除的内容: "${lineA.trim()}"。如果不再需要可以安全删除`;
    case "modification":
      if (lineA.trim().startsWith("#") || lineB.trim().startsWith("#")) {
        return `标题变更。建议使用较新版本: "${lineB.trim()}"`;
      }
      if (lineA.length > lineB.length) {
        return `内容被简化。建议保留更详细的版本: "${lineA.trim()}"`;
      }
      return `内容已更新。建议采用较新版本: "${lineB.trim()}"`;
  }
}

/**
 * 检测两个配置文件之间的冲突
 * @param configA - 配置文件A
 * @param configB - 配置文件B
 * @returns 冲突检测结果
 */
export function detectConflicts(
  configA: GeneratedConfig,
  configB: GeneratedConfig
): ConflictResult {
  const conflicts = diffLines(configA.content, configB.content);

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    fileA: configA,
    fileB: configB,
    conflicts,
    status: conflicts.length > 0 ? "unresolved" : "resolved",
  };
}

/**
 * 自动合并两个配置文件（简单策略：优先保留较新内容）
 * @param configA - 配置文件A
 * @param configB - 配置文件B（较新）
 * @returns 合并后的内容
 */
export function autoMerge(configA: GeneratedConfig, configB: GeneratedConfig): string {
  const linesA = configA.content.split("\n");
  const linesB = configB.content.split("\n");
  const maxLen = Math.max(linesA.length, linesB.length);
  const merged: string[] = [];

  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i] ?? "";
    const lineB = linesB[i] ?? "";

    if (lineA === lineB) {
      merged.push(lineA);
    } else if (!lineA.trim()) {
      merged.push(lineB);
    } else if (!lineB.trim()) {
      merged.push(lineA);
    } else {
      merged.push(lineB);
    }
  }

  return merged.join("\n");
}

/**
 * 计算冲突严重程度
 * @param conflicts - 冲突项列表
 * @returns 严重程度等级 low | medium | high
 */
export function getConflictSeverity(conflicts: ConflictItem[]): "low" | "medium" | "high" {
  if (conflicts.length === 0) return "low";
  const modifications = conflicts.filter((c) => c.type === "modification").length;
  if (modifications > 10) return "high";
  if (modifications > 3) return "medium";
  return "low";
}
