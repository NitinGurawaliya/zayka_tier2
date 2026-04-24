import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { dayKey, monthKey, rangeStartDate, startOfDay, type AnalyticsRange } from "@/lib/analyticsRange";

export const dynamic = "force-dynamic";

type Sentiment = "positive" | "neutral" | "negative";

function parseRange(value: string | null): AnalyticsRange {
  if (value === "week" || value === "month" || value === "year") return value;
  return "week";
}

function getSentiment(rating: number): Sentiment {
  if (rating >= 4) return "positive";
  if (rating <= 2) return "negative";
  return "neutral";
}

function averageRating(items: Array<{ rating: number }>) {
  if (!items.length) return 0;
  return Math.round((items.reduce((sum, item) => sum + item.rating, 0) / items.length) * 10) / 10;
}

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult.error) return authResult.error;

  const { searchParams } = new URL(req.url);
  const range = parseRange(searchParams.get("range"));
  const restaurantId = Number(searchParams.get("restaurantId"));

  if (!restaurantId) {
    return NextResponse.json({ msg: "restaurantId is required" }, { status: 400 });
  }

  const now = new Date();
  const today = startOfDay(now);
  const currentStart = rangeStartDate(range, today);

  // Previous period starts one day/month before current window.
  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);

  const previousStart = new Date(previousEnd);
  if (range === "week") {
    previousStart.setDate(previousEnd.getDate() - 6);
  } else if (range === "month") {
    previousStart.setDate(previousEnd.getDate() - 29);
  } else {
    previousStart.setMonth(previousEnd.getMonth() - 11, 1);
    previousStart.setHours(0, 0, 0, 0);
  }

  const [restaurant, currentFeedback, previousFeedback] = await Promise.all([
    prisma.restaurantDetail.findUnique({
      where: { id: restaurantId },
      select: { restaurantName: true },
    }),
    prisma.feedback.findMany({
      where: {
        restaurantId,
        createdAt: { gte: currentStart, lte: now },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        message: true,
        createdAt: true,
        customerContact: true,
        selectedPoints: true,
        isResolved: true,
      },
    }),
    prisma.feedback.findMany({
      where: {
        restaurantId,
        createdAt: { gte: previousStart, lte: previousEnd },
      },
      select: { rating: true },
    }),
  ]);

  const totalFeedback = currentFeedback.length;
  const avgRating = averageRating(currentFeedback);
  const totalFeedbackPrev = previousFeedback.length;
  const avgRatingPrev = averageRating(previousFeedback);

  const sentimentSplit = { positive: 0, neutral: 0, negative: 0 };
  for (const row of currentFeedback) {
    sentimentSplit[getSentiment(row.rating)] += 1;
  }

  const dailyData: Array<{ date: string; count: number; avgRating: number; negativeCount: number }> = [];
  if (range === "year") {
    const agg = new Map<string, { count: number; ratingSum: number; negativeCount: number }>();
    for (const row of currentFeedback) {
      const key = monthKey(row.createdAt);
      const entry = agg.get(key) || { count: 0, ratingSum: 0, negativeCount: 0 };
      entry.count += 1;
      entry.ratingSum += row.rating;
      if (getSentiment(row.rating) === "negative") entry.negativeCount += 1;
      agg.set(key, entry);
    }

    for (let i = 0; i < 12; i++) {
      const d = new Date(currentStart.getFullYear(), currentStart.getMonth() + i, 1);
      const key = monthKey(d);
      const data = agg.get(key) || { count: 0, ratingSum: 0, negativeCount: 0 };
      dailyData.push({
        date: key,
        count: data.count,
        avgRating: data.count ? Math.round((data.ratingSum / data.count) * 10) / 10 : 0,
        negativeCount: data.negativeCount,
      });
    }
  } else {
    const days = range === "week" ? 7 : 30;
    const agg = new Map<string, { count: number; ratingSum: number; negativeCount: number }>();
    for (const row of currentFeedback) {
      const key = dayKey(row.createdAt);
      const entry = agg.get(key) || { count: 0, ratingSum: 0, negativeCount: 0 };
      entry.count += 1;
      entry.ratingSum += row.rating;
      if (getSentiment(row.rating) === "negative") entry.negativeCount += 1;
      agg.set(key, entry);
    }

    for (let i = 0; i < days; i++) {
      const d = new Date(currentStart);
      d.setDate(currentStart.getDate() + i);
      const key = dayKey(d);
      const data = agg.get(key) || { count: 0, ratingSum: 0, negativeCount: 0 };
      dailyData.push({
        date: key,
        count: data.count,
        avgRating: data.count ? Math.round((data.ratingSum / data.count) * 10) / 10 : 0,
        negativeCount: data.negativeCount,
      });
    }
  }

  const touchpointMap = new Map<string, number>();
  for (const row of currentFeedback) {
    if (getSentiment(row.rating) !== "negative") continue;
    for (const point of row.selectedPoints || []) {
      if (!point) continue;
      touchpointMap.set(point, (touchpointMap.get(point) || 0) + 1);
    }
  }
  const touchpointBreakdown = Array.from(touchpointMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const unresolvedNegativeFeedback = currentFeedback.filter(
    (row) => getSentiment(row.rating) === "negative" && row.isResolved !== true
  );
  const unresolvedNegativeCount = unresolvedNegativeFeedback.length;

  const latestFeedback = currentFeedback.slice(0, 50).map((row) => ({
    id: row.id,
    rating: row.rating,
    sentiment: getSentiment(row.rating),
    pathTaken: row.selectedPoints || [],
    message: row.message || "",
    customerContact: row.customerContact || "",
    createdAt: row.createdAt.toISOString(),
    resolved: row.isResolved === true,
  }));

  return NextResponse.json(
    {
      restaurantName: restaurant?.restaurantName || "",
      totalFeedback,
      avgRating,
      totalFeedbackPrev,
      avgRatingPrev,
      sentimentSplit,
      dailyData,
      touchpointBreakdown,
      latestFeedback,
      unresolvedNegativeCount,
      googleRedirectCount: 0,
    },
    { status: 200 }
  );
}

