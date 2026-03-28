import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * @description 生成图表的 API 端点，接收自然语言描述并返回 Mermaid/PlantUML 代码
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
          content: SYSTEM_PROMPT,
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
    console.error('生成图表失败:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : '生成失败，请重试',
      },
      { status: 500 }
    );
  }
}

const SYSTEM_PROMPT = `你是一个专业的图表生成助手。根据用户提供的文本描述，分析内容并生成相应的图表代码。

你需要返回严格的 JSON 格式：
{
  "title": "图表标题",
  "chartType": "图表类型（flowchart/sequence/class/state/er/gantt/pie/mindmap/timeline/binary-protocol）",
  "mermaidCode": "Mermaid 格式的图表代码",
  "plantumlCode": "PlantUML 格式的图表代码"
}

图表类型说明：
- flowchart：流程图，使用 "flowchart TD" 或 "flowchart LR" 开头
- sequence：时序图，使用 "sequenceDiagram" 开头
- class：类图，使用 "classDiagram" 开头
- state：状态图，使用 "stateDiagram-v2" 开头
- er：ER图，使用 "erDiagram" 开头
- gantt：甘特图，使用 "gantt" 开头
- pie：饼图，使用 "pie" 开头
- mindmap：思维导图，使用 "mindmap" 开头
- timeline：时间线，使用 "timeline" 开头
- binary-protocol：数据格式/协议图，使用 block-beta 或 flowchart 实现

要求：
1. 根据文本内容智能推断最合适的图表类型
2. Mermaid 代码必须语法正确、可直接渲染
3. PlantUML 代码必须以 @startuml 开头、@enduml 结尾
4. 图表内容要完整反映用户描述的所有要素
5. 使用清晰的中文标签
6. 对于 binary-protocol 类型，使用 block-beta 或 flowchart 模拟字段布局`;

/**
 * @description 模拟响应（用于开发测试）
 */
