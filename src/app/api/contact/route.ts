import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { contactSchema } from "@/lib/validations/contact"
import type { ApiResponse } from "@/types/contact"

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      const response: ApiResponse<never> = {
        success: false,
        error: result.error.issues.map((i) => i.message).join(", "),
      }
      return NextResponse.json(response, { status: 400 })
    }

    const { name, email, message } = result.data

    const resend = getResend()
    if (!resend) {
      const response: ApiResponse<never> = {
        success: false,
        error: "ระบบส่งอีเมลยังไม่ได้ถูกตั้งค่า",
      }
      return NextResponse.json(response, { status: 500 })
    }

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_RECEIVER_EMAIL ?? "",
      subject: `ข้อความจาก ${name} (${email})`,
      text: message,
      html: `<p><strong>ชื่อ:</strong> ${name}</p><p><strong>อีเมล:</strong> ${email}</p><p><strong>ข้อความ:</strong></p><p>${message}</p>`,
    })

    const response: ApiResponse<{ sent: true }> = {
      success: true,
      data: { sent: true },
    }
    return NextResponse.json(response)
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
