import type { FollowUpTemplate } from "@/types";
import { generateId } from "./utils";

/**
 * @description 预定义的跟进模板库
 * @returns {FollowUpTemplate[]} 默认模板列表
 */
export function getDefaultTemplates(): FollowUpTemplate[] {
  return [
    {
      id: generateId(),
      name: "Quote Follow-up (3 days)",
      channel: "email",
      subject: "Following up on your quote — {{quoteNumber}}",
      body: [
        "Hi {{clientName}},",
        "",
        "I hope this message finds you well! I wanted to follow up on the quote ({{quoteNumber}}) I sent over {{daysSince}} days ago for {{serviceDescription}}.",
        "",
        "I'd love to answer any questions you might have or discuss any adjustments to make it work better for your needs.",
        "",
        "Looking forward to hearing from you!",
        "",
        "Best regards,",
        "{{businessName}}",
      ].join("\n"),
      daysAfterQuote: 3,
    },
    {
      id: generateId(),
      name: "Gentle Reminder (7 days)",
      channel: "email",
      subject: "Quick reminder: Quote {{quoteNumber}} awaiting your review",
      body: [
        "Hi {{clientName}},",
        "",
        "Just a gentle reminder about the quote I sent for {{serviceDescription}}. The quote ({{quoteNumber}}) is valid until {{validUntil}}.",
        "",
        "If you'd like to proceed or have any questions, I'm here to help. I can also adjust the scope or pricing if needed.",
        "",
        "Best regards,",
        "{{businessName}}",
      ].join("\n"),
      daysAfterQuote: 7,
    },
    {
      id: generateId(),
      name: "Last Chance (14 days)",
      channel: "email",
      subject: "Your quote {{quoteNumber}} expires soon",
      body: [
        "Hi {{clientName}},",
        "",
        "I wanted to let you know that your quote ({{quoteNumber}}) for {{serviceDescription}} will be expiring soon.",
        "",
        "If you're still interested, I'd be happy to extend the validity or discuss any modifications. Otherwise, feel free to reach out anytime in the future — I'll always be glad to help.",
        "",
        "Best regards,",
        "{{businessName}}",
      ].join("\n"),
      daysAfterQuote: 14,
    },
    {
      id: generateId(),
      name: "Payment Reminder",
      channel: "email",
      subject: "Payment reminder for {{quoteNumber}}",
      body: [
        "Hi {{clientName}},",
        "",
        "This is a friendly reminder that payment for {{quoteNumber}} ({{totalAmount}}) is due on {{dueDate}}.",
        "",
        "If you've already sent the payment, please disregard this message. Otherwise, please let me know if you need any assistance.",
        "",
        "Thank you for your business!",
        "",
        "Best regards,",
        "{{businessName}}",
      ].join("\n"),
      daysAfterQuote: 0,
    },
    {
      id: generateId(),
      name: "Quick SMS Follow-up",
      channel: "sms",
      subject: "",
      body: "Hi {{clientName}}, just following up on the quote I sent for {{serviceDescription}}. Let me know if you have any questions! — {{businessName}}",
      daysAfterQuote: 3,
    },
    {
      id: generateId(),
      name: "SMS Payment Reminder",
      channel: "sms",
      subject: "",
      body: "Hi {{clientName}}, friendly reminder: payment of {{totalAmount}} for {{quoteNumber}} is due {{dueDate}}. Please reach out if you need anything! — {{businessName}}",
      daysAfterQuote: 0,
    },
  ];
}

/**
 * @description 填充模板中的变量占位符
 * @param {string} template - 模板文本
 * @param {Record<string, string>} variables - 变量键值对
 * @returns {string} 替换变量后的文本
 */
export function fillTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}
