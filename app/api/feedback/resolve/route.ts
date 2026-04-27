import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

export async function PATCH(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult.error) return authResult.error;

  try {
    const body = await req.json();
    const ids = Array.isArray(body?.feedbackIds) ? body.feedbackIds : [];
    const normalizedIds = ids
      .map((id: unknown) => Number(id))
      .filter((id: number) => Number.isInteger(id) && id > 0);

    if (normalizedIds.length === 0) {
      return NextResponse.json({ msg: "No feedback IDs provided" }, { status: 400 });
    }

    const result = await prisma.feedback.updateMany({
      where: {
        id: { in: normalizedIds },
      },
      data: {
        isResolved: true,
      },
    });

    return NextResponse.json({
      msg: "Feedback resolved",
      updatedCount: result.count,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "something is wrong", error }, { status: 500 });
  }
}

