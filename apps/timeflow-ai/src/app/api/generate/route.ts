import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * 生成时间线的 API 端点
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的文本描述' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('未配置 OPENAI_API_KEY，使用模拟数据');
      return NextResponse.json(getMockResponse(text));
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的时间线生成助手。根据用户提供的文本描述，提取关键事件并生成结构化的时间线数据。

返回格式必须是 JSON：
{
  "title": "时间线标题",
  "events": [
    {
      "id": "唯一ID",
      "title": "事件标题",
      "date": "YYYY-MM-DD 格式的日期",
      "description": "可选的事件描述"
    }
  ]
}

要求：
1. 从文本中提取所有时间点和事件
2. 日期格式必须是 YYYY-MM-DD
3. 如果没有明确年份，使用合理推断
4. events 数组至少包含 2 个事件
5. 每个事件的 id 必须唯一`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('LLM 返回空响应');
    }

    const result = JSON.parse(content);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('生成时间线失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '生成失败，请重试' },
      { status: 500 }
    );
  }
}

/**
 * 模拟响应（用于开发测试）
 */
function getMockResponse(text: string) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('公司') || lowerText.includes('创业')) {
    return {
      title: '公司发展历程',
      events: [
        {
          id: '1',
          title: '公司成立',
          date: '2020-01-15',
          description: '在硅谷注册成立',
        },
        {
          id: '2',
          title: '获得天使轮融资',
          date: '2020-06-20',
          description: '完成100万美元融资',
        },
        {
          id: '3',
          title: '发布 MVP 产品',
          date: '2020-12-01',
          description: '首个最小可行产品上线',
        },
        {
          id: '4',
          title: 'A 轮融资',
          date: '2021-08-15',
          description: '获得500万美元 A 轮投资',
        },
        {
          id: '5',
          title: '用户突破10万',
          date: '2022-03-10',
          description: '注册用户达到里程碑',
        },
      ],
    };
  }

  return {
    title: '项目时间线',
    events: [
      {
        id: '1',
        title: '项目启动',
        date: '2024-01-01',
        description: '项目正式启动',
      },
      {
        id: '2',
        title: '需求分析完成',
        date: '2024-02-15',
        description: '完成需求调研和分析',
      },
      {
        id: '3',
        title: '原型设计',
        date: '2024-03-20',
        description: '完成产品原型设计',
      },
      {
        id: '4',
        title: '开发阶段',
        date: '2024-05-01',
        description: '进入开发实施阶段',
      },
      {
        id: '5',
        title: '上线发布',
        date: '2024-08-30',
        description: '产品正式上线',
      },
    ],
  };
}
