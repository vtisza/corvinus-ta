"use client"

import { useRouter } from "next/navigation"
import { GraduationCap, BookOpen, Shield, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRole } from "@/hooks/useRole"
import { Role } from "@/lib/types"
import { defaultRoutes } from "@/config/nav"

const roles: { value: Role; label: string; icon: React.ElementType; color: string }[] = [
  { value: "student", label: "Student", icon: GraduationCap, color: "text-blue-600" },
  { value: "instructor", label: "Instructor", icon: BookOpen, color: "text-emerald-600" },
  { value: "governance", label: "Governance Admin", icon: Shield, color: "text-purple-600" },
]

export function RoleSwitcher() {
  const { role, setRole } = useRole()
  const router = useRouter()

  const currentRole = roles.find((r) => r.value === role) || roles[0]
  const Icon = currentRole.icon

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    router.push(defaultRoutes[newRole])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          <Icon className={`h-4 w-4 ${currentRole.color}`} />
          <span className="hidden sm:inline text-xs font-medium">{currentRole.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((r) => {
          const RIcon = r.icon
          return (
            <DropdownMenuItem
              key={r.value}
              onClick={() => handleRoleChange(r.value)}
              className="gap-2"
            >
              <RIcon className={`h-4 w-4 ${r.color}`} />
              <span>{r.label}</span>
              {role === r.value && (
                <Badge variant="secondary" className="ml-auto text-xs py-0 px-1">Active</Badge>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
