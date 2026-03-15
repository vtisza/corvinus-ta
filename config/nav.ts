import { Role } from "@/lib/types"

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

export const navItems: Record<Role, NavItem[]> = {
  student: [
    { label: "Home", href: "/student", icon: "Home" },
    { label: "My Courses", href: "/student/courses", icon: "BookOpen" },
    { label: "Study Tools", href: "/student/tools", icon: "Wand2" },
    { label: "Assignments", href: "/student/assignments", icon: "ClipboardList", badge: 3 },
    { label: "Office Hours", href: "/student/office-hours", icon: "Calendar" },
    { label: "My Progress", href: "/student/progress", icon: "BarChart2" },
    { label: "Settings & Privacy", href: "/student/settings", icon: "Settings" },
    { label: "A2UI Demo", href: "/student/a2ui-demo", icon: "LayoutTemplate" },
  ],
  instructor: [
    { label: "Home", href: "/instructor", icon: "Home" },
    { label: "Courses I Teach", href: "/instructor/courses", icon: "BookOpen" },
    { label: "Content Studio", href: "/instructor/content", icon: "FileText" },
    { label: "Assessment Studio", href: "/instructor/assessment", icon: "PenSquare" },
    { label: "Q&A Hub", href: "/instructor/qna", icon: "MessageSquare", badge: 5 },
    { label: "Analytics", href: "/instructor/analytics", icon: "BarChart2" },
    { label: "Settings & Policy", href: "/instructor/settings", icon: "Settings" },
  ],
  governance: [
    { label: "Dashboard", href: "/governance", icon: "LayoutDashboard" },
    { label: "Models & Providers", href: "/governance/models", icon: "Cpu" },
    { label: "Knowledge Sources", href: "/governance/sources", icon: "Database" },
    { label: "Access & Consent", href: "/governance/access", icon: "Shield" },
    { label: "Policies & Guardrails", href: "/governance/policies", icon: "FileCheck" },
    { label: "Audit Log", href: "/governance/audit", icon: "ScrollText" },
    { label: "Incidents", href: "/governance/incidents", icon: "AlertTriangle", badge: 3 },
    { label: "Adoption & Impact", href: "/governance/adoption", icon: "TrendingUp" },
  ],
}

export const defaultRoutes: Record<Role, string> = {
  student: "/student",
  instructor: "/instructor",
  governance: "/governance",
}
