"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home, BookOpen, Wand2, ClipboardList, Calendar, BarChart2,
  Settings, FileText, PenSquare, MessageSquare, LayoutDashboard,
  Cpu, Database, Shield, FileCheck, ScrollText, AlertTriangle, TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRole } from "@/hooks/useRole"
import { navItems } from "@/config/nav"

const iconMap: Record<string, React.ElementType> = {
  Home,
  BookOpen,
  Wand2,
  ClipboardList,
  Calendar,
  BarChart2,
  Settings,
  FileText,
  PenSquare,
  MessageSquare,
  LayoutDashboard,
  Cpu,
  Database,
  Shield,
  FileCheck,
  ScrollText,
  AlertTriangle,
  TrendingUp,
}

const roleTitles = {
  student: "Student Portal",
  instructor: "Instructor Portal",
  governance: "Governance",
}

const roleColors = {
  student: "text-blue-400",
  instructor: "text-emerald-400",
  governance: "text-purple-400",
}

export function Sidebar() {
  const { role } = useRole()
  const pathname = usePathname()
  const items = navItems[role] || []

  return (
    <aside className="hidden md:flex w-56 flex-col bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex-shrink-0">
      {/* Role label */}
      <div className="px-4 pt-4 pb-2">
        <p className={cn("text-[10px] font-semibold uppercase tracking-widest", roleColors[role])}>
          {roleTitles[role]}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || Home
          const isActive = pathname === item.href ||
            (item.href !== "/student" && item.href !== "/instructor" && item.href !== "/governance" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors group",
                isActive
                  ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] font-medium"
                  : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-primary))]"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-[hsl(var(--sidebar-primary))]" : "text-[hsl(var(--sidebar-foreground))] opacity-70 group-hover:opacity-100")} />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground py-0">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[hsl(var(--sidebar-border))]">
        <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-40">
          Corvinus University of Budapest
        </p>
        <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-30">
          AI Teaching Assistant v1.0
        </p>
      </div>
    </aside>
  )
}
