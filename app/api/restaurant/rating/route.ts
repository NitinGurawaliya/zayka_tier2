import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import zod from "zod";


// implement get rating posted by all the users for restaurants in stars and message optional
// this also needs to implemented to show all the rating on the admin dashboard



const CreateRatingSchema = zod.object({
  restaurantId: zod.number().int().positive(),
  stars: zod.number().int().min(1).max(5),
  message: zod.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CreateRatingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { msg: "Invalid data", error: parsed.error.format() },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.restaurantRating.create({
      data: {
        restaurantId: parsed.data.restaurantId,
        rating: parsed.data.stars,
        message: parsed.data.message,
      },
      select: {
        id: true,
        rating: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ rating: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}