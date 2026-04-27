"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  } from "./ui/chart copy";

type DashboardRange = "week" | "month" | "year";
type DashboardMode = "zayka" | "sunno";

interface FeedbackDashboardProps {
  backendUrl: string;
  mode: DashboardMode;
  restaurantId: number;
  timeRange: DashboardRange;
  onTimeRangeChange: (range: string) => void;
}

interface FeedbackItem {
  id: number;
  rating: number;
  sentiment: string;
  pathTaken: unknown;
  message: string;
  customerContact: string;
  createdAt: string;
  resolved: boolean;
}

interface FeedbackDashboardData {
  totalFeedback: number;
  avgRating: number;
  totalFeedbackPrev: number;
  avgRatingPrev: number;
  sentimentSplit: { positive: number; neutral: number; negative: number };
  dailyData: Array<{ date: string; count: number; avgRating: number; negativeCount: number }>;
  touchpointBreakdown: Array<{ label: string; count: number }>;
  latestFeedback: FeedbackItem[];
  unresolvedNegativeCount: number;
  googleRedirectCount: number;
}

const EMPTY_DATA: FeedbackDashboardData = {
  totalFeedback: 0,
  avgRating: 0,
  totalFeedbackPrev: 0,
  avgRatingPrev: 0,
  sentimentSplit: { positive: 0, neutral: 0, negative: 0 },
  dailyData: [],
  touchpointBreakdown: [],
  latestFeedback: [],
  unresolvedNegativeCount: 0,
  googleRedirectCount: 0,
};

