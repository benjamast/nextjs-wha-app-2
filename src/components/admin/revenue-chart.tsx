"use client"

import { useMemo } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiRefreshLine } from "@remixicon/react"
import type { RevenuePoint } from "@/types/admin-types"
import { PeriodSelector } from "./period-selector"
import type { Period } from "@/types/admin-types"

interface RevenueChartProps {
  data: RevenuePoint[]
  loading: boolean
  period: Period
  onPeriodChange: (p: Period) => void
  error: string | null
  onRetry: () => void
}

function RevenueChart({ data, loading, period, onPeriodChange, error, onRetry }: RevenueChartProps) {
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }),
    []
  )

  const totalRevenue = useMemo(
    () => data.reduce((sum, p) => sum + p.revenue, 0),
    [data]
  )

  if (error) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>รายได้</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RiRefreshLine />
              ลองใหม่
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>รายได้</CardTitle>
          {!loading && data.length > 0 && (
            <p className="mt-1 text-2xl font-bold text-foreground">
              {currencyFormatter.format(totalRevenue)}
            </p>
          )}
        </div>
        <PeriodSelector value={period} onChange={onPeriodChange} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
            <RiRefreshLine className="size-8" />
            <p>ไม่มีข้อมูลรายได้ในช่วงเวลานี้</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <defs>
                  <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-popover)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    fontSize: 13,
                  }}
                  formatter={((value: unknown, name: string) => {
                    const num = Number(value ?? 0)
                    if (name === "revenue") return [currencyFormatter.format(num), "รายได้"]
                    return [num, "ออเดอร์"]
                  }) as any}
                  labelFormatter={(label) => `วันที่ ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#revenue-gradient)"
                  dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "var(--color-primary)", stroke: "var(--color-background)", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { RevenueChart }
