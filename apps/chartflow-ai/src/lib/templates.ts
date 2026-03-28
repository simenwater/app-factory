import type { ChartTemplate } from '@/types';

/**
 * @description 预置的图表模板列表
 */
export const chartTemplates: ChartTemplate[] = [
  {
    id: 'flowchart',
    name: '流程图',
    description: '描述业务流程、算法步骤或决策树',
    chartType: 'flowchart',
    examplePrompt: '用户注册流程：首先填写邮箱和密码，然后验证邮箱格式，如果格式正确则发送验证码，用户输入验证码，验证通过后创建账户，否则提示重新输入。',
    icon: '🔀',
  },
  {
    id: 'sequence',
    name: '时序图',
    description: '展示系统间的交互和消息传递',
    chartType: 'sequence',
    examplePrompt: 'HTTP 请求处理流程：浏览器发送 GET 请求到 Nginx，Nginx 转发到 Node.js 服务，Node.js 查询 Redis 缓存，如果缓存命中则直接返回，否则查询 MySQL 数据库，将结果写入 Redis 并返回给浏览器。',
    icon: '↔️',
  },
  {
    id: 'timeline',
    name: '时间线',
    description: '按时间顺序展示事件发展',
    chartType: 'timeline',
    examplePrompt: 'React 发展历程：2013年Facebook开源React，2015年发布React Native，2016年引入Fiber架构，2019年推出Hooks，2022年发布React 18并发特性，2024年推出React Server Components。',
    icon: '📅',
  },
  {
    id: 'class',
    name: '类图',
    description: '展示类的结构和关系',
    chartType: 'class',
    examplePrompt: '电商系统类图：User 类包含 name、email 属性和 login()、register() 方法。Order 类包含 orderId、totalPrice 和 items 数组，有 create()、cancel() 方法。Product 类包含 name、price、stock 属性。User 可以有多个 Order，每个 Order 包含多个 Product。',
    icon: '🏗️',
  },
  {
    id: 'er',
    name: 'ER 图',
    description: '数据库实体关系图',
    chartType: 'er',
    examplePrompt: '博客系统数据库设计：User 表有 id、username、email 字段。Post 表有 id、title、content、created_at 字段。Comment 表有 id、content、created_at 字段。一个 User 可以写多篇 Post，一篇 Post 可以有多条 Comment，一个 User 可以发多条 Comment。',
    icon: '🗄️',
  },
  {
    id: 'gantt',
    name: '甘特图',
    description: '项目计划和排期管理',
    chartType: 'gantt',
    examplePrompt: 'MVP 开发计划：需求分析从1月1日开始持续2周，UI设计从1月15日开始持续1周，前端开发从1月22日开始持续3周，后端开发同时从1月22日开始持续3周，测试从2月12日开始持续1周，部署上线从2月19日开始持续3天。',
    icon: '📊',
  },
  {
    id: 'pie',
    name: '饼图',
    description: '展示数据占比分布',
    chartType: 'pie',
    examplePrompt: '2024年全球编程语言使用率：Python 占 28%，JavaScript 占 22%，Java 占 15%，TypeScript 占 12%，C++ 占 8%，Go 占 6%，Rust 占 4%，其他占 5%。',
    icon: '🥧',
  },
  {
    id: 'mindmap',
    name: '思维导图',
    description: '层级化展示知识结构',
    chartType: 'mindmap',
    examplePrompt: 'Web 开发技术栈思维导图：前端分为框架（React、Vue、Angular）、样式（Tailwind、CSS Modules）、构建（Vite、Webpack）；后端分为运行时（Node.js、Deno）、框架（Express、Fastify）、数据库（PostgreSQL、MongoDB、Redis）；DevOps 分为容器（Docker）、CI/CD（GitHub Actions）、云服务（AWS、Vercel）。',
    icon: '🧠',
  },
  {
    id: 'state',
    name: '状态图',
    description: '展示状态机和状态转换',
    chartType: 'state',
    examplePrompt: '订单状态流转：初始状态为"待支付"，支付成功后变为"已支付"，商家确认后变为"已发货"，用户确认收货后变为"已完成"。在"待支付"状态下可以取消订单变为"已取消"。"已发货"状态可以申请退货变为"退货中"，审核通过变为"已退款"。',
    icon: '🔄',
  },
  {
    id: 'binary-protocol',
    name: '协议/数据格式',
    description: '展示二进制协议或数据结构',
    chartType: 'binary-protocol',
    examplePrompt: 'TCP 报文头格式：源端口号(16位)、目的端口号(16位)、序列号(32位)、确认号(32位)、数据偏移(4位)、保留(6位)、URG/ACK/PSH/RST/SYN/FIN标志位(各1位)、窗口大小(16位)、校验和(16位)、紧急指针(16位)。',
    icon: '📦',
  },
];
