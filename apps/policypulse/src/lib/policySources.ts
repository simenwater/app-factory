import type { PolicyAlert, RiskLevel, IndustryType } from "@/types";

/**
 * @interface FederalRegisterDocument
 * Federal Register API 返回的文档结构
 */
interface FederalRegisterDocument {
  document_number: string;
  title: string;
  abstract: string;
  publication_date: string;
  type: string;
  agencies: Array<{ name: string; raw_name: string }>;
  html_url: string;
  pdf_url: string;
  body_html_url?: string;
  full_text_xml_url?: string;
  action?: string;
  dates?: string;
  raw_text_url?: string;
}

/**
 * @interface FederalRegisterResponse
 * Federal Register API 响应体
 */
interface FederalRegisterResponse {
  count: number;
  results: FederalRegisterDocument[];
}

const FEDERAL_REGISTER_API = "https://www.federalregister.gov/api/v1";

/**
 * 根据文档标题和摘要推断风险等级
 * @param {string} title - 文档标题
 * @param {string} abstract_ - 文档摘要
 * @param {string} type - 文档类型
 * @returns {RiskLevel} 推断的风险等级
 */
function inferRiskLevel(
  title: string,
  abstract_: string,
  type: string
): RiskLevel {
  const text = `${title} ${abstract_}`.toLowerCase();

  const criticalKeywords = [
    "emergency",
    "prohibition",
    "ban",
    "sanction",
    "immediate",
    "critical",
    "national security",
  ];
  const highKeywords = [
    "restriction",
    "tariff",
    "export control",
    "import duty",
    "penalty",
    "enforcement",
    "compliance",
    "amendment",
  ];
  const mediumKeywords = [
    "proposed rule",
    "notice of proposed",
    "comment period",
    "review",
    "update",
    "revision",
  ];

  if (criticalKeywords.some((k) => text.includes(k))) return "critical";
  if (highKeywords.some((k) => text.includes(k))) return "high";
  if (mediumKeywords.some((k) => text.includes(k))) return "medium";

  if (type === "Rule" || type === "Presidential Document") return "high";
  if (type === "Proposed Rule") return "medium";

  return "low";
}

/**
 * 根据文档内容推断受影响行业
 * @param {string} title - 文档标题
 * @param {string} abstract_ - 文档摘要
 * @returns {IndustryType[]} 推断的受影响行业
 */
function inferIndustries(title: string, abstract_: string): IndustryType[] {
  const text = `${title} ${abstract_}`.toLowerCase();
  const industries: IndustryType[] = [];

  const mapping: Record<string, IndustryType[]> = {
    "semiconductor|chip|software|cyber|data|ai |artificial intelligence|technology|telecom|internet":
      ["tech"],
    "bank|financial|interest rate|securities|insurance|investment|monetary|credit":
      ["finance"],
    "tariff|import|export|trade|customs|border|commerce": ["trade"],
    "manufactur|industrial|factory|production|supply chain": ["manufacturing"],
    "retail|consumer|e-commerce|shopping": ["retail"],
    "health|medical|pharmaceutical|drug|fda|hospital": ["healthcare"],
    "energy|oil|gas|solar|wind|nuclear|electricity|carbon|emission": ["energy"],
    "farm|agriculture|crop|food safety|usda": ["agriculture"],
    "real estate|housing|mortgage|property|construction|building": [
      "real-estate",
    ],
    "logistics|shipping|freight|transport|supply chain|warehouse": [
      "logistics",
    ],
  };

  for (const [pattern, types] of Object.entries(mapping)) {
    const regex = new RegExp(pattern);
    if (regex.test(text)) {
      industries.push(...types);
    }
  }

  const unique = [...new Set(industries)];
  return unique.length > 0 ? unique : ["trade"];
}

/**
 * 根据文档内容提取标签
 * @param {string} title - 文档标题
 * @param {string} abstract_ - 文档摘要
 * @param {string} type - 文档类型
 * @returns {string[]} 标签列表
 */
function extractTags(title: string, abstract_: string, type: string): string[] {
  const tags: string[] = [type];
  const text = `${title} ${abstract_}`.toLowerCase();

  const tagMapping: Record<string, string> = {
    tax: "税务",
    tariff: "关税",
    trade: "贸易",
    "export control": "出口管制",
    sanction: "制裁",
    environment: "环境",
    climate: "气候",
    "small business": "小企业",
    technology: "科技",
    healthcare: "医疗",
    financial: "金融",
    energy: "能源",
    immigration: "移民",
    labor: "劳工",
    privacy: "隐私",
    security: "安全",
  };

  for (const [keyword, tag] of Object.entries(tagMapping)) {
    if (text.includes(keyword)) tags.push(tag);
  }

  return [...new Set(tags)].slice(0, 5);
}

