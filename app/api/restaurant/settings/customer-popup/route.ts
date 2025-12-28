import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

const UpdateSchema = zod.object({
  enabled: zod.boolean(),
});

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult.error) return authResult.error;

  const userId = req.cookies.get("userId")?.value;
  if (!userId) {
    return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
  }

  const restaurant = await prisma.restaurantDetail.findUnique({
    where: { userId: parseInt(userId) },
    select: { customerDetailsPopupEnabled: true },
  });

  if (!restaurant) {
    return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
  }

  return NextResponse.json(
    { enabled: restaurant.customerDetailsPopupEnabled },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult.error) return authResult.error;

  const userId = req.cookies.get("userId")?.value;
  if (!userId) {
    return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { msg: "Invalid data", error: parsed.error.format() },
      { status: 400 }
    );
  }

  const updated = await prisma.restaurantDetail.update({
    where: { userId: parseInt(userId) },
    data: { customerDetailsPopupEnabled: parsed.data.enabled },
    select: { customerDetailsPopupEnabled: true },
  });

  return NextResponse.json(
    { enabled: updated.customerDetailsPopupEnabled },
    { status: 200 }
  );
}

