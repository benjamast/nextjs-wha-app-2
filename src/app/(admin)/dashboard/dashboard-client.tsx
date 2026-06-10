"use client"

import { useState, useEffect, useRef } from "react"
import {
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiTimeLine,
  RiBox3Line,
  RiGroupLine,
  RiRefreshLine,
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/components/admin/kpi-card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import type { AdminStats, RevenuePoint, AdminOrderItem, Period, ApiResponse } from "@/types/admin-types"

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

const numberFormatter = new Intl.NumberFormat("th-TH")

function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)

  const [period, setPeriod] = useState<Period>("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const statsRef = useRef({ setStats, setStatsLoading, setStatsError })
  const ordersRef = useRef({ setOrders, setOrdersLoading, setOrdersError })
  const revenueRef = useRef({ setRevenue, setRevenueLoading })

  useEffect(() => {
    const ctrl = new AbortController()
    statsRef.current.setStatsLoading(true)
    statsRef.current.setStatsError(null)

    fetch("/api/admin/stats", { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลสถิติได้")
        return res.json()
      })
      .then((json: ApiResponse<AdminStats>) => {
        if (!ctrl.signal.aborted) {
          if (json.success) statsRef.current.setStats(json.data)
          else statsRef.current.setStatsError(json.error)
          statsRef.current.setStatsLoading(false)
        }
      })
      .catch((e) => {
        if (!ctrl.signal.aborted && !(e instanceof DOMException && e.name === "AbortError")) {
          statsRef.current.setStatsError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด")
          statsRef.current.setStatsLoading(false)
        }
      })

    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    ordersRef.current.setOrdersLoading(true)
    ordersRef.current.setOrdersError(null)

    fetch("/api/admin/orders?limit=5", { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error("ไม่สามารถโหลดออเดอร์ได้")
        return res.json()
      })
      .then((json: ApiResponse<{ orders: AdminOrderItem[]; total: number }>) => {
        if (!ctrl.signal.aborted) {
          if (json.success) ordersRef.current.setOrders(json.data.orders)
          else ordersRef.current.setOrdersError(json.error)
          ordersRef.current.setOrdersLoading(false)
        }
      })
      .catch((e) => {
        if (!ctrl.signal.aborted && !(e instanceof DOMException && e.name === "AbortError")) {
          ordersRef.current.setOrdersError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด")
          ordersRef.current.setOrdersLoading(false)
        }
      })

    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    revenueRef.current.setRevenueLoading(true)

    fetch(`/api/admin/revenue?period=${period}`, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลรายได้")
        return res.json()
      })
      .then((json: ApiResponse<RevenuePoint[]>) => {
        if (!ctrl.signal.aborted) {
          if (json.success) revenueRef.current.setRevenue(json.data)
          revenueRef.current.setRevenueLoading(false)
        }
      })
      .catch((e) => {
        if (!ctrl.signal.aborted && !(e instanceof DOMException && e.name === "AbortError")) {
          revenueRef.current.setRevenue([])
          revenueRef.current.setRevenueLoading(false)
        }
      })

    return () => ctrl.abort()
  }, [period])

  useEffect(() => {
    const interval = setInterval(() => {
      const ctrl = new AbortController()

      fetch("/api/admin/stats", { signal: ctrl.signal })
        .then((res) => res.json())
        .then((json: ApiResponse<AdminStats>) => {
          if (!ctrl.signal.aborted && json.success) statsRef.current.setStats(json.data)
        })
        .catch(() => {})

      fetch("/api/admin/orders?limit=5", { signal: ctrl.signal })
        .then((res) => res.json())
        .then((json: ApiResponse<{ orders: AdminOrderItem[] }>) => {
          if (!ctrl.signal.aborted && json.success) ordersRef.current.setOrders(json.data.orders)
        })
        .catch(() => {})
    }, 30_000)

    return () => clearInterval(interval)
  }, [])

  function handleRefresh() {
    const ctrl = new AbortController()
    statsRef.current.setStatsLoading(true)
    ordersRef.current.setOrdersLoading(true)

    fetch("/api/admin/stats", { signal: ctrl.signal })
      .then((res) => res.json())
      .then((json: ApiResponse<AdminStats>) => {
        if (!ctrl.signal.aborted && json.success) {
          statsRef.current.setStats(json.data)
          statsRef.current.setStatsLoading(false)
        }
      })
      .catch(() => {})
      .finally(() => statsRef.current.setStatsLoading(false))

    fetch("/api/admin/orders?limit=5", { signal: ctrl.signal })
      .then((res) => res.json())
      .then((json: ApiResponse<{ orders: AdminOrderItem[] }>) => {
        if (!ctrl.signal.aborted && json.success) ordersRef.current.setOrders(json.data.orders)
      })
      .catch(() => {})
      .finally(() => ordersRef.current.setOrdersLoading(false))
  }

  const kpiItems = [
    { title: "ยอดขายวันนี้", value: stats ? currencyFormatter.format(stats.todaySales) : "", icon: <RiMoneyDollarCircleLine className="size-5" />, accent: "purple" as const },
    { title: "ออเดอร์วันนี้", value: stats ? numberFormatter.format(stats.todayOrders) : "", icon: <RiShoppingCartLine className="size-5" />, accent: "blue" as const },
    { title: "รอดำเนินการ", value: stats ? numberFormatter.format(stats.pendingOrders) : "", icon: <RiTimeLine className="size-5" />, accent: "amber" as const },
    { title: "สินค้าทั้งหมด", value: stats ? numberFormatter.format(stats.totalProducts) : "", icon: <RiBox3Line className="size-5" />, accent: "emerald" as const },
    { title: "ผู้ใช้ทั้งหมด", value: stats ? numberFormatter.format(stats.totalUsers) : "", icon: <RiGroupLine className="size-5" />, accent: "rose" as const },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">แดชบอร์ด</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ภาพรวมร้านค้าของคุณ — อัปเดตอัตโนมัติทุก 30 วินาที
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RiRefreshLine />
          รีเฟรช
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpiItems.map((kpi, i) => (
          <KpiCard
            key={i}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            accent={kpi.accent}
            loading={!stats && statsLoading}
            error={statsError}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart
          data={revenue}
          loading={revenueLoading}
          period={period}
          onPeriodChange={setPeriod}
          error={statsError}
          onRetry={() => setPeriod((p) => p)}
        />
        <RecentOrdersTable
          orders={orders}
          loading={ordersLoading}
          error={ordersError}
          onRetry={() => {
            ordersRef.current.setOrdersLoading(true)
            ordersRef.current.setOrdersError(null)

            fetch("/api/admin/orders?limit=5")
              .then((res) => {
                if (!res.ok) throw new Error("ไม่สามารถโหลดออเดอร์ได้")
                return res.json()
              })
              .then((json: ApiResponse<{ orders: AdminOrderItem[] }>) => {
                if (json.success) ordersRef.current.setOrders(json.data.orders)
                else ordersRef.current.setOrdersError(json.error)
                ordersRef.current.setOrdersLoading(false)
              })
              .catch((e) => {
                ordersRef.current.setOrdersError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด")
                ordersRef.current.setOrdersLoading(false)
              })
          }}
        />
      </div>
    </div>
  )
}

export { DashboardClient }
