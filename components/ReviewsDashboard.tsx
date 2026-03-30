"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/chart";

type Range = "week" | "month" | "year";

function RangeButtons({
  value,
  onChange,
}: {
  value: Range;
  onChange: (v: Range) => void;
}) {
  const items: Array<{ key: Range; label: string }> = [
    { key: "week", label: "Past week" },
    { key: "month", label: "Past month" },
    { key: "year", label: "Past year" },
  ];

  return (
    <div className="flex gap-2">
      {items.map((it) => (
        <Button
          key={it.key}
          variant={value === it.key ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(it.key)}
        >
          {it.label}
        </Button>
      ))}
    </div>
  );
}

export default function ReviewsDashboard() {
  const [range, setRange] = useState<Range>("week");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/restaurant/reviews?range=${range}`, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  const points = useMemo(() => {
    const raw = data?.points || [];
    // points: {label, count, avgRating}
    return raw.map((p: any) => ({
      label: p.label,
      reviews: p.count,
      avgRating: p.avgRating,
    }));
  }, [data]);

  const summary = data?.summary;
  const dist = summary?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-sm text-gray-600">
            Only your restaurant’s feedback is shown here.
          </p>
        </div>
        <RangeButtons value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
            <CardDescription>Selected range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary?.totalReviews ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
            <CardDescription>Selected range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary?.avgRating ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>1 to 5 stars</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {[5, 4, 3, 2, 1].map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span>{k}★</span>
                <span className="font-medium">{dist[k] ?? 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Day-wise Reviews</CardTitle>
          <CardDescription>
            Reviews count and average rating over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[360px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              Loading...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis yAxisId="left" allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reviews"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#111827"
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
          <CardTitle>Latest Feedback</CardTitle>
          <CardDescription>Most recent submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (data?.latest?.length || 0) === 0 ? (
            <div className="text-sm text-gray-500">No feedback yet.</div>
          ) : (
            <div className="space-y-3">
              {data.latest.map((r: any) => (
                <div key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{r.rating}★</div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {r.message ? (
                    <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">{r.message}</p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No message</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

