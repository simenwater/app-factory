/**
 * @fileoverview 模拟数据生成器测试
 */

import { generateMockLogs } from "../lib/mock-data";

describe("generateMockLogs", () => {
  it("should generate the requested number of logs", () => {
    const logs = generateMockLogs(10);
    expect(logs).toHaveLength(10);
  });

  it("should generate logs with required fields", () => {
    const logs = generateMockLogs(5);
    for (const log of logs) {
      expect(log.id).toBeDefined();
      expect(log.timestamp).toBeGreaterThan(0);
      expect(log.provider).toBeDefined();
      expect(log.model).toBeDefined();
      expect(log.method).toBe("POST");
      expect(log.url).toBeTruthy();
      expect(log.agentName).toBeTruthy();
      expect(["completed", "error"]).toContain(log.status);
    }
  });

  it("should sort logs by timestamp (newest first)", () => {
    const logs = generateMockLogs(20);
    for (let i = 1; i < logs.length; i++) {
      expect(logs[i - 1].timestamp).toBeGreaterThanOrEqual(logs[i].timestamp);
    }
  });

  it("should include valid providers", () => {
    const logs = generateMockLogs(50);
    const providers = new Set(logs.map((l) => l.provider));
    for (const p of providers) {
      expect(["openai", "anthropic", "google", "custom"]).toContain(p);
    }
  });

  it("should calculate costs for completed logs", () => {
    const logs = generateMockLogs(50);
    const completed = logs.filter((l) => l.status === "completed");
    for (const log of completed) {
      expect(log.estimatedCost).toBeGreaterThan(0);
      expect(log.inputTokens).toBeGreaterThan(0);
      expect(log.outputTokens).toBeGreaterThan(0);
    }
  });

  it("should default to 50 logs", () => {
    const logs = generateMockLogs();
    expect(logs).toHaveLength(50);
  });
});
