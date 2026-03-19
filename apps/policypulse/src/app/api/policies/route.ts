import { NextResponse } from "next/server";
import { mockAlerts } from "@/lib/mockData";

/**
 * GET /api/policies
 * 获取政策预警列表，支持 industry 和 risk 筛选
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get("industry");
  const risk = searchParams.get("risk");

  let alerts = [...mockAlerts];

  if (industry) {
    alerts = alerts.filter((a) =>
      a.affectedIndustries.includes(industry as never)
    );
  }

  if (risk) {
    alerts = alerts.filter((a) => a.riskLevel === risk);
  }

  return NextResponse.json({
    data: alerts,
    total: alerts.length,
    timestamp: new Date().toISOString(),
  });
}
