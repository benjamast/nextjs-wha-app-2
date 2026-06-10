"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function WelcomeBannerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const show = searchParams.get("welcome") === "true"
  const cleaned = useRef(false)

  useEffect(() => {
    if (show && !cleaned.current) {
      cleaned.current = true
      const timer = setTimeout(() => {
        router.replace("/", { scroll: false })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, router])

  if (!show) return null

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 text-center">
      <p className="text-sm font-medium text-primary">
        ยินดีต้อนรับ! เข้าสู่ระบบสำเร็จ
      </p>
    </div>
  )
}

import { Suspense } from "react"

export function WelcomeBanner() {
  return (
    <Suspense fallback={null}>
      <WelcomeBannerInner />
    </Suspense>
  )
}
