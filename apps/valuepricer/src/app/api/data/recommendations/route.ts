import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * @description GET /api/data/recommendations - Fetch all recommendations for the current user
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recs = await prisma.pricingRecommendation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const formatted = recs.map((r) => ({
    id: r.id,
    inputId: r.inputId,
    createdAt: r.createdAt.toISOString(),
    productName: r.productName,
    industry: r.industry,
    totalValueDelivered: r.totalValueDelivered,
    recommendedModel: r.recommendedModel,
    modelReasoning: r.modelReasoning,
    tiers: JSON.parse(r.tiersJson),
    roi: r.roi,
    competitorComparison: r.competitorComparison,
    keyInsights: JSON.parse(r.keyInsightsJson),
  }));

  return NextResponse.json(formatted);
}

/**
 * @description POST /api/data/recommendations - Create a new recommendation
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const rec = await prisma.pricingRecommendation.create({
    data: {
      userId: session.user.id,
      inputId: body.inputId,
      productName: body.productName,
      industry: body.industry,
      totalValueDelivered: body.totalValueDelivered,
      recommendedModel: body.recommendedModel,
      modelReasoning: body.modelReasoning,
      tiersJson: JSON.stringify(body.tiers),
      roi: body.roi,
      competitorComparison: body.competitorComparison,
      keyInsightsJson: JSON.stringify(body.keyInsights),
    },
  });

  return NextResponse.json({
    ...rec,
    tiers: body.tiers,
    keyInsights: body.keyInsights,
    createdAt: rec.createdAt.toISOString(),
  }, { status: 201 });
}

/**
 * @description DELETE /api/data/recommendations - Delete a recommendation
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const rec = await prisma.pricingRecommendation.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!rec) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.pricingRecommendation.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
