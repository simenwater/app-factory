import { NextRequest, NextResponse } from "next/server";

/**
 * @description AI 总结 API
 * MVP 阶段使用 OpenAI GPT API 进行文本分析
 * 如果没有配置 API Key，使用基于规则的本地提取
 */
export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "转录文本不能为空" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `你是一个专业的语音笔记整理助手。分析用户的语音转录文本，输出结构化的 JSON 结果。

请严格按照以下 JSON 格式输出：
{
  "title": "简短的笔记标题（10字以内）",
  "summary": "2-3句话的摘要",
  "keyPoints": ["关键要点1", "关键要点2", ...],
  "actionItems": ["行动项1", "行动项2", ...]
}

注意：
- 如果没有明确的行动项，actionItems 可以为空数组
- keyPoints 提取3-5个最重要的要点
- summary 要简洁概括核心内容`,
              },
              {
                role: "user",
                content: transcript,
              },
            ],
            temperature: 0.3,
            response_format: { type: "json_object" },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenAI API error: ${err}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return NextResponse.json({
        title: result.title || "",
        summary: result.summary || "",
        keyPoints: result.keyPoints || [],
        actionItems: result.actionItems || [],
      });
    }

    /* 无 API Key 时使用本地规则提取 */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = localSummarize(transcript);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: "总结过程中发生错误" },
      { status: 500 }
    );
  }
}

/**
 * @description 基于规则的本地文本分析（fallback）
 */
function localSummarize(transcript: string): {
  title: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
} {
  const sentences = transcript
    .split(/[。！？.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const title = sentences[0]
    ? sentences[0].slice(0, 15) + (sentences[0].length > 15 ? "..." : "")
    : "语音笔记";

  const summary =
    sentences.length > 2
      ? sentences.slice(0, 2).join("。") + "。"
      : transcript.slice(0, 200);

  const keyPoints: string[] = [];
  const actionItems: string[] = [];

  const keyPhrases = [
    "决定", "计划", "重要", "关键", "核心", "主要",
    "需要", "建议", "问题", "解决", "目标", "方案",
  ];
  const actionPhrases = [
    "需要", "负责", "完成", "准备", "安排", "联系",
    "发送", "更新", "确认", "待办", "行动", "提交",
  ];

  sentences.forEach((sentence) => {
    if (
      keyPhrases.some((p) => sentence.includes(p)) &&
      keyPoints.length < 5
    ) {
      keyPoints.push(sentence);
    }
    if (
      actionPhrases.some((p) => sentence.includes(p)) &&
      actionItems.length < 5
    ) {
      actionItems.push(sentence);
    }
  });

  if (keyPoints.length === 0 && sentences.length > 0) {
    keyPoints.push(...sentences.slice(0, Math.min(3, sentences.length)));
  }

  return { title, summary, keyPoints, actionItems };
}
