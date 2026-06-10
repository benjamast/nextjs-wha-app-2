"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RiRefreshLine } from "@remixicon/react"
import type { AdminOrderItem } from "@/types/admin-types"

const statusLabel: Record<AdminOrderItem["status"], string> = {
  processing: "กำลังดำเนินการ",
  delivered: "จัดส่งแล้ว",
  received: "ได้รับแล้ว",
}

const statusBadge: Record<AdminOrderItem["status"], "default" | "secondary" | "outline"> = {
  processing: "default",
  delivered: "secondary",
  received: "outline",
}

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

interface RecentOrdersTableProps {
  orders: AdminOrderItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function RecentOrdersTable({ orders, loading, error, onRetry }: RecentOrdersTableProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>ออเดอร์ล่าสุด</CardTitle>
        {orders.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {orders.length} รายการ
          </span>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RiRefreshLine />
              ลองใหม่
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            ไม่มีออเดอร์ล่าสุด
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">ออเดอร์</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="px-6">วันที่</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, i) => (
                <TableRow key={order.id} className={i % 2 === 0 ? undefined : "bg-muted/30"}>
                  <TableCell className="px-6 font-medium">#{order.id}</TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {currencyFormatter.format(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[order.status]}>
                      {statusLabel[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-muted-foreground tabular-nums">
                    {new Date(order.date).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export { RecentOrdersTable }
