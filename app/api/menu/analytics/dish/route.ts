import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { rangeStartDate, type AnalyticsRange } from "@/lib/analyticsRange";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Authenticate User
    const authResult = await authMiddleware(req);
    if (authResult.error) {
        return NextResponse.json(authResult.error, { status: 401 });
    }

    // Get user ID from cookies
    const userId = req.cookies.get("userId")?.value;
    if (!userId) {
        return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
    }

    try {
        const url = new URL(req.url);
        const rangeParam = url.searchParams.get("range") || "week";
        const range: AnalyticsRange = (["week", "month", "year"] as const).includes(rangeParam as any)
            ? (rangeParam as AnalyticsRange)
            : "week";

        // Find the restaurant associated with the user
        const restaurant = await prisma.restaurantDetail.findUnique({
            where: { userId: parseInt(userId) },
            select: {
                id: true,
                dishes: { select: { id: true, name: true } },
            },
        });

        if (!restaurant) {
            return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
        }

        const now = new Date();
        const start = rangeStartDate(range, now);

        const dishIds = restaurant.dishes.map((d) => d.id);
        if (dishIds.length === 0) {
            return NextResponse.json({ range, dishes: [], totalViews: 0 }, { status: 200 });
        }

        const grouped = await prisma.dishView.groupBy({
            by: ["dishId"],
            where: {
                dishId: { in: dishIds },
                timestamp: { gte: start },
            },
            _count: { _all: true },
        });

        const countMap = new Map<number, number>();
        grouped.forEach((g) => {
            countMap.set(g.dishId, g._count._all);
        });

        const dishes = restaurant.dishes
            .map((d) => ({
                id: d.id,
                name: d.name,
                views: countMap.get(d.id) || 0,
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 15);

        const totalViews = dishes.reduce((sum, d) => sum + d.views, 0);

        return NextResponse.json({ range, dishes, totalViews }, { status: 200 });
    } catch (error) {
        console.error("Error fetching dishes:", error);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}
