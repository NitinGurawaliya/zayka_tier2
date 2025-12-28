import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { dayKey, monthKey, rangeStartDate, startOfDay, type AnalyticsRange } from "@/lib/analyticsRange";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authResponse = await authMiddleware(req);
    if (authResponse.error) {
        return authResponse.error;
    }

    const userId = req.cookies.get("userId")?.value;

    if (!userId) {
        return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
    }

    // Get the user's restaurant ID to ensure they own it
    const userRestaurant = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
            restaurantDetail: {
                select: { id: true, qrScans: true }
            }
        }
    });

    if (!userRestaurant?.restaurantDetail) {
        return NextResponse.json({ msg: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    const restaurantId = userRestaurant.restaurantDetail.id;

    try {
        const url = new URL(req.url);
        const rangeParam = url.searchParams.get("range") || "week";
        const range: AnalyticsRange = (["week", "month", "year"] as const).includes(rangeParam as any)
            ? (rangeParam as AnalyticsRange)
            : "week";

        const today = startOfDay(new Date());
        const start = rangeStartDate(range, today);

        const scans = await prisma.dailyQRScan.findMany({
            where: {
                restaurantId: restaurantId,
                scanDate: {
                    gte: start,
                    lte: today,
                },
            },
            orderBy: { scanDate: "asc" },
        });

        let totalScans = 0;

        if (range === "year") {
            // aggregate by month
            const monthMap = new Map<string, number>();
            for (const s of scans as any[]) {
                const d = new Date(s.scanDate);
                const key = monthKey(d);
                monthMap.set(key, (monthMap.get(key) || 0) + s.scanCount);
            }

            const points: any[] = [];
            for (let i = 0; i < 12; i++) {
                const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
                const key = monthKey(d);
                const count = monthMap.get(key) || 0;
                totalScans += count;
                points.push({
                    key,
                    label: d.toLocaleDateString("en-US", { month: "short" }),
                    count,
                });
            }

            return NextResponse.json(
                {
                    range,
                    points,
                    totalScans,
                    period: {
                        start: start.toISOString().split("T")[0],
                        end: today.toISOString().split("T")[0],
                    },
                },
                { status: 200 }
            );
        }

        // week/month: daily points
        const scanMap = new Map<string, number>();
        (scans as any[]).forEach((scan) => {
            const dateKeyStr = dayKey(new Date(scan.scanDate));
            scanMap.set(dateKeyStr, scan.scanCount);
        });

        const days = range === "week" ? 7 : 30;
        const points: any[] = [];
        let todayScanCount = 0;

        for (let i = 0; i < days; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const dateKeyStr = dayKey(d);
            const count = scanMap.get(dateKeyStr) || 0;
            totalScans += count;
            if (dateKeyStr === dayKey(today)) {
                todayScanCount = count;
            }
            points.push({
                key: dateKeyStr,
                date: dateKeyStr,
                label: String(d.getDate()).padStart(2, "0"),
                count,
            });
        }

        return NextResponse.json(
            {
                range,
                points,
                totalScans,
                todayScans: todayScanCount,
                period: {
                    start: start.toISOString().split("T")[0],
                    end: today.toISOString().split("T")[0],
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching QR analytics:", error);
        return NextResponse.json({ msg: "Error fetching QR analytics" }, { status: 500 });
    }
} 