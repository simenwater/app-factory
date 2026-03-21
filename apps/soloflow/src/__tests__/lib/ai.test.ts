/**
 * @description AI 辅助功能单元测试
 */

import { generateQuoteItems, generateEmailDraft, suggestBudget } from "@/lib/ai";
import type { Client, Project } from "@/types";

const mockClient: Client = {
  id: "client-1",
  name: "测试客户",
  email: "test@example.com",
  phone: "13800138000",
  company: "测试公司",
  status: "active",
  notes: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const mockProject: Project = {
  id: "project-1",
  clientId: "client-1",
  name: "网站设计与开发",
  description: "为客户设计和开发一个全新的网站，包含测试",
  status: "inquiry",
  budget: 10000,
  deadline: "2026-06-01",
  tags: ["设计", "开发"],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("generateQuoteItems", () => {
  it("应根据项目描述生成包含设计、开发、测试的行项", () => {
    const items = generateQuoteItems(mockProject);
    expect(items.length).toBeGreaterThanOrEqual(3);

    const descriptions = items.map((i) => i.description);
    expect(descriptions).toContain("UI/UX 设计");
    expect(descriptions).toContain("开发实现");
    expect(descriptions).toContain("测试与质量保证");
  });

  it("未匹配关键词时应生成项目名称行项", () => {
    const simpleProject: Project = {
      ...mockProject,
      description: "一个简单的任务",
    };
    const items = generateQuoteItems(simpleProject);
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].description).toBe("网站设计与开发");
  });

  it("每个行项应有有效的价格", () => {
    const items = generateQuoteItems(mockProject);
    items.forEach((item) => {
      expect(item.unitPrice).toBeGreaterThanOrEqual(0);
      expect(item.quantity).toBeGreaterThanOrEqual(1);
      expect(item.id).toBeDefined();
    });
  });
});

describe("generateEmailDraft", () => {
  it("应生成跟进邮件", () => {
    const email = generateEmailDraft(mockClient, mockProject, "follow_up");
    expect(email).toContain(mockClient.name);
    expect(email).toContain(mockProject.name);
  });

  it("应生成报价发送邮件", () => {
    const email = generateEmailDraft(mockClient, mockProject, "quote_sent");
    expect(email).toContain("quote");
    expect(email).toContain(mockProject.name);
  });

  it("应生成发票提醒邮件", () => {
    const email = generateEmailDraft(mockClient, mockProject, "invoice_reminder");
    expect(email).toContain("invoice");
    expect(email).toContain(mockProject.name);
  });
});

describe("suggestBudget", () => {
  it("应返回预算建议范围", () => {
    const suggestion = suggestBudget("web development", 5000);
    expect(suggestion.min).toBeLessThan(suggestion.recommended);
    expect(suggestion.recommended).toBeLessThan(suggestion.max);
  });

  it("复杂项目应有更高的预算", () => {
    const simple = suggestBudget("simple task", 5000);
    const complex = suggestBudget("complex enterprise solution", 5000);
    expect(complex.recommended).toBeGreaterThan(simple.recommended);
  });
});
