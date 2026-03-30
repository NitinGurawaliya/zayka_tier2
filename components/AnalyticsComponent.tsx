"use client"

import { BarChart, PieChart } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "./../components/chart"

interface DishViewData {
  id: number
  name: string
  views: number
}

interface AnalyticsComponentProps {
  qrAnalyticsData?: any
  dishViewData?: DishViewData[]
}

type Range = "week" | "month" | "year"

function RangeButtons({
  value,
  onChange,
}: {
  value: Range
  onChange: (v: Range) => void
}) {
  const items: Array<{ key: Range; label: string }> = [
    { key: "week", label: "Past week" },
    { key: "month", label: "Past month" },
    { key: "year", label: "Past year" },
  ]

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
  )
}

export default function AnalyticsDashboard({
  qrAnalyticsData,
  dishViewData,
}: AnalyticsComponentProps) {
  const [qrRange, setQrRange] = useState<Range>("week")
  const [dishRange, setDishRange] = useState<Range>("week")

  const [qrLoading, setQrLoading] = useState(false)
  const [dishLoading, setDishLoading] = useState(false)

  const [qrPoints, setQrPoints] = useState<Array<{ label: string; scans: number }>>([])
  const [dishPoints, setDishPoints] = useState<Array<{ name: string; views: number }>>(
    dishViewData?.map((d) => ({ name: d.name, views: d.views })) || []
  )

  useEffect(() => {
    const load = async () => {
      setQrLoading(true)
      try {
        const res = await fetch(`/api/restaurant/qrcode/analytics?range=${qrRange}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setQrPoints(
            (data.points || []).map((p: any) => ({
              label: p.label,
              scans: p.count,
            }))
          )
        } else {
          // fallback to server-provided data (no hardcoded)
          setQrPoints(
            (qrAnalyticsData?.dailyScans || []).map((d: any) => ({
              label: d.dayName || d.date || "",
              scans: d.count || 0,
            }))
          )
        }
      } finally {
        setQrLoading(false)
      }
    }
    load()
  }, [qrRange, qrAnalyticsData])

  useEffect(() => {
    const load = async () => {
      setDishLoading(true)
      try {
        const res = await fetch(`/api/menu/analytics/dish?range=${dishRange}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setDishPoints((data.dishes || []).map((d: any) => ({ name: d.name, views: d.views })))
        } else {
          setDishPoints(dishViewData?.map((d) => ({ name: d.name, views: d.views })) || [])
        }
      } finally {
        setDishLoading(false)
      }
    }
    load()
  }, [dishRange, dishViewData])

  const totalQrScans = useMemo(
    () => qrPoints.reduce((sum, p) => sum + (p.scans || 0), 0),
    [qrPoints]
  )
  const avgQrScans = useMemo(
    () => (qrPoints.length ? Math.round(totalQrScans / qrPoints.length) : 0),
    [qrPoints, totalQrScans]
  )
  const peakQr = useMemo(() => {
    if (qrPoints.length === 0) return { label: "—", scans: 0 }
    return qrPoints.reduce((max, cur) => (cur.scans > max.scans ? cur : max), qrPoints[0])
  }, [qrPoints])

  const totalDishViews = useMemo(
    () => dishPoints.reduce((sum, p) => sum + (p.views || 0), 0),
    [dishPoints]
  )
  const avgDishViews = useMemo(
    () => (dishPoints.length ? Math.round(totalDishViews / dishPoints.length) : 0),
    [dishPoints, totalDishViews]
  )
  const topDish = useMemo(() => {
    if (dishPoints.length === 0) return { name: "—", views: 0 }
    return dishPoints.reduce((max, cur) => (cur.views > max.views ? cur : max), dishPoints[0])
  }, [dishPoints])

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>QR Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="dish analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Dish Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <CardTitle>QR Code Scans</CardTitle>
                    <CardDescription>
                      {qrRange === "week"
                        ? "Past 7 days"
                        : qrRange === "month"
                        ? "Past 30 days"
                        : "Past 12 months"}
                    </CardDescription>
                  </div>
                  <RangeButtons value={qrRange} onChange={setQrRange} />
                </div>
              </CardHeader>
              <CardContent className="h-80">
                {qrLoading ? (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    Loading...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={qrPoints}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="scans"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Analytics Summary</CardTitle>
                <CardDescription>Key metrics for selected range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Total Scans</p>
                    <p className="text-3xl font-bold">{totalQrScans}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Average</p>
                    <p className="text-3xl font-bold">{avgQrScans}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Peak</p>
                    <p className="text-3xl font-bold">{peakQr.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dish analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <CardTitle>Dish Views</CardTitle>
                    <CardDescription>
                      {dishRange === "week"
                        ? "Past 7 days"
                        : dishRange === "month"
                        ? "Past 30 days"
                        : "Past 12 months"}
                    </CardDescription>
                  </div>
                  <RangeButtons value={dishRange} onChange={setDishRange} />
                </div>
              </CardHeader>
              <CardContent className="h-[420px]">
                {dishLoading ? (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    Loading...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={dishPoints} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={160} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#2563eb" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dish Analytics Summary</CardTitle>
                <CardDescription>Key metrics for selected range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Total Views</p>
                    <p className="text-3xl font-bold">{totalDishViews}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Average</p>
                    <p className="text-3xl font-bold">{avgDishViews}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Most Popular</p>
                    <p className="text-3xl font-bold">{topDish.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

