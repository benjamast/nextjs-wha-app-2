"use client"

import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Phone, Clock } from "lucide-react"
import { toast } from "sonner"

import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { ApiResponse } from "@/types/contact"

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
}

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  })

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        const json: ApiResponse<{ sent: true }> = await res.json()
        if (!json.success) {
          toast.error(json.error)
          return
        }
        form.reset()
      } catch {
        toast.error("ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง")
      }
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
      {/* Contact Info */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">ติดต่อเรา</h2>
          <p className="text-muted-foreground mt-1">
            ทีมงานพร้อมให้บริการคุณ
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium">อีเมล</p>
              <p className="text-sm text-muted-foreground">contact@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium">โทรศัพท์</p>
              <p className="text-sm text-muted-foreground">02-123-4567</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium">เวลาทำการ</p>
              <p className="text-sm text-muted-foreground">จันทร์ - ศุกร์ 09:00 - 18:00 น.</p>
            </div>
          </div>
        </div>

        <Separator />

        <p className="text-sm text-muted-foreground">
          หากมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม กรุณากรอกแบบฟอร์ม
          ทีมงานของเราจะตอบกลับโดยเร็วที่สุด
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-name">ชื่อ</FieldLabel>
                <Input
                  {...field}
                  id="contact-name"
                  placeholder="กรอกชื่อของคุณ"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-email">อีเมล</FieldLabel>
                <Input
                  {...field}
                  id="contact-email"
                  type="email"
                  placeholder="example@email.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-message">ข้อความ</FieldLabel>
                <Textarea
                  {...field}
                  id="contact-message"
                  rows={5}
                  placeholder="พิมพ์ข้อความที่ต้องการ..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
        </Button>
      </form>
    </div>
  )
}
