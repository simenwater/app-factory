/**
 * @fileoverview Payment Reminder API - 发送付款提醒邮件
 */

import { NextRequest, NextResponse } from "next/server";
import { generateReminderEmail } from "@/lib/email";

/**
 * POST /api/reminder - 发送付款提醒邮件
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      recipientEmail,
      recipientName,
      senderName,
      invoiceNumber,
      amount,
      currency,
      dueDate,
      type = "initial",
    } = body;

    if (!recipientEmail || !invoiceNumber) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const { subject, html } = generateReminderEmail({
      recipientName: recipientName || "Client",
      senderName: senderName || "InvoiceFlow User",
      invoiceNumber,
      amount: amount || 0,
      currency: currency || "USD",
      dueDate: dueDate || "N/A",
      type,
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"InvoiceFlow AI" <${smtpUser}>`,
        to: recipientEmail,
        subject,
        html,
      });

      return NextResponse.json({
        success: true,
        message: "邮件发送成功",
        sentAt: new Date().toISOString(),
      });
    }

    // 无 SMTP 配置时模拟发送
    console.log(`[Mock Email] To: ${recipientEmail}, Subject: ${subject}`);
    return NextResponse.json({
      success: true,
      message: "邮件已模拟发送（未配置 SMTP）",
      sentAt: new Date().toISOString(),
      mock: true,
    });
  } catch (error) {
    console.error("Reminder send error:", error);
    return NextResponse.json(
      { error: "邮件发送失败" },
      { status: 500 }
    );
  }
}
