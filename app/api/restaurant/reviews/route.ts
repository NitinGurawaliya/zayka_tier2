import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { dayKey, monthKey, rangeStartDate, startOfDay, type AnalyticsRange } from "@/lib/analyticsRange";

export const dynamic = "force-dynamic";

function parseRange(req: NextRequest): AnalyticsRange {
  const url = new URL(req.url);
  const rangeParam = url.searchParams.get("range") || "week";
  return (["week", "month", "year"] as const).includes(rangeParam as any)
    ? (rangeParam as AnalyticsRange)
    : "week";
}

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult.error) return authResult.error;

  const userId = req.cookies.get("userId")?.value;
  if (!userId) {
    return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
  }

  const restaurant = await prisma.restaurantDetail.findUnique({
    where: { userId: parseInt(userId) },
    select: { id: true, restaurantName: true },
  });

  if (!restaurant) {
    return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
  }

  const range = parseRange(req);
  const today = startOfDay(new Date());
  const start = rangeStartDate(range, today);

  // Fetch reviews only for this restaurant
  const reviews = await prisma.restaurantRating.findMany({
    where: {
      restaurantId: restaurant.id,
      createdAt: { gte: start },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      message: true,
      createdAt: true,
    },
  });

  // Summary
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews === 0
      ? 0
      : Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
        ) / 10;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const key = Math.min(5, Math.max(1, r.rating));
    distribution[key] = (distribution[key] || 0) + 1;
  }

  // Daywise / monthwise points
  if (range === "year") {
    const monthAgg = new Map<string, { count: number; sum: number }>();
    for (const r of reviews) {
      const key = monthKey(r.createdAt);
      const cur = monthAgg.get(key) || { count: 0, sum: 0 };
      cur.count += 1;
      cur.sum += r.rating;
      monthAgg.set(key, cur);
    }

    const points = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = monthKey(d);
      const agg = monthAgg.get(key) || { count: 0, sum: 0 };
      points.push({
        key,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        count: agg.count,
        avgRating: agg.count ? Math.round((agg.sum / agg.count) * 10) / 10 : 0,
      });
    }

    return NextResponse.json(
      {
        range,
        restaurant: { id: restaurant.id, restaurantName: restaurant.restaurantName },
        summary: { totalReviews, avgRating, distribution },
        points,
        latest: reviews.slice(0, 25).map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
      },
      { status: 200 }
    );
  }

  const days = range === "week" ? 7 : 30;
  const dayAgg = new Map<string, { count: number; sum: number }>();
  for (const r of reviews) {
    const key = dayKey(r.createdAt);
    const cur = dayAgg.get(key) || { count: 0, sum: 0 };
    cur.count += 1;
    cur.sum += r.rating;
    dayAgg.set(key, cur);
  }

  const points = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dayKey(d);
    const agg = dayAgg.get(key) || { count: 0, sum: 0 };
    points.push({
      key,
      label: String(d.getDate()).padStart(2, "0"),
      date: key,
      count: agg.count,
      avgRating: agg.count ? Math.round((agg.sum / agg.count) * 10) / 10 : 0,
    });
  }

  return NextResponse.json(
    {
      range,
      restaurant: { id: restaurant.id, restaurantName: restaurant.restaurantName },
      summary: { totalReviews, avgRating, distribution },
      points,
      latest: reviews.slice(0, 25).map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    },
    { status: 200 }
  );
}

