import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 5))

  const orders = await prisma.orders.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: {
      customers: {
        select: { name: true },
      },
    },
  })

  return NextResponse.json({
    success: true,
    data: {
      orders: orders.map((o) => ({
        id: o.id,
        customer: o.customers?.name || "ไม่ระบุ",
        total: Number(o.total_amount) || 0,
        status: o.status || "processing",
        date: o.date?.toISOString() || new Date().toISOString(),
      })),
      total: orders.length,
    },
  })
}
