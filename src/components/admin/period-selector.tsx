"use client"

import { cn } from "@/lib/utils"
import type { Period } from "@/types/admin-types"

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

const periods: { label: string; value: Period }[] = [
  { label: "7 วัน", value: "7d" },
  { label: "30 วัน", value: "30d" },
  { label: "90 วัน", value: "90d" },
]

function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-4xl border border-border bg-background p-0.5">
      {periods.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={cn(
            "rounded-3xl px-3 py-1.5 text-sm font-medium transition-all",
            value === p.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export { PeriodSelector }
