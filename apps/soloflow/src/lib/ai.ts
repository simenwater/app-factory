/**
 * @description AI 辅助功能模块 — 用于生成报价单和发票内容
 * MVP 阶段使用模板引擎，后续可接入 OpenAI/Claude API
 */

import type { Client, Project, QuoteLineItem } from "@/types";

/**
 * @description 根据项目描述生成建议的报价行项
 * @param {Project} project - 项目信息
 * @returns {QuoteLineItem[]} 建议的行项列表
 */
export function generateQuoteItems(project: Project): QuoteLineItem[] {
  const items: QuoteLineItem[] = [];
  const desc = project.description.toLowerCase();

  if (desc.includes("design") || desc.includes("设计")) {
    items.push({
      id: crypto.randomUUID(),
      description: "UI/UX 设计",
      quantity: 1,
      unitPrice: project.budget * 0.3,
    });
  }

  if (desc.includes("develop") || desc.includes("开发") || desc.includes("code")) {
    items.push({
      id: crypto.randomUUID(),
      description: "开发实现",
      quantity: 1,
      unitPrice: project.budget * 0.5,
    });
  }

  if (desc.includes("test") || desc.includes("测试") || desc.includes("qa")) {
    items.push({
      id: crypto.randomUUID(),
      description: "测试与质量保证",
      quantity: 1,
      unitPrice: project.budget * 0.1,
    });
  }

  if (items.length === 0) {
    items.push({
      id: crypto.randomUUID(),
      description: project.name,
      quantity: 1,
      unitPrice: project.budget,
    });
  }

  const remaining = project.budget - items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  if (remaining > 0) {
    items.push({
      id: crypto.randomUUID(),
      description: "项目管理与沟通",
      quantity: 1,
      unitPrice: Math.round(remaining * 100) / 100,
    });
  }

  return items;
}

/**
 * @description 生成客户跟进邮件草稿
 * @param {Client} client - 客户信息
 * @param {Project} project - 项目信息
 * @param {"follow_up" | "quote_sent" | "invoice_reminder"} type - 邮件类型
 * @returns {string} 邮件草稿
 */
export function generateEmailDraft(
  client: Client,
  project: Project,
  type: "follow_up" | "quote_sent" | "invoice_reminder"
): string {
  const templates: Record<string, string> = {
    follow_up: `Hi ${client.name},

I wanted to follow up on our discussion about "${project.name}". I'd love to learn more about your requirements and see how I can help bring this project to life.

Would you be available for a quick call this week?

Best regards`,

    quote_sent: `Hi ${client.name},

Thank you for your interest in "${project.name}". I've prepared a detailed quote based on our discussion.

Please review the attached quote at your convenience. The quote is valid for 30 days.

Feel free to reach out if you have any questions.

Best regards`,

    invoice_reminder: `Hi ${client.name},

This is a friendly reminder that the invoice for "${project.name}" is due soon.

Please let me know if you have any questions about the payment.

Thank you for your business!

Best regards`,
  };

  return templates[type] || templates.follow_up;
}

/**
 * @description 基于历史数据生成项目预算建议
 * @param {string} projectType - 项目类型描述
 * @param {number} historicalAverage - 历史平均预算
 * @returns {{ min: number; recommended: number; max: number }} 预算建议范围
 */
export function suggestBudget(
  projectType: string,
  historicalAverage: number = 5000
): { min: number; recommended: number; max: number } {
  const multiplier = projectType.toLowerCase().includes("complex") ? 1.5 : 1;
  return {
    min: Math.round(historicalAverage * 0.7 * multiplier),
    recommended: Math.round(historicalAverage * multiplier),
    max: Math.round(historicalAverage * 1.5 * multiplier),
  };
}
