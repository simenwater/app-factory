/**
 * @fileoverview 多国政策数据源集成
 * 支持：美国联邦公报、欧盟EUR-Lex、日本e-Gov等
 */

import type { Policy } from "@/types";

interface FederalRegisterDoc {
  document_number: string;
  title: string;
  abstract?: string;
  html_url: string;
  publication_date: string;
  agencies: { name: string }[];
  type: string;
}

/**
 * @description 从美国联邦公报获取政策
 */
export async function fetchUSPolicies(): Promise<Policy[]> {
  try {
    const tradeTerms = "China+trade+export+tariff+technology";
    const url = `https://www.federalregister.gov/api/v1/documents.json?conditions[term]=${tradeTerms}&per_page=5&order=newest`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((doc: FederalRegisterDoc) => ({
      id: `us-${doc.document_number}`,
      title: doc.title,
      titleCn: `[待翻译] ${doc.title}`,
      country: "US" as const,
      category: "贸易" as const,
      summary: doc.abstract || doc.title,
      summaryCn: doc.abstract ? `[待翻译] ${doc.abstract.slice(0, 200)}` : `[待翻译] ${doc.title}`,
      content: doc.abstract || doc.title,
      sourceUrl: doc.html_url,
      sourceName: doc.agencies?.[0]?.name || "美国联邦政府",
      publishedAt: new Date(doc.publication_date).toISOString(),
      riskLevel: "medium" as const,
      affectedIndustries: ["贸易", "科技"],
    }));
  } catch {
    return [];
  }
}

/**
 * @description 从欧盟EUR-Lex获取政策
 */
export async function fetchEUPolicies(): Promise<Policy[]> {
  try {
    const url = "https://eur-lex.europa.eu/search.html?type=quick&lang=en&text=digital+trade+regulation&qid=&DTS_DOM=ALL&page=1";
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return [];

    /* EUR-Lex公共搜索API较有限，这里使用简化的集成方式 */
    const text = await res.text();
    const titles = text.match(/<span class="title">(.*?)<\/span>/g) || [];

    return titles.slice(0, 3).map((match: string, i: number) => {
      const title = match.replace(/<[^>]*>/g, "").trim();
      return {
        id: `eu-${Date.now()}-${i}`,
        title,
        titleCn: `[待翻译] ${title}`,
        country: "EU" as const,
        category: "贸易" as const,
        summary: title,
        summaryCn: `[待翻译] ${title}`,
        content: title,
        sourceUrl: "https://eur-lex.europa.eu/",
        sourceName: "欧盟官方公报",
        publishedAt: new Date().toISOString(),
        riskLevel: "medium" as const,
        affectedIndustries: ["贸易", "科技"],
      };
    });
  } catch {
    return [];
  }
}

/**
 * @description 从日本e-Gov获取政策（简化版）
 */
export async function fetchJPPolicies(): Promise<Policy[]> {
  try {
    const url = "https://elaws.e-gov.go.jp/api/1/lawdata/keyword=外国人&limit=3";
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return [];

    return [];
  } catch {
    return [];
  }
}

/**
 * @description 汇总获取所有国家政策
 */
export async function fetchAllPolicies(): Promise<Policy[]> {
  const results = await Promise.allSettled([
    fetchUSPolicies(),
    fetchEUPolicies(),
    fetchJPPolicies(),
  ]);

  const policies: Policy[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      policies.push(...result.value);
    }
  }

  return policies;
}
