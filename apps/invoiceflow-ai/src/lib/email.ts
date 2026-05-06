/**
 * @fileoverview 邮件发送模块 - 付款提醒邮件功能
 */

import type { Invoice, ReminderRecord } from "@/types";

/**
 * 发送付款提醒邮件（客户端调用 API）
 * @param {Invoice} invoice - 发票数据
 * @param {"initial" | "followup" | "overdue"} type - 提醒类型
 * @returns {Promise<ReminderRecord>} 发送记录
 */
export async function sendPaymentReminder(
  invoice: Invoice,
  type: "initial" | "followup" | "overdue"
): Promise<ReminderRecord> {
  const response = await fetch("/api/reminder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invoiceId: invoice.id,
      recipientEmail: invoice.to.email,
      recipientName: invoice.to.name,
      senderName: invoice.from.name,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.total,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      type,
    }),
  });

  if (!response.ok) {
    return {
      sentAt: new Date().toISOString(),
      type,
      status: "failed",
    };
  }

  return {
    sentAt: new Date().toISOString(),
    type,
    status: "sent",
  };
}

/**
 * 生成付款提醒邮件内容
 * @param {object} params - 邮件参数
 * @returns {{ subject: string; html: string }}
 */
export function generateReminderEmail(params: {
  recipientName: string;
  senderName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  type: "initial" | "followup" | "overdue";
}): { subject: string; html: string } {
  const { recipientName, senderName, invoiceNumber, amount, currency, dueDate, type } = params;
  
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);

  const subjects: Record<string, string> = {
    initial: `Invoice ${invoiceNumber} from ${senderName}`,
    followup: `Reminder: Invoice ${invoiceNumber} - Payment Due`,
    overdue: `Overdue: Invoice ${invoiceNumber} - Immediate Payment Required`,
  };

  const greetings: Record<string, string> = {
    initial: `Thank you for your business! Please find the invoice details below.`,
    followup: `This is a friendly reminder that your payment is due soon.`,
    overdue: `This invoice is now overdue. Please arrange payment as soon as possible.`,
  };

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">InvoiceFlow AI</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #374151; font-size: 16px;">Hi ${recipientName},</p>
        <p style="color: #6b7280; font-size: 14px;">${greetings[type]}</p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #6b7280; padding: 8px 0;">Invoice #</td>
              <td style="color: #111827; font-weight: 600; text-align: right;">${invoiceNumber}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 8px 0;">Amount</td>
              <td style="color: #111827; font-weight: 600; text-align: right;">${formattedAmount}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 8px 0;">Due Date</td>
              <td style="color: ${type === 'overdue' ? '#ef4444' : '#111827'}; font-weight: 600; text-align: right;">${dueDate}</td>
            </tr>
          </table>
        </div>
        <p style="color: #6b7280; font-size: 14px;">From: ${senderName}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">Sent via InvoiceFlow AI</p>
      </div>
    </div>
  `;

  return { subject: subjects[type], html };
}

/**
 * 检查发票是否已逾期
 * @param {string} dueDate - 到期日期
 * @returns {boolean}
 */
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

/**
 * 计算距离到期还有几天
 * @param {string} dueDate - 到期日期
 * @returns {number} 天数（负数表示已逾期）
 */
export function daysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
