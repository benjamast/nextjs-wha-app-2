"use client"

import { useState, useEffect, useRef } from "react"
import { RiAddLine, RiSearchLine, RiPencilLine, RiDeleteBinLine } from "@remixicon/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { ProductFormModal } from "./product-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import type { AdminProduct, CategoryOption, ApiResponse } from "@/types/admin-types"

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [refetchKey, setRefetchKey] = useState(0)
  const categoriesFetched = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  useEffect(() => {
    const ctrl = new AbortController()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    params.set("page", String(page))

    fetch(`/api/admin/products?${params}`, { signal: ctrl.signal })
      .then((res) => res.json())
      .then((json: ApiResponse<{ products: AdminProduct[]; total: number; page: number; totalPages: number }>) => {
        if (!ctrl.signal.aborted) {
          if (json.success) {
            setProducts(json.data.products)
            setTotal(json.data.total)
            setTotalPages(json.data.totalPages)
          }
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!ctrl.signal.aborted && !(e instanceof DOMException && e.name === "AbortError")) {
          toast.error("ไม่สามารถโหลดสินค้าได้")
          setLoading(false)
        }
      })

    return () => ctrl.abort()
  }, [search, page, refetchKey])

  useEffect(() => {
    if (categoriesFetched.current) return
    categoriesFetched.current = true

    const ctrl = new AbortController()

    fetch("/api/admin/categories", { signal: ctrl.signal })
      .then((res) => res.json())
      .then((json: ApiResponse<CategoryOption[]>) => {
        if (!ctrl.signal.aborted && json.success) {
          setCategories(json.data)
        }
      })
      .catch(() => {})

    return () => ctrl.abort()
  }, [])

  function handleOpenCreate() {
    setEditProduct(null)
    setFormOpen(true)
  }

  function handleOpenEdit(product: AdminProduct) {
    setEditProduct(product)
    setFormOpen(true)
  }

  function handleSaved() {
    setFormOpen(false)
    setEditProduct(null)
    setRefetchKey((k) => k + 1)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" })
      const json = await res.json()

      if (!json.success) {
        toast.error(json.error)
        return
      }

      toast.success("ลบสินค้าเรียบร้อย")
      setDeleteTarget(null)
      setRefetchKey((k) => k + 1)
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">สินค้า</h1>
            <p className="text-sm text-muted-foreground">จัดการสินค้าทั้งหมด {total} รายการ</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <RiAddLine />
            เพิ่มสินค้า
          </Button>
        </div>

        <div className="relative max-w-sm">
          <RiSearchLine className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหาสินค้า..."
            className="pl-9"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการสินค้า</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="size-6 text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {search ? "ไม่พบสินค้าที่ค้นหา" : "ยังไม่มีสินค้า"}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>ชื่อสินค้า</TableHead>
                      <TableHead>หมวดหมู่</TableHead>
                      <TableHead>ราคา</TableHead>
                      <TableHead className="w-24" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-muted-foreground">#{p.id}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{p.categoryName}</Badge>
                        </TableCell>
                        <TableCell>{currencyFormatter.format(p.price)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleOpenEdit(p)}
                            >
                              <RiPencilLine />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <RiDeleteBinLine className="text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      หน้า {page} จาก {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        ก่อนหน้า
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        ถัดไป
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSaved={handleSaved}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        product={deleteTarget}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </>
  )
}

export { ProductsClient }
