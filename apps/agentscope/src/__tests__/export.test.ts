/**
 * @fileoverview 日志导出功能测试
 */

import { exportLogs } from "../lib/export";
import type { RequestLog } from "../types";

const mockLog: RequestLog = {
  id: "test-id-1",
  timestamp: 1700000000000,
  provider: "openai",
  model: "gpt-4o",
  method: "POST",
  url: "https://api.openai.com/v1/chat/completions",
  requestHeaders: { "content-type": "application/json" },
  requestBody: { model: "gpt-4o", messages: [] },
  statusCode: 200,
  responseHeaders: { "content-type": "application/json" },
  responseBody: { choices: [], usage: { prompt_tokens: 100, completion_tokens: 50 } },
  status: "completed",
  duration: 1500,
  inputTokens: 100,
  outputTokens: 50,
  estimatedCost: 0.00075,
  agentName: "Claude Code",
  error: null,
};

const mockErrorLog: RequestLog = {
  ...mockLog,
  id: "test-id-2",
  status: "error",
  statusCode: 429,
  error: "Rate limit exceeded",
  inputTokens: null,
  outputTokens: null,
  estimatedCost: null,
};

describe("exportLogs - JSON", () => {
  it("should export valid JSON", () => {
    const result = exportLogs([mockLog], "json");
    const parsed = JSON.parse(result);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(1);
  });

  it("should include essential fields", () => {
    const result = exportLogs([mockLog], "json");
    const parsed = JSON.parse(result);
    expect(parsed[0].id).toBe("test-id-1");
    expect(parsed[0].model).toBe("gpt-4o");
    expect(parsed[0].provider).toBe("openai");
    expect(parsed[0].inputTokens).toBe(100);
    expect(parsed[0].outputTokens).toBe(50);
    expect(parsed[0].estimatedCost).toBe(0.00075);
  });

  it("should handle empty logs", () => {
    const result = exportLogs([], "json");
    expect(JSON.parse(result)).toEqual([]);
  });

  it("should handle error logs with null fields", () => {
    const result = exportLogs([mockErrorLog], "json");
    const parsed = JSON.parse(result);
    expect(parsed[0].error).toBe("Rate limit exceeded");
    expect(parsed[0].inputTokens).toBeNull();
  });
});

describe("exportLogs - CSV", () => {
  it("should produce valid CSV with header", () => {
    const result = exportLogs([mockLog], "csv");
    const lines = result.split("\n");
    expect(lines.length).toBe(2);
    expect(lines[0]).toContain("ID");
    expect(lines[0]).toContain("Model");
    expect(lines[0]).toContain("Estimated Cost");
  });

  it("should include data in rows", () => {
    const result = exportLogs([mockLog], "csv");
    const lines = result.split("\n");
    expect(lines[1]).toContain("test-id-1");
    expect(lines[1]).toContain("gpt-4o");
    expect(lines[1]).toContain("openai");
  });

  it("should handle multiple rows", () => {
    const result = exportLogs([mockLog, mockErrorLog], "csv");
    const lines = result.split("\n");
    expect(lines.length).toBe(3);
  });

  it("should handle empty logs", () => {
    const result = exportLogs([], "csv");
    const lines = result.split("\n");
    expect(lines.length).toBe(1); // header only
  });
});
