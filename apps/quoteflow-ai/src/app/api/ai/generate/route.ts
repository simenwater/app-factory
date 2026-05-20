import { NextRequest, NextResponse } from "next/server";

/**
 * @description AI 报价生成 API 端点
 * 当配置了 OPENAI_API_KEY 时使用 OpenAI，否则回退到本地规则引擎
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceDescription, clientName, taxRate } = body;

    if (!serviceDescription) {
      return NextResponse.json(
        { error: "Service description is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey !== "sk-xxx") {
      const prompt = `You are a professional service pricing assistant. Based on the following service description, generate a detailed quote breakdown with line items.

Service: ${serviceDescription}
Client: ${clientName || "Client"}

Respond in JSON format:
{
  "items": [
    { "description": "...", "quantity": 1, "unitPrice": 0 }
  ],
  "notes": "Professional note to the client"
}

Be realistic with pricing based on current market rates for freelance/agency work.`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return NextResponse.json(parsed);
          }
        }
      } catch {
        // Fall through to local generation
      }
    }

    const { generateAIQuote } = await import("@/lib/ai");
    const result = generateAIQuote(serviceDescription, clientName || "Client", taxRate || 0);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