function getMockResponse(text: string) {
  const lower = text.toLowerCase();

  if (
    lower.includes('流程') ||
    lower.includes('步骤') ||
    lower.includes('注册')
  ) {
    return {
      title: '用户注册流程',
      chartType: 'flowchart',
      mermaidCode: `flowchart TD
    A[开始] --> B[填写邮箱和密码]
    B --> C{邮箱格式正确?}
    C -->|是| D[发送验证码]
    C -->|否| E[提示重新输入]
    E --> B
    D --> F[输入验证码]
    F --> G{验证通过?}
    G -->|是| H[创建账户]
    G -->|否| I[提示验证码错误]
    I --> F
    H --> J[注册成功]`,
      plantumlCode: `@startuml
start
:填写邮箱和密码;
if (邮箱格式正确?) then (是)
  :发送验证码;
  :输入验证码;
  if (验证通过?) then (是)
    :创建账户;
    :注册成功;
  else (否)
    :提示验证码错误;
  endif
else (否)
  :提示重新输入;
endif
stop
@enduml`,
    };
  }

  if (
    lower.includes('时序') ||
    lower.includes('请求') ||
    lower.includes('交互') ||
    lower.includes('http')
  ) {
    return {
      title: 'HTTP 请求处理流程',
      chartType: 'sequence',
      mermaidCode: `sequenceDiagram
    participant B as 浏览器
    participant N as Nginx
    participant S as Node.js
    participant R as Redis
    participant D as MySQL

    B->>N: GET /api/data
    N->>S: 转发请求
    S->>R: 查询缓存
    alt 缓存命中
        R-->>S: 返回缓存数据
    else 缓存未命中
        S->>D: 查询数据库
        D-->>S: 返回查询结果
        S->>R: 写入缓存
    end
    S-->>N: 返回响应
    N-->>B: 返回数据`,
      plantumlCode: `@startuml
participant 浏览器 as B
participant Nginx as N
participant "Node.js" as S
participant Redis as R
participant MySQL as D

B -> N: GET /api/data
N -> S: 转发请求
S -> R: 查询缓存
alt 缓存命中
    R --> S: 返回缓存数据
else 缓存未命中
    S -> D: 查询数据库
    D --> S: 返回查询结果
    S -> R: 写入缓存
end
S --> N: 返回响应
N --> B: 返回数据
@enduml`,
    };
  }

  if (
    lower.includes('时间') ||
    lower.includes('历程') ||
    lower.includes('发展')
  ) {
    return {
      title: 'React 发展历程',
      chartType: 'timeline',
      mermaidCode: `timeline
    title React 发展历程
    2013 : Facebook 开源 React
    2015 : 发布 React Native
    2016 : 引入 Fiber 架构
    2019 : 推出 Hooks API
    2022 : 发布 React 18
         : 并发特性
    2024 : React Server Components`,
      plantumlCode: `@startuml
robust "React" as R
@2013
R is "开源发布"
@2015
R is "React Native"
@2016
R is "Fiber 架构"
@2019
R is "Hooks API"
@2022
R is "React 18"
@2024
R is "RSC"
@enduml`,
    };
  }

  if (
    lower.includes('类') ||
    lower.includes('class') ||
    lower.includes('继承')
  ) {
    return {
      title: '电商系统类图',
      chartType: 'class',
      mermaidCode: `classDiagram
    class User {
        +String name
        +String email
        +login()
        +register()
    }
    class Order {
        +String orderId
        +Float totalPrice
        +List~Product~ items
        +create()
        +cancel()
    }
    class Product {
        +String name
        +Float price
        +Int stock
    }
    User "1" --> "*" Order : 下单
    Order "*" --> "*" Product : 包含`,
      plantumlCode: `@startuml
class User {
    +name: String
    +email: String
    +login()
    +register()
}
class Order {
    +orderId: String
    +totalPrice: Float
    +items: List<Product>
    +create()
    +cancel()
}
class Product {
    +name: String
    +price: Float
    +stock: Int
}
User "1" --> "*" Order : 下单
Order "*" --> "*" Product : 包含
@enduml`,
    };
  }

  if (
    lower.includes('饼') ||
    lower.includes('占比') ||
    lower.includes('比例') ||
    lower.includes('pie')
  ) {
    return {
      title: '编程语言使用率',
      chartType: 'pie',
      mermaidCode: `pie title 2024年全球编程语言使用率
    "Python" : 28
    "JavaScript" : 22
    "Java" : 15
    "TypeScript" : 12
    "C++" : 8
    "Go" : 6
    "Rust" : 4
    "其他" : 5`,
      plantumlCode: `@startuml
@startjson
{
  "Python": 28,
  "JavaScript": 22,
  "Java": 15,
  "TypeScript": 12,
  "C++": 8,
  "Go": 6,
  "Rust": 4,
  "其他": 5
}
@endjson
@enduml`,
    };
  }

  if (
    lower.includes('甘特') ||
    lower.includes('gantt') ||
    lower.includes('项目计划') ||
    lower.includes('排期')
  ) {
    return {
      title: 'MVP 开发计划',
      chartType: 'gantt',
      mermaidCode: `gantt
    title MVP 开发计划
    dateFormat YYYY-MM-DD
    section 规划阶段
        需求分析       :a1, 2024-01-01, 14d
        UI 设计        :a2, after a1, 7d
    section 开发阶段
        前端开发       :b1, after a2, 21d
        后端开发       :b2, after a2, 21d
    section 发布阶段
        测试           :c1, after b1, 7d
        部署上线       :c2, after c1, 3d`,
      plantumlCode: `@startgantt
project starts 2024-01-01
[需求分析] lasts 14 days
[UI 设计] starts at [需求分析]'s end and lasts 7 days
[前端开发] starts at [UI 设计]'s end and lasts 21 days
[后端开发] starts at [UI 设计]'s end and lasts 21 days
[测试] starts at [前端开发]'s end and lasts 7 days
[部署上线] starts at [测试]'s end and lasts 3 days
@endgantt`,
    };
  }

  if (
    lower.includes('思维') ||
    lower.includes('mindmap') ||
    lower.includes('脑图')
  ) {
    return {
      title: 'Web 开发技术栈',
      chartType: 'mindmap',
      mermaidCode: `mindmap
  root((Web 开发))
    前端
      框架
        React
        Vue
        Angular
      样式
        Tailwind CSS
        CSS Modules
      构建工具
        Vite
        Webpack
    后端
      运行时
        Node.js
        Deno
      框架
        Express
        Fastify
      数据库
        PostgreSQL
        MongoDB
        Redis
    DevOps
      容器
        Docker
      CI/CD
        GitHub Actions
      云服务
        AWS
        Vercel`,
      plantumlCode: `@startmindmap
* Web 开发
** 前端
*** 框架
**** React
**** Vue
**** Angular
*** 样式
**** Tailwind CSS
**** CSS Modules
*** 构建工具
**** Vite
**** Webpack
** 后端
*** 运行时
**** Node.js
**** Deno
*** 框架
**** Express
**** Fastify
*** 数据库
**** PostgreSQL
**** MongoDB
**** Redis
** DevOps
*** 容器
**** Docker
*** CI/CD
**** GitHub Actions
*** 云服务
**** AWS
**** Vercel
@endmindmap`,
    };
  }

  if (
    lower.includes('状态') ||
    lower.includes('state') ||
    lower.includes('转换')
  ) {
    return {
      title: '订单状态流转',
      chartType: 'state',
      mermaidCode: `stateDiagram-v2
    [*] --> 待支付
    待支付 --> 已支付 : 支付成功
    待支付 --> 已取消 : 取消订单
    已支付 --> 已发货 : 商家确认
    已发货 --> 已完成 : 确认收货
    已发货 --> 退货中 : 申请退货
    退货中 --> 已退款 : 审核通过
    已完成 --> [*]
    已取消 --> [*]
    已退款 --> [*]`,
      plantumlCode: `@startuml
[*] --> 待支付
待支付 --> 已支付 : 支付成功
待支付 --> 已取消 : 取消订单
已支付 --> 已发货 : 商家确认
已发货 --> 已完成 : 确认收货
已发货 --> 退货中 : 申请退货
退货中 --> 已退款 : 审核通过
已完成 --> [*]
已取消 --> [*]
已退款 --> [*]
@enduml`,
    };
  }

  if (
    lower.includes('协议') ||
    lower.includes('protocol') ||
    lower.includes('数据格式') ||
    lower.includes('二进制') ||
    lower.includes('tcp')
  ) {
    return {
      title: 'TCP 报文头格式',
      chartType: 'binary-protocol',
      mermaidCode: `block-beta
  columns 4
  block:row1:4
    columns 4
    a["源端口号 (16位)"] b["目的端口号 (16位)"]
  end
  block:row2:4
    columns 1
    c["序列号 (32位)"]
  end
  block:row3:4
    columns 1
    d["确认号 (32位)"]
  end
  block:row4:4
    columns 8
    e["偏移(4)"] f["保留(6)"] g["URG"] h["ACK"] i["PSH"] j["RST"] k["SYN"] l["FIN"]
  end
  block:row5:4
    columns 2
    m["窗口大小 (16位)"]
    n["校验和 (16位)"]
  end`,
      plantumlCode: `@startuml
map "TCP 报文头" as tcp {
  0-15 => 源端口号 (16位)
  16-31 => 目的端口号 (16位)
  32-63 => 序列号 (32位)
  64-95 => 确认号 (32位)
  96-99 => 数据偏移 (4位)
  100-105 => 保留 (6位)
  106-111 => 标志位 (URG/ACK/PSH/RST/SYN/FIN)
  112-127 => 窗口大小 (16位)
  128-143 => 校验和 (16位)
  144-159 => 紧急指针 (16位)
}
@enduml`,
    };
  }

  if (
    lower.includes('er') ||
    lower.includes('实体') ||
    lower.includes('数据库') ||
    lower.includes('关系')
  ) {
    return {
      title: '博客系统数据库设计',
      chartType: 'er',
      mermaidCode: `erDiagram
    USER {
        int id PK
        string username
        string email
        datetime created_at
    }
    POST {
        int id PK
        string title
        text content
        datetime created_at
        int author_id FK
    }
    COMMENT {
        int id PK
        text content
        datetime created_at
        int post_id FK
        int author_id FK
    }
    USER ||--o{ POST : "写了"
    USER ||--o{ COMMENT : "发表了"
    POST ||--o{ COMMENT : "收到了"`,
      plantumlCode: `@startuml
entity User {
  * id : int <<PK>>
  --
  username : string
  email : string
  created_at : datetime
}
entity Post {
  * id : int <<PK>>
  --
  title : string
  content : text
  created_at : datetime
  * author_id : int <<FK>>
}
entity Comment {
  * id : int <<PK>>
  --
  content : text
  created_at : datetime
  * post_id : int <<FK>>
  * author_id : int <<FK>>
}
User ||--o{ Post
User ||--o{ Comment
Post ||--o{ Comment
@enduml`,
    };
  }

  return {
    title: '项目开发流程',
    chartType: 'flowchart',
    mermaidCode: `flowchart TD
    A[需求分析] --> B[系统设计]
    B --> C[技术选型]
    C --> D[前端开发]
    C --> E[后端开发]
    D --> F[联调测试]
    E --> F
    F --> G{测试通过?}
    G -->|是| H[部署上线]
    G -->|否| I[修复 Bug]
    I --> F
    H --> J[运维监控]`,
    plantumlCode: `@startuml
start
:需求分析;
:系统设计;
:技术选型;
fork
  :前端开发;
fork again
  :后端开发;
end fork
:联调测试;
if (测试通过?) then (是)
  :部署上线;
  :运维监控;
else (否)
  :修复 Bug;
endif
stop
@enduml`,
  };
}
