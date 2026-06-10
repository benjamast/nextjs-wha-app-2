import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface KpiCardProps {
  title: string
  value: string
  icon: React.ReactNode
  accent?: "purple" | "blue" | "amber" | "emerald" | "rose"
  loading?: boolean
  error?: string | null
}

const accentConfig: Record<string, { bg: string; iconBg: string; iconColor: string; skeleton: string }> = {
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    skeleton: "bg-purple-200 dark:bg-purple-800",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    skeleton: "bg-blue-200 dark:bg-blue-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    skeleton: "bg-amber-200 dark:bg-amber-800",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    skeleton: "bg-emerald-200 dark:bg-emerald-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    skeleton: "bg-rose-200 dark:bg-rose-800",
  },
}

function KpiCard({ title, value, icon, accent = "purple", loading, error }: KpiCardProps) {
  const cfg = accentConfig[accent]

  if (error) {
    return (
      <Card size="sm" className="bg-destructive/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            {icon}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-sm font-medium text-destructive">เกิดข้อผิดพลาด</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card size="sm">
        <CardContent className="flex items-center gap-4 py-4">
          <div className={cn("flex size-11 shrink-0 animate-pulse items-center justify-center rounded-xl", cfg.iconBg)} />
          <div className="space-y-2">
            <div className={cn("h-2.5 w-16 animate-pulse rounded", cfg.skeleton)} />
            <div className={cn("h-5 w-28 animate-pulse rounded", cfg.skeleton)} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm" className="group transition-shadow hover:shadow-lg">
      <CardContent className={cn("flex items-center gap-4 py-4", cfg.bg)}>
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110", cfg.iconBg, cfg.iconColor)}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className={cn("mt-0.5 text-xl font-bold tracking-tight", cfg.iconColor)}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { KpiCard }
export type { KpiCardProps }
