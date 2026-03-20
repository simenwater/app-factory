import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * @description GET /api/data/inputs - Fetch all value inputs for the current user
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inputs = await prisma.valueInput.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(inputs);
}

/**
 * @description POST /api/data/inputs - Create a new value input
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const input = await prisma.valueInput.create({
    data: {
      userId: session.user.id,
      productName: body.productName,
      industry: body.industry,
      targetCustomerSize: body.targetCustomerSize,
      engineerCount: body.engineerCount,
      avgHourlyCost: body.avgHourlyCost,
      hoursSavedPerWeek: body.hoursSavedPerWeek,
      additionalCostSavingsMonthly: body.additionalCostSavingsMonthly,
      currentProcessDescription: body.currentProcessDescription || "",
      competitorPrice: body.competitorPrice || 0,
    },
  });

  return NextResponse.json(input, { status: 201 });
}