/**
 * 将Federal Register文档转换为PolicyAlert格式
 * @param {FederalRegisterDocument} doc - Federal Register文档
 * @returns {PolicyAlert} 转换后的政策预警
 */
function documentToAlert(doc: FederalRegisterDocument): PolicyAlert {
  const abstract_ = doc.abstract || "";
  const title = doc.title || "";
  const agencyName =
    doc.agencies?.map((a) => a.name || a.raw_name).join(", ") ||
    "U.S. Federal Register";

  return {
    id: `fr-${doc.document_number}`,
    title,
    summary: abstract_ || `${title} — Published by ${agencyName}`,
    riskLevel: inferRiskLevel(title, abstract_, doc.type),
    affectedIndustries: inferIndustries(title, abstract_),
    originalText: abstract_ || title,
    aiInterpretation: "",
    source: agencyName,
    sourceUrl: doc.html_url || "https://www.federalregister.gov",
    publishedAt: new Date(doc.publication_date).toISOString(),
    region: "美国",
    tags: extractTags(title, abstract_, doc.type),
  };
}

/**
 * 从Federal Register API获取最新政策文档
 * @param {Object} options - 查询参数
 * @param {number} options.perPage - 每页数量
 * @param {string} options.conditions - 额外的查询条件
 * @returns {Promise<PolicyAlert[]>} 政策预警列表
 */
export async function fetchFederalRegisterPolicies(
  options: {
    perPage?: number;
    searchTerm?: string;
  } = {}
): Promise<PolicyAlert[]> {
  const { perPage = 20, searchTerm } = options;

  const params = new URLSearchParams({
    per_page: String(perPage),
    order: "newest",
    "conditions[type][]": "RULE",
  });

  if (searchTerm) {
    params.set("conditions[term]", searchTerm);
  }

  const url = `${FEDERAL_REGISTER_API}/documents.json?${params.toString()}&conditions[type][]=PRORULE&conditions[type][]=PRESDOCU`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Federal Register API error: ${response.status} ${response.statusText}`
    );
  }

  const data: FederalRegisterResponse = await response.json();
  return data.results
    .filter((doc) => doc.title && doc.title.length > 10)
    .map(documentToAlert);
}

/**
 * 通过RSS获取欧盟政策数据（使用公开的EUR-Lex数据）
 * @returns {Promise<PolicyAlert[]>} 政策预警列表
 */
export async function fetchEUPolicies(): Promise<PolicyAlert[]> {
  try {
    const response = await fetch(
      "https://eur-lex.europa.eu/EN/display-feed.html?rssId=RSSNewOJ",
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return [];

    const xml = await response.text();
    const items: PolicyAlert[] = [];

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let index = 0;

    while ((match = itemRegex.exec(xml)) !== null && index < 10) {
      const itemXml = match[1];
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(itemXml) ||
        /<title>(.*?)<\/title>/.exec(itemXml);
      const descMatch =
        /<description><!\[CDATA\[(.*?)\]\]><\/description>/.exec(itemXml) ||
        /<description>(.*?)<\/description>/.exec(itemXml);
      const linkMatch = /<link>(.*?)<\/link>/.exec(itemXml);
      const dateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemXml);

      if (titleMatch) {
        const title = titleMatch[1].trim();
        const desc = descMatch?.[1]?.trim() || "";

        items.push({
          id: `eu-${index}-${Date.now()}`,
          title,
          summary: desc || title,
          riskLevel: inferRiskLevel(title, desc, "Rule"),
          affectedIndustries: inferIndustries(title, desc),
          originalText: desc || title,
          aiInterpretation: "",
          source: "European Union Official Journal",
          sourceUrl: linkMatch?.[1] || "https://eur-lex.europa.eu",
          publishedAt: dateMatch?.[1]
            ? new Date(dateMatch[1]).toISOString()
            : new Date().toISOString(),
          region: "欧盟",
          tags: extractTags(title, desc, "EU Regulation"),
        });
        index++;
      }
    }

    return items;
  } catch {
    return [];
  }
}

/**
 * 聚合多个数据源获取政策列表
 * @param {Object} options - 查询参数
 * @returns {Promise<PolicyAlert[]>} 合并后的政策预警列表
 */
export async function fetchAllPolicies(
  options: { searchTerm?: string; perPage?: number } = {}
): Promise<PolicyAlert[]> {
  const results = await Promise.allSettled([
    fetchFederalRegisterPolicies(options),
    fetchEUPolicies(),
  ]);

  const alerts: PolicyAlert[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      alerts.push(...result.value);
    }
  }

  alerts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return alerts;
}