function formatDateLabel(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function sentimentDotClass(sentiment: string) {
  if (sentiment === "positive") return "bg-emerald-500";
  if (sentiment === "negative") return "bg-rose-500";
  return "bg-amber-500";
}

function toPercent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function parsePathTaken(pathTaken: unknown): string[] {
  if (!pathTaken) return [];
  if (Array.isArray(pathTaken)) {
    return pathTaken.map((item) => String(item)).filter(Boolean);
  }
  if (typeof pathTaken === "object") {
    const objectValues = Object.values(pathTaken as Record<string, unknown>);
    return objectValues.map((item) => String(item)).filter(Boolean);
  }
  if (typeof pathTaken === "string") {
    try {
      const parsed = JSON.parse(pathTaken);
      return parsePathTaken(parsed);
    } catch {
      return [pathTaken];
    }
  }
  return [String(pathTaken)];
}

function getWhatsAppNumber(rawContact: string) {
  const digits = (rawContact || "").replace(/\D/g, "");
  if (!digits) return "";

  // Handle common India formats: 10-digit local, leading 0, or already with 91.
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;

  // Fallback to raw digits when format is unusual.
  return digits;
}

function TrendValue({
  current,
  previous,
  isCount = false,
}: {
  current: number;
  previous: number;
  isCount?: boolean;
}) {
  const delta = current - previous;
  const isPositive = delta > 0;
  const isFlat = delta === 0;
  const iconClass = isFlat ? "text-gray-500" : isPositive ? "text-emerald-600" : "text-rose-600";
  const Icon = isPositive || isFlat ? ArrowUpRight : ArrowDownRight;
  const deltaLabel = isCount ? String(Math.abs(Math.round(delta))) : Math.abs(delta).toFixed(1);
  const label = `${deltaLabel} vs previous`;

  return (
    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
      <Icon className={`h-4 w-4 ${iconClass}`} />
      <span>{label}</span>
    </div>
  );
}

export default function FeedbackDashboard({
  backendUrl,
  mode,
  restaurantId,
  timeRange,
  onTimeRangeChange,
}: FeedbackDashboardProps) {
  const normalizedBackendUrl = backendUrl.replace(/\/+$/, "");
  const buildApiUrl = useCallback(
    (path: string) => `${normalizedBackendUrl}${path}`,
    [normalizedBackendUrl]
  );

  const [loading, setLoading] = useState(false);
  const [savingResolved, setSavingResolved] = useState(false);
  const [data, setData] = useState<FeedbackDashboardData>(EMPTY_DATA);
  const [error, setError] = useState("");
  const [restaurantName, setRestaurantName] = useState("your restaurant");
  const [pendingResolvedIds, setPendingResolvedIds] = useState<number[]>([]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({
        restaurantId: String(restaurantId),
        range: timeRange,
      });
      const res = await fetch(`${buildApiUrl("/feedback/dashboard")}?${query.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Could not load feedback dashboard data.");
      }
      const payload = (await res.json()) as FeedbackDashboardData;
      const nameFromPayload = (payload as any)?.restaurantName;
      if (typeof nameFromPayload === "string" && nameFromPayload.trim()) {
        setRestaurantName(nameFromPayload.trim());
      }
      setData({
        ...EMPTY_DATA,
        ...payload,
        sentimentSplit: { ...EMPTY_DATA.sentimentSplit, ...(payload.sentimentSplit || {}) },
        dailyData: payload.dailyData || [],
        touchpointBreakdown: payload.touchpointBreakdown || [],
        latestFeedback: payload.latestFeedback || [],
      });
      setPendingResolvedIds([]);
    } catch (e: any) {
      setError(e?.message || "Could not load feedback dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [restaurantId, timeRange, buildApiUrl]);

  const markResolved = (feedbackId: number) => {
    const target = data.latestFeedback.find((item) => item.id === feedbackId);
    if (!target || target.resolved) return;

    setPendingResolvedIds((prev) => (prev.includes(feedbackId) ? prev : [...prev, feedbackId]));
    setData((prev) => ({
      ...prev,
      unresolvedNegativeCount:
        target.sentiment === "negative" ? Math.max(0, prev.unresolvedNegativeCount - 1) : prev.unresolvedNegativeCount,
      latestFeedback: prev.latestFeedback.map((item) =>
        item.id === feedbackId ? { ...item, resolved: true } : item
      ),
    }));
  };

  const persistResolvedBatch = useCallback(async (idsToSave?: number[]) => {
    const ids = idsToSave && idsToSave.length > 0 ? idsToSave : pendingResolvedIds;
    if (ids.length === 0 || savingResolved) return;

    setSavingResolved(true);
    setError("");
    try {
      const res = await fetch(buildApiUrl("/feedback/resolve"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ feedbackIds: ids }),
      });
      if (!res.ok) throw new Error("Could not save resolved feedback.");
      setPendingResolvedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } catch (e: any) {
      setError(e?.message || "Could not save resolved feedback.");
    } finally {
      setSavingResolved(false);
    }
  }, [pendingResolvedIds, savingResolved, buildApiUrl]);

  useEffect(() => {
    if (pendingResolvedIds.length === 0 || savingResolved) return;
    const timer = setTimeout(() => {
      void persistResolvedBatch();
    }, 1200);
    return () => clearTimeout(timer);
  }, [pendingResolvedIds, savingResolved, persistResolvedBatch]);

  useEffect(() => {
    if (restaurantId) {
      loadDashboardData();
    }
  }, [restaurantId, loadDashboardData]);

  const totalSentiment = useMemo(() => {
    return (
      data.sentimentSplit.positive +
      data.sentimentSplit.neutral +
      data.sentimentSplit.negative
    );
  }, [data.sentimentSplit]);

  const rangeButtons: Array<{ key: DashboardRange; label: string }> = [
    { key: "week", label: "Past week" },
    { key: "month", label: "Past month" },
    { key: "year", label: "Past year" },
  ];

  const googleLabel =
    mode === "sunno"
      ? `${data.googleRedirectCount} customers redirected to Google this month via Sunno`
      : `${data.googleRedirectCount} customers redirected to Google this month`;

  const truncateTouchpoint = (label: string) => (label.length > 22 ? `${label.slice(0, 22)}...` : label);
  const positiveFeedback = data.latestFeedback.filter((item) => item.sentiment === "positive");
  const negativeFeedback = data.latestFeedback
    .filter((item) => item.sentiment === "negative")
    .sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1; // unresolved first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const renderFeedbackItem = (item: FeedbackItem) => {
    const isNegative = item.sentiment === "negative";
    const pathTags = parsePathTaken(item.pathTaken);
    const waNumber = getWhatsAppNumber(item.customerContact);

    return (
      <div key={item.id} className="rounded-lg border p-3 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${sentimentDotClass(item.sentiment)}`} />
            <span className="font-semibold">{item.rating}★</span>
            <Badge variant="outline" className="capitalize">
              {item.sentiment}
            </Badge>
            {item.resolved ? <Badge className="bg-emerald-600">Resolved</Badge> : null}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(item.createdAt).toLocaleString()}
          </div>
        </div>

        {pathTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {pathTags.map((tag, idx) => (
              <Badge key={`${item.id}-${idx}`} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {item.message ? (
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.message}</p>
        ) : (
          <p className="text-sm text-gray-500">No message provided.</p>
        )}

        {isNegative ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              disabled={!waNumber}
              onClick={() => {
                if (waNumber) {
                  const msg = `Hi, we noticed your recent feedback at ${restaurantName}. We're sorry about your experience and would love to make it right.`;
                  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }
              }}
            >
              {waNumber ? "Contact Customer" : "No Contact Number"}
            </Button>
            <Button
              size="sm"
              variant="default"
              disabled={item.resolved || savingResolved}
              onClick={() => markResolved(item.id)}
            >
              {item.resolved ? "Resolved" : "Mark Resolved"}
            </Button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
          <p className="text-sm text-gray-600">Live feedback insights for your restaurant.</p>
        </div>
        <div className="flex gap-2 items-center">
          {pendingResolvedIds.length > 0 || savingResolved ? (
            <span className="text-xs text-gray-500">
              {savingResolved ? "Saving resolved updates..." : `${pendingResolvedIds.length} update(s) queued`}
            </span>
          ) : null}
          {rangeButtons.map((item) => (
            <Button
              key={item.key}
              size="sm"
              variant={timeRange === item.key ? "default" : "outline"}
              onClick={() => onTimeRangeChange(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-4 text-sm text-rose-600">{error}</CardContent>
        </Card>
      ) : null}

      {data.unresolvedNegativeCount > 0 ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 flex items-center justify-between">
          <div>
          <p className="text-sm font-medium text-rose-700">
            {data.unresolvedNegativeCount} unhappy customers need attention
          </p>
          <p className="text-xs text-rose-600">Count is only for selected range.</p>
          </div>
          <a href="#latest-feedback" className="text-sm font-semibold text-rose-700 underline">
            View all
          </a>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
            <CardDescription>Compared to previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{data.totalFeedback}</div>
            <TrendValue current={data.totalFeedback} previous={data.totalFeedbackPrev} isCount />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
            <CardDescription>Compared to previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{data.avgRating.toFixed(1)}</div>
            <TrendValue current={data.avgRating} previous={data.avgRatingPrev} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Split</CardTitle>
            <CardDescription>Positive, neutral, negative</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Positive</span>
              <span className="font-medium">
                {toPercent(data.sentimentSplit.positive, totalSentiment)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Neutral</span>
              <span className="font-medium">
                {toPercent(data.sentimentSplit.neutral, totalSentiment)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Negative</span>
              <span className="font-medium">
                {toPercent(data.sentimentSplit.negative, totalSentiment)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Day-wise Feedback Trend</CardTitle>
          <CardDescription>Reviews, average rating, and negative count.</CardDescription>
        </CardHeader>
        <CardContent className="h-[360px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading...</div>
          ) : data.dailyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              No data in selected range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDateLabel} />
                <YAxis yAxisId="left" allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" domain={[1, 5]} />
                <Tooltip
                  labelFormatter={(v) => formatDateLabel(String(v))}
                  formatter={(value: number, name: string) => [value, name]}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="count"
                  name="Total reviews"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgRating"
                  name="Average rating"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="negativeCount"
                  name="Negative count"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Touchpoint Breakdown</CardTitle>
          <CardDescription>Most frequent complaint categories across negative feedback.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading...</div>
          ) : data.touchpointBreakdown.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              No touchpoint complaints in selected range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.touchpointBreakdown} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="label" type="category" width={180} tickFormatter={truncateTouchpoint} />
                <Tooltip />
                <Bar dataKey="count">
                  {data.touchpointBreakdown.map((item, idx) => (
                    <Cell
                      key={`${item.label}-${idx}`}
                      fill={idx < 3 ? "#dc2626" : "#2563eb"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div id="latest-feedback" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Positive Feedback</CardTitle>
            <CardDescription>Positive feedback in selected range.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : positiveFeedback.length === 0 ? (
              <div className="text-sm text-gray-500">No positive feedback in this range.</div>
            ) : (
              <div className="space-y-3">{positiveFeedback.map(renderFeedbackItem)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Negative Feedback</CardTitle>
            <CardDescription>Negative feedback in selected range.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : negativeFeedback.length === 0 ? (
              <div className="text-sm text-gray-500">No negative feedback in this range.</div>
            ) : (
              <div className="space-y-3">{negativeFeedback.map(renderFeedbackItem)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {data.googleRedirectCount > 0 ? (
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-gray-700">{googleLabel}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
