"use client"

import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RoleSwitcher } from "./RoleSwitcher"
import { toast } from "sonner"

const notifications = [
  { id: 1, title: "New Q&A reply", body: "Your question about Porter's Five Forces was answered", time: "5m ago", unread: true },
  { id: 2, title: "Assignment graded", body: "Your Google Analytics Report received 52/60 points", time: "1h ago", unread: true },
  { id: 3, title: "Course announcement", body: "Business Strategy: Guest lecture on March 20", time: "3h ago", unread: false },
  { id: 4, title: "Office hours available", body: "Dr. Varga has new slots on Friday afternoon", time: "1d ago", unread: false },
]

export function Topbar() {
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white px-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#003366] to-[#0055a4] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">CU</span>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-[#003366] leading-tight">Corvinus</p>
            <p className="text-[10px] text-muted-foreground leading-tight">AI Teaching Assistant</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-auto hidden sm:flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search courses, docs, policies..."
            className="pl-8 h-8 text-xs bg-muted/40 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        <RoleSwitcher />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-sm font-medium">{n.title}</span>
                  {n.unread && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">{n.body}</span>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-xs text-primary justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar/Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 px-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">AT</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-xs">Anna Tóth</span>
              <ChevronDown className="h-3 w-3 opacity-50 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">Anna Tóth</p>
                <p className="text-xs text-muted-foreground">anna.toth@stud.uni-corvinus.hu</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => toast.info("Sign out (mock)")}>
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
