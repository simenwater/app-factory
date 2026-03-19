import type { PolicyAlert, SubscriptionPlan } from "@/types";

/**
 * Mock 政策预警数据（MVP 阶段演示用）
 */
export const mockAlerts: PolicyAlert[] = [
  {
    id: "pa-001",
    title: "美国对华半导体出口管制再升级",
    summary:
      "美国商务部宣布将扩大对华半导体出口管制范围，新增14nm以下制程芯片设备限制，预计将影响全球半导体供应链格局。",
    riskLevel: "critical",
    affectedIndustries: ["tech", "manufacturing", "trade"],
    originalText:
      "The U.S. Department of Commerce announced expanded export controls on semiconductor technology to China, targeting advanced chip manufacturing equipment below 14nm process nodes. The new regulations will require additional licensing for exports of specific lithography, deposition, and etching tools. Companies with significant China revenue exposure may face compliance challenges. The rules take effect within 90 days, with limited exemptions for existing contracts.",
    aiInterpretation:
      "🔴 影响解读：\n\n1. **直接影响**：涉及半导体设备、芯片设计、电子制造等企业将面临供应链重组压力\n2. **间接影响**：依赖先进芯片的消费电子、汽车电子、AI硬件等领域可能遭遇供货延迟\n3. **时间窗口**：90天过渡期，企业需立即评估库存和替代供应商\n4. **应对建议**：\n   - 立即盘点受管制产品的库存水平\n   - 评估是否有国产替代方案\n   - 关注许可证豁免申请窗口\n   - 考虑调整采购策略，适当增加安全库存",
    source: "U.S. Federal Register",
    sourceUrl: "https://www.federalregister.gov",
    publishedAt: "2026-03-19T08:00:00Z",
    region: "美国",
    tags: ["半导体", "出口管制", "中美关系", "供应链"],
  },
  {
    id: "pa-002",
    title: "欧盟碳边境调节机制(CBAM)过渡期规则更新",
    summary:
      "欧盟委员会发布CBAM过渡期实施细则修订，扩大了需要申报碳排放的产品范围，新增有机化学品和塑料制品。",
    riskLevel: "high",
    affectedIndustries: ["manufacturing", "trade", "energy"],
    originalText:
      "The European Commission has published revised implementing rules for the Carbon Border Adjustment Mechanism (CBAM) transitional period. The updated scope now includes organic chemicals and plastics, in addition to the existing categories of cement, iron and steel, aluminum, fertilizers, electricity, and hydrogen. Importers must report embedded emissions using verified methodologies starting Q3 2026.",
    aiInterpretation:
      "🟠 影响解读：\n\n1. **扩围影响**：化工、塑料制品出口企业首次被纳入，需尽快建立碳足迹核算体系\n2. **合规成本**：企业需投入资源进行碳排放核算和第三方验证\n3. **竞争格局**：低碳产品将获得价格优势，高碳排放企业面临竞争劣势\n4. **应对建议**：\n   - 尽快启动产品碳足迹核算\n   - 了解EU认可的验证方法学\n   - 评估减碳投资的经济性\n   - 关注行业协会的应对指南",
    source: "European Commission",
    sourceUrl: "https://ec.europa.eu",
    publishedAt: "2026-03-19T06:30:00Z",
    region: "欧盟",
    tags: ["碳边境税", "CBAM", "碳排放", "绿色贸易"],
  },
  {
    id: "pa-003",
    title: "中国人民银行下调存款准备金率0.5个百分点",
    summary:
      "央行宣布全面降准0.5个百分点，释放长期资金约1万亿元，旨在支持实体经济发展和稳定市场预期。",
    riskLevel: "medium",
    affectedIndustries: ["finance", "real-estate", "manufacturing", "retail"],
    originalText:
      "中国人民银行决定于2026年3月25日下调金融机构存款准备金率0.5个百分点（不含已执行5%存款准备金率的金融机构）。本次下调后，金融机构加权平均存款准备金率约为6.6%。此次降准预计释放长期资金约1万亿元，有利于降低金融机构资金成本，引导贷款市场报价利率下行。",
    aiInterpretation:
      "🟡 影响解读：\n\n1. **资金面**：银行可贷资金增加，企业融资成本有望下降\n2. **房地产**：房贷利率可能进一步下调，对楼市形成支撑\n3. **制造业**：流动性改善有利于企业扩大生产和投资\n4. **应对建议**：\n   - 融资需求较大的企业可考虑适时申请贷款\n   - 关注后续LPR利率调整\n   - 评估是否有机会进行债务置换降低成本\n   - 保持对通胀风险的关注",
    source: "中国人民银行",
    sourceUrl: "http://www.pbc.gov.cn",
    publishedAt: "2026-03-18T14:00:00Z",
    region: "中国",
    tags: ["降准", "货币政策", "流动性", "利率"],
  },
  {
    id: "pa-004",
    title: "东盟十国签署数字经济框架协议",
    summary:
      "东盟成员国正式签署《东盟数字经济框架协议》，涵盖跨境数据流通、数字贸易便利化、电子支付互联互通等核心议题。",
    riskLevel: "medium",
    affectedIndustries: ["tech", "trade", "finance", "logistics"],
    originalText:
      "ASEAN member states have formally signed the ASEAN Digital Economy Framework Agreement (DEFA), establishing comprehensive rules for cross-border data flows, digital trade facilitation, electronic payments interoperability, and cybersecurity cooperation. The agreement includes provisions for mutual recognition of electronic signatures and digital identity, streamlined customs procedures for e-commerce, and a framework for AI governance. Implementation timeline spans 2026-2030.",
    aiInterpretation:
      "🟡 影响解读：\n\n1. **跨境电商**：数字贸易便利化将降低东盟跨境电商门槛\n2. **支付互联**：电子支付互通为金融科技企业带来新机会\n3. **数据合规**：跨境数据流通规则将影响在东盟运营的科技企业\n4. **应对建议**：\n   - 关注具体实施时间表和各国落地细则\n   - 评估跨境数据流通规则对业务的影响\n   - 把握东盟数字市场的先发机会\n   - 了解电子签名互认对合同管理的影响",
    source: "ASEAN Secretariat",
    sourceUrl: "https://asean.org",
    publishedAt: "2026-03-18T10:00:00Z",
    region: "东盟",
    tags: ["数字经济", "跨境贸易", "数据流通", "东盟"],
  },
  {
    id: "pa-005",
    title: "日本修订《外汇及外国贸易法》加强投资审查",
    summary:
      "日本国会通过《外汇法》修正案，扩大了需要事前申报的敏感技术领域，并将审查范围延伸至量子计算和先进材料。",
    riskLevel: "high",
    affectedIndustries: ["tech", "manufacturing", "trade"],
    originalText:
      "The Japanese Diet has passed amendments to the Foreign Exchange and Foreign Trade Act, expanding the scope of prior notification requirements for foreign investment in sensitive technology sectors. The revised law now includes quantum computing, advanced materials, and space technology in the designated sectors. Foreign investors acquiring 1% or more of listed companies in these sectors must submit prior notifications. The amendments also introduce enhanced monitoring of technology transfer through joint ventures and licensing arrangements.",
    aiInterpretation:
      "🟠 影响解读：\n\n1. **投资限制**：量子计算、先进材料等领域的对日投资将面临更严格审查\n2. **技术合作**：合资和技术授权也纳入监管，影响跨国技术合作模式\n3. **申报门槛**：1%的持股门槛非常低，将影响大量组合投资\n4. **应对建议**：\n   - 在日有投资的企业需重新评估合规状况\n   - 正在进行的技术合作项目应提前咨询法律意见\n   - 关注实施细则和过渡期安排\n   - 评估替代投资和合作模式",
    source: "日本経済産業省",
    sourceUrl: "https://www.meti.go.jp",
    publishedAt: "2026-03-17T09:00:00Z",
    region: "日本",
    tags: ["外资审查", "投资限制", "技术安全", "日本"],
  },
  {
    id: "pa-006",
    title: "WHO发布全球健康紧急采购新框架",
    summary:
      "世界卫生组织发布全新紧急医疗物资采购框架，重点推动区域化供应链建设和关键原料药的多元化采购。",
    riskLevel: "low",
    affectedIndustries: ["healthcare", "manufacturing", "logistics"],
    originalText:
      "The World Health Organization has released a new Emergency Health Procurement Framework aimed at diversifying global medical supply chains. The framework emphasizes regional manufacturing hubs, strategic stockpiling of essential medicines, and diversification of active pharmaceutical ingredient (API) sourcing. It includes recommendations for member states to incentivize domestic production of critical medical supplies and establish bilateral supply agreements.",
    aiInterpretation:
      "🟢 影响解读：\n\n1. **医药制造**：区域化生产趋势为本土医药企业带来发展机遇\n2. **原料药**：多元化采购将改变现有以中印为主的供应格局\n3. **物流仓储**：战略储备需求可能带动医疗物流基建\n4. **应对建议**：\n   - 医药企业关注本国政府的配套激励政策\n   - 评估参与区域供应链建设的商业机会\n   - 原料药企业需关注客户采购策略的变化\n   - 物流企业可布局医疗冷链和仓储能力",
    source: "World Health Organization",
    sourceUrl: "https://www.who.int",
    publishedAt: "2026-03-17T07:00:00Z",
    region: "全球",
    tags: ["医疗", "供应链", "WHO", "采购"],
  },
  {
    id: "pa-007",
    title: "印度提高电子产品进口关税至25%",
    summary:
      "印度财政部宣布将笔记本电脑、平板电脑和服务器的进口关税从15%提高至25%，旨在推动\"印度制造\"战略。",
    riskLevel: "high",
    affectedIndustries: ["tech", "trade", "manufacturing", "retail"],
    originalText:
      "India's Ministry of Finance has announced an increase in import duties on laptops, tablets, and servers from 15% to 25%, effective April 1, 2026. The measure is part of the government's broader 'Make in India' initiative to boost domestic electronics manufacturing. Companies importing these products will need to obtain special import licenses. The government has simultaneously announced production-linked incentive (PLI) scheme enhancements for domestic electronics manufacturing.",
    aiInterpretation:
      "🟠 影响解读：\n\n1. **直接影响**：对印度出口电子产品的企业成本将大幅上升\n2. **供应链转移**：推动更多企业在印度本地设厂\n3. **零售价格**：终端消费者可能面临10-15%的价格上涨\n4. **应对建议**：\n   - 评估在印度设立本地组装或制造产能的可行性\n   - 了解PLI补贴政策，计算本地化生产的经济性\n   - 对现有印度客户提前沟通价格调整\n   - 关注进口许可证的申请流程和时间表",
    source: "Ministry of Finance, India",
    sourceUrl: "https://www.finmin.nic.in",
    publishedAt: "2026-03-16T11:00:00Z",
    region: "印度",
    tags: ["关税", "印度制造", "电子产品", "贸易壁垒"],
  },
  {
    id: "pa-008",
    title: "澳大利亚出台《关键矿产战略2026》",
    summary:
      "澳大利亚政府发布新版关键矿产战略，计划投入50亿澳元支持稀土、锂等战略矿产的深加工产业链发展。",
    riskLevel: "low",
    affectedIndustries: ["energy", "manufacturing", "trade"],
    originalText:
      "The Australian Government has released its Critical Minerals Strategy 2026, committing AUD 5 billion in investment support for downstream processing of strategic minerals including rare earths, lithium, cobalt, and nickel. The strategy includes tax incentives for mineral processing facilities, streamlined environmental approvals for critical minerals projects, and bilateral supply agreements with allied nations. The government aims to capture a larger share of the global battery materials and permanent magnets value chain.",
    aiInterpretation:
      "🟢 影响解读：\n\n1. **新能源产业**：澳大利亚加工能力提升将增加锂等材料的供应来源\n2. **供应链多元化**：为减少对单一来源的依赖提供新选择\n3. **投资机会**：大规模补贴政策为矿业投资者提供了窗口\n4. **应对建议**：\n   - 关注澳大利亚矿业投资的具体补贴条件\n   - 评估与澳方供应商建立长期供应协议的可能\n   - 新能源企业可考虑多元化原材料采购来源\n   - 关注对全球矿产价格的中长期影响",
    source: "Department of Industry, Australia",
    sourceUrl: "https://www.industry.gov.au",
    publishedAt: "2026-03-16T05:00:00Z",
    region: "澳大利亚",
    tags: ["关键矿产", "新能源", "稀土", "锂"],
  },
];

/**
 * Mock 订阅方案数据
 */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "基础版",
    price: 0,
    currency: "USD",
    interval: "month",
    features: [
      "每日政策摘要（延迟24小时）",
      "最多追踪 2 个行业",
      "基础风险等级提示",
      "每周邮件摘要",
    ],
    highlighted: false,
  },
  {
    id: "pro-monthly",
    name: "专业版",
    price: 14.99,
    currency: "USD",
    interval: "month",
    features: [
      "实时政策预警推送",
      "无限行业追踪",
      "AI 深度解读与对照分析",
      "自定义关键词监控",
      "每日邮件速递",
      "历史数据回溯 90 天",
      "优先客服支持",
    ],
    highlighted: true,
  },
  {
    id: "pro-yearly",
    name: "专业版（年付）",
    price: 119.88,
    currency: "USD",
    interval: "year",
    features: [
      "包含专业版所有功能",
      "年付享 33% 折扣",
      "相当于 $9.99/月",
      "历史数据回溯 365 天",
      "季度行业深度报告",
      "专属分析师答疑",
    ],
    highlighted: false,
  },
];
