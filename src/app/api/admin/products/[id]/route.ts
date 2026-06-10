import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const productId = Number(id)
  if (isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 })
  }

  const body = await request.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" }, { status: 404 })
  }

  const product = await prisma.products.update({
    where: { id: productId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      category_id: parsed.data.categoryId,
    },
  })

  return NextResponse.json({
    success: true,
    data: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      categoryId: product.category_id,
    },
  })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const productId = Number(id)
  if (isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 })
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" }, { status: 404 })
  }

  const orderCount = await prisma.order_items.count({ where: { product_id: productId } })
  if (orderCount > 0) {
    return NextResponse.json(
      { success: false, error: `ไม่สามารถลบได้ สินค้านี้มีออเดอร์ ${orderCount} รายการ` },
      { status: 409 }
    )
  }

  await prisma.product_images.deleteMany({ where: { product_id: productId } })
  await prisma.products.delete({ where: { id: productId } })

  return NextResponse.json({ success: true, data: null })
}
