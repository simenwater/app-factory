/**
 * @fileoverview 政策数据API - 获取多国政策列表
 */

import { NextRequest, NextResponse } from "next/server";
import { mockPolicies } from "@/lib/mockData";
import { fetchAllPolicies } from "@/lib/policySources";
import type { Country, PolicyCategory, RiskLevel } from "@/types";

/**
 * @description GET /api/policies - 获取政策列表，支持筛选
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") as Country | null;
  const category = searchParams.get("category") as PolicyCategory | null;
  const risk = searchParams.get("risk") as RiskLevel | null;
  const search = searchParams.get("q");

  let policies = [...mockPolicies];

  try {
    const livePolicies = await fetchAllPolicies();
    if (livePolicies.length > 0) {
      policies = [...livePolicies, ...policies];
    }
  } catch {
    /* 实时数据获取失败时使用mock数据 */
  }

  if (country) {
    policies = policies.filter((p) => p.country === country);
  }
  if (category) {
    policies = policies.filter((p) => p.category === category);
  }
  if (risk) {
    policies = policies.filter((p) => p.riskLevel === risk);
  }
  if (search) {
    const q = search.toLowerCase();
    policies = policies.filter(
      (p) =>
        p.titleCn.toLowerCase().includes(q) ||
        p.summaryCn.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
    );
  }

  policies.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({ policies, total: policies.length });
}
