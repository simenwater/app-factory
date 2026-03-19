import { NextResponse } from "next/server";
import { fetchAllPolicies } from "@/lib/policySources";
import { mockAlerts } from "@/lib/mockData";

/**
 * GET /api/policies
 * 获取政策预警列表 — 优先从真实数据源获取，失败时回退到mock数据
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get("industry");
  const risk = searchParams.get("risk");
  const search = searchParams.get("search");

  try {
    let alerts = await fetchAllPolicies({
      searchTerm: search || undefined,
      perPage: 20,
    });

    if (alerts.length === 0) {
      alerts = [...mockAlerts];
    }

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
      source: "live",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch live policies, falling back to mock:", error);

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
      source: "cache",
      timestamp: new Date().toISOString(),
    });
  }
}
