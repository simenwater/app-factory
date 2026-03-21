/**
 * @fileoverview 风险评估API
 */

import { NextRequest, NextResponse } from "next/server";
import { mockRiskAssessments } from "@/lib/mockData";
import type { Country } from "@/types";

/**
 * @description GET /api/risk - 获取风险评估列表
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") as Country | null;

  let risks = [...mockRiskAssessments];

  if (country) {
    risks = risks.filter((r) => r.country === country);
  }

  risks.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return NextResponse.json({ risks, total: risks.length });
}
