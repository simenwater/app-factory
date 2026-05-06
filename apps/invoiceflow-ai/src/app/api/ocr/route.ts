/**
 * @fileoverview OCR API Route - 处理图片文字识别和 AI 结构化解析
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ocr - 使用 Tesseract.js 进行图片文字识别
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "未提供图片文件" },
        { status: 400 }
      );
    }

    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng+chi_sim");
    
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    return NextResponse.json({
      text: data.text,
      confidence: data.confidence / 100,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json(
      { error: "OCR 识别失败，请重试" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ocr - 使用 AI 从 OCR 文本中提取结构化信息
 */
export async function PUT(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "未提供文本内容" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return fallbackParse(text);
    }

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a receipt/invoice parser. Extract structured data from the text and return JSON with these fields:
            - vendorName: string (merchant/vendor name)
            - amount: number (total amount)
            - currency: string (3-letter code, default "USD")
            - date: string (ISO format)
            - items: array of { description, quantity, unitPrice, total }
            - confidence: number (0-1, your confidence in the extraction)
            Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return NextResponse.json({
      vendorName: parsed.vendorName || "Unknown",
      amount: parsed.amount || 0,
      currency: parsed.currency || "USD",
      date: parsed.date || new Date().toISOString().split("T")[0],
      items: parsed.items || [],
      rawText: text,
      confidence: parsed.confidence || 0.7,
    });
  } catch (error) {
    console.error("AI Parse Error:", error);
    return NextResponse.json(
      { error: "AI 解析失败" },
      { status: 500 }
    );
  }
}

/**
 * 当无 API Key 时的回退解析逻辑
 */
function fallbackParse(text: string) {
  const amountMatch = text.match(/\$?([\d,]+\.?\d*)/);
  const dateMatch = text.match(/(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})/);

  const amount = amountMatch ? parseFloat(amountMatch[1].replace(",", "")) : 0;
  const lines = text.split("\n").filter((l) => l.trim());

  return NextResponse.json({
    vendorName: lines[0] || "Unknown Vendor",
    amount,
    currency: "USD",
    date: dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0],
    items: [
      {
        description: "Extracted item",
        quantity: 1,
        unitPrice: amount,
        total: amount,
      },
    ],
    rawText: text,
    confidence: 0.5,
  });
}
