/**
 * @fileoverview 付费报价单生成器
 */

import { Quote, QuoteItem } from "@/types";

/**
 * 计算单个报价项的小计
 * @param item - 报价项
 * @returns 小计金额
 */
export function calculateItemSubtotal(item: QuoteItem): number {
  return item.unitPrice * item.quantity;
}

/**
 * 计算报价单总金额
 * @param items - 报价项列表
 * @returns 总金额
 */
export function calculateTotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
}

/**
 * 格式化货币金额
 * @param amount - 金额
 * @param currency - 货币代码
 * @returns 格式化后的金额字符串
 */
export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CNY: "¥",
    JPY: "¥",
  };
  const symbol = symbols[currency] || currency + " ";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * 生成报价单文本
 * @param quote - 报价单数据
 * @returns 格式化的报价单文本
 */
export function generateQuoteText(quote: Quote): string {
  const total = calculateTotal(quote.items);
  const today = new Date();
  const validUntil = new Date(today.getTime() + quote.validDays * 24 * 60 * 60 * 1000);

  const lines: string[] = [
    "═══════════════════════════════════════",
    "           PROFESSIONAL QUOTE          ",
    "═══════════════════════════════════════",
    "",
    `Date: ${today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    `Valid Until: ${validUntil.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    "",
    `Client: ${quote.clientName || "[Client Name]"}`,
    `Project: ${quote.projectName || "[Project Name]"}`,
    "",
    "───────────────────────────────────────",
    "SERVICES",
    "───────────────────────────────────────",
    "",
  ];

  for (const item of quote.items) {
    const subtotal = calculateItemSubtotal(item);
    lines.push(`• ${item.description}`);
    lines.push(`  ${item.quantity} ${item.unit} × ${formatCurrency(item.unitPrice, quote.currency)} = ${formatCurrency(subtotal, quote.currency)}`);
    lines.push("");
  }

  lines.push("───────────────────────────────────────");
  lines.push(`TOTAL: ${formatCurrency(total, quote.currency)}`);
  lines.push("───────────────────────────────────────");

  if (quote.notes) {
    lines.push("");
    lines.push("NOTES:");
    lines.push(quote.notes);
  }

  lines.push("");
  lines.push("TERMS:");
  lines.push("• 50% deposit required to begin work");
  lines.push("• Remaining 50% due upon completion");
  lines.push("• Revisions beyond agreed scope billed hourly");
  lines.push(`• Quote valid for ${quote.validDays} days`);
  lines.push("");
  lines.push("═══════════════════════════════════════");

  return lines.join("\n");
}

/**
 * 创建默认报价项
 * @returns 新的报价项
 */
export function createDefaultQuoteItem(): QuoteItem {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    description: "",
    unitPrice: 0,
    quantity: 1,
    unit: "hours",
  };
}

/**
 * 预设服务模板
 */
export const SERVICE_PRESETS: { label: string; items: Omit<QuoteItem, "id">[] }[] = [
  {
    label: "Web Design",
    items: [
      { description: "UI/UX Design", unitPrice: 100, quantity: 8, unit: "hours" },
      { description: "Responsive Development", unitPrice: 120, quantity: 16, unit: "hours" },
      { description: "Testing & QA", unitPrice: 80, quantity: 4, unit: "hours" },
    ],
  },
  {
    label: "Logo Design",
    items: [
      { description: "Brand Research & Concepts", unitPrice: 150, quantity: 4, unit: "hours" },
      { description: "Logo Design (3 concepts)", unitPrice: 500, quantity: 1, unit: "project" },
      { description: "Revisions (up to 3 rounds)", unitPrice: 100, quantity: 3, unit: "rounds" },
    ],
  },
  {
    label: "Content Writing",
    items: [
      { description: "Research & Outline", unitPrice: 75, quantity: 2, unit: "hours" },
      { description: "Content Writing", unitPrice: 0.15, quantity: 2000, unit: "words" },
      { description: "Editing & Proofreading", unitPrice: 50, quantity: 1, unit: "round" },
    ],
  },
  {
    label: "Consulting",
    items: [
      { description: "Strategy Consultation", unitPrice: 200, quantity: 2, unit: "hours" },
      { description: "Implementation Guidance", unitPrice: 150, quantity: 4, unit: "hours" },
      { description: "Follow-up Support", unitPrice: 100, quantity: 2, unit: "hours" },
    ],
  },
];
