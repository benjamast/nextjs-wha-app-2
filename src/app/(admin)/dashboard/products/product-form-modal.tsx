"use client"

import { useEffect, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { productSchema, type ProductFormValues } from "@/lib/validations/product"
import type { AdminProduct, CategoryOption } from "@/types/admin-types"

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  categoryId: 0,
}

interface ProductFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: AdminProduct | null
  categories: CategoryOption[]
  onSaved: () => void
}

function ProductFormModal({ open, onOpenChange, product, categories, onSaved }: ProductFormModalProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              description: product.description || "",
              price: product.price,
              categoryId: product.categoryId,
            }
          : defaultValues
      )
    }
  }, [open, product, form])

  function onSubmit(data: ProductFormValues) {
    startTransition(async () => {
      try {
        const url = product
          ? `/api/admin/products/${product.id}`
          : "/api/admin/products"
        const method = product ? "PUT" : "POST"

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        const json = await res.json()

        if (!json.success) {
          toast.error(typeof json.error === "string" ? json.error : "เกิดข้อผิดพลาด")
          return
        }

        toast.success(product ? "อัปเดตสินค้าเรียบร้อย" : "เพิ่มสินค้าเรียบร้อย")
        onSaved()
      } catch {
        toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง")
      }
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-popover p-6 shadow-lg">
        <h2 className="font-heading text-base font-medium">
          {product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          กรอกข้อมูลสินค้าให้ครบถ้วน
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">ชื่อสินค้า</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    placeholder="ชื่อสินค้า"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-desc">รายละเอียด</FieldLabel>
                  <Textarea
                    {...field}
                    id="product-desc"
                    rows={3}
                    placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">ราคา</FieldLabel>
                  <Input
                    {...field}
                    id="product-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-cat">หมวดหมู่</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger id="product-cat" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              {product ? "บันทึก" : "เพิ่มสินค้า"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { ProductFormModal }
