"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  RiDashboardLine,
  RiBox3Line,
  RiShoppingCartLine,
  RiAdminLine,
} from "@remixicon/react"

const navItems = [
  { label: "แดชบอร์ด", href: "/dashboard", icon: RiDashboardLine },
  { label: "สินค้า", href: "/dashboard/products", icon: RiBox3Line },
  { label: "ออเดอร์", href: "/dashboard/orders", icon: RiShoppingCartLine },
]

function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <RiAdminLine className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">ShopVibe</p>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <RiDashboardLine className="size-5 shrink-0" />
          กลับหน้าร้าน
        </Link>
      </div>
    </aside>
  )
}

export { Sidebar }
