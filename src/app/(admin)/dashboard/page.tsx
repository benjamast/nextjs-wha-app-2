import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { DashboardClient } from "./dashboard-client"

async function DashboardGuard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return <DashboardClient />
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner className="size-6" /></div>}>
      <DashboardGuard />
    </Suspense>
  )
}
