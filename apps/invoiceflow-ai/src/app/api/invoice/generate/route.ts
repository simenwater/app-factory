/**
 * @fileoverview Invoice Generation API - 服务端发票生成端点
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/invoice/generate - 根据 OCR 结果或手动输入生成发票数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, items, taxRate = 0, currency = "USD", dueDate, notes } = body;

    if (!from || !to || !items || items.length === 0) {
      return NextResponse.json(
        { error: "缺少必填字段：发送方、接收方、项目列表" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    const invoice = {
      id: uuidv4(),
      invoiceNumber,
      from,
      to,
      items: items.map((item: { description: string; quantity: number; unitPrice: number }) => ({
        id: uuidv4(),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      taxRate,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency,
      status: "draft",
      createdAt: now.toISOString(),
      dueDate: dueDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: notes || "",
      reminders: [],
    };

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: "发票生成失败" },
      { status: 500 }
    );
  }
}
