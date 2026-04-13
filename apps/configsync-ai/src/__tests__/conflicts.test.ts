/**
 * @fileoverview 冲突检测引擎单元测试
 */

import {
  diffLines,
  detectConflicts,
  autoMerge,
  getConflictSeverity,
} from "@/lib/conflicts";
import { GeneratedConfig } from "@/types";

/**
 * 创建测试用的配置文件
 * @param content - 文件内容
 * @param assistant - AI 助手类型
 * @returns 配置文件对象
 */
function makeConfig(content: string, assistant: "cursor" | "codex" = "cursor"): GeneratedConfig {
  return {
    id: `test-${Date.now()}-${Math.random()}`,
    templateId: "test",
    assistant,
    fileName: ".test",
    content,
    generatedAt: new Date().toISOString(),
    scanResultId: "scan-1",
  };
}

describe("diffLines", () => {
  it("相同内容应无差异", () => {
    const content = "line1\nline2\nline3";
    const result = diffLines(content, content);
    expect(result).toEqual([]);
  });

  it("应检测修改", () => {
    const result = diffLines("hello world", "hello earth");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("modification");
  });

  it("应检测新增", () => {
    const result = diffLines("", "new line");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("addition");
  });

  it("应检测删除", () => {
    const result = diffLines("old line", "");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("deletion");
  });

  it("应处理多行差异", () => {
    const a = "line1\nline2\nline3";
    const b = "line1\nchanged\nline3";
    const result = diffLines(a, b);
    expect(result).toHaveLength(1);
    expect(result[0].lineNumber).toBe(2);
  });

  it("应处理不同长度的内容", () => {
    const a = "line1\nline2";
    const b = "line1\nline2\nline3\nline4";
    const result = diffLines(a, b);
    expect(result.length).toBe(2);
  });
});

describe("detectConflicts", () => {
  it("相同配置应无冲突", () => {
    const a = makeConfig("same content");
    const b = makeConfig("same content", "codex");
    const result = detectConflicts(a, b);
    expect(result.conflicts).toHaveLength(0);
    expect(result.status).toBe("resolved");
  });

  it("不同配置应有冲突", () => {
    const a = makeConfig("# Config A\nvalue: 1");
    const b = makeConfig("# Config B\nvalue: 2", "codex");
    const result = detectConflicts(a, b);
    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.status).toBe("unresolved");
  });
});

describe("autoMerge", () => {
  it("应合并相同内容", () => {
    const a = makeConfig("line1\nline2");
    const b = makeConfig("line1\nline2", "codex");
    const merged = autoMerge(a, b);
    expect(merged).toBe("line1\nline2");
  });

  it("应优先保留非空行", () => {
    const a = makeConfig("line1\n\nline3");
    const b = makeConfig("line1\nnew line\nline3", "codex");
    const merged = autoMerge(a, b);
    expect(merged).toContain("new line");
  });
});

describe("getConflictSeverity", () => {
  it("无冲突应为 low", () => {
    expect(getConflictSeverity([])).toBe("low");
  });

  it("少量修改应为 low 或 medium", () => {
    const items = [
      { lineNumber: 1, type: "modification" as const, contentA: "a", contentB: "b", suggestion: "" },
      { lineNumber: 2, type: "modification" as const, contentA: "c", contentB: "d", suggestion: "" },
    ];
    expect(getConflictSeverity(items)).toBe("low");
  });

  it("大量修改应为 high", () => {
    const items = Array.from({ length: 15 }, (_, i) => ({
      lineNumber: i + 1,
      type: "modification" as const,
      contentA: `old-${i}`,
      contentB: `new-${i}`,
      suggestion: "",
    }));
    expect(getConflictSeverity(items)).toBe("high");
  });
});
