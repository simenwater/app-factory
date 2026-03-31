import { NextRequest, NextResponse } from "next/server";

/**
 * @description 音频转录 API
 * MVP 阶段使用 OpenAI Whisper API 进行语音转文字
 * 如果没有配置 API Key，使用模拟数据
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "未找到音频文件" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const whisperFormData = new FormData();
      whisperFormData.append("file", audioFile);
      whisperFormData.append("model", "whisper-1");
      whisperFormData.append("response_format", "text");

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: whisperFormData,
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Whisper API error: ${err}`);
      }

      const transcript = await response.text();
      return NextResponse.json({ transcript });
    }

    /* 模拟转录结果用于演示 */
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const demoTranscripts = [
      "今天的会议主要讨论了三个议题。第一个是关于产品的下一个版本发布计划，我们决定在下个月15号之前完成所有核心功能的开发。第二个议题是关于用户反馈的处理，团队需要在本周内完成对高优先级问题的修复。第三个是关于新功能的头脑风暴，大家提出了语音转文字、AI 摘要、多格式导出等想法。行动项包括：张三负责完成前端界面设计，李四负责后端 API 开发，王五需要准备下周的客户演示。",
      "这是一条语音备忘录。我刚刚想到了几个关于项目优化的想法。首先，我们应该考虑增加缓存机制来提升性能，目前页面加载速度还需要改进。其次，用户体验方面，需要重新设计导航流程，让用户可以更快地找到需要的功能。最后，关于变现策略，可以考虑引入免费增值模式，基础功能免费，高级功能付费。这周需要做的事情：完成原型设计、联系潜在用户做访谈、准备投资人演示文档。",
      "下午和客户进行了一次电话会议。客户对我们的产品整体满意，但提出了几个改进建议。他们希望我们能添加多语言支持，特别是英文和日文。另外，数据导出功能需要支持更多格式，比如 PDF 和 Excel。客户还提到他们计划在下个季度增加预算，可能会购买更多的企业版许可。关键决策：同意将多语言支持作为下一版本的重点功能。待办：发送会议纪要给客户确认，更新产品路线图，安排下次技术评审。",
    ];

    const transcript =
      demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)];

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "转录过程中发生错误" },
      { status: 500 }
    );
  }
}
