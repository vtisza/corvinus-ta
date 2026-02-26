"use client"

import { useState } from "react"
import { Plus, BookOpen, Bot, Lightbulb, GraduationCap, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { mockThreads, mockMessages } from "@/lib/mock"
import { MessageList } from "./MessageList"
import { Composer } from "./Composer"
import { SourcesPanel } from "./SourcesPanel"

const modes = [
  { value: "explain", label: "Explain", icon: Lightbulb },
  { value: "tutor", label: "Tutor (Socratic)", icon: GraduationCap },
  { value: "exam", label: "Exam Mode", icon: BookOpen },
] as const

interface ChatLayoutProps {
  courseId?: string
}

function ThreadList({
  threads,
  activeThreadId,
  onSelect,
}: {
  threads: typeof mockThreads
  activeThreadId: string
  onSelect: (id: string) => void
}) {
  return (
    <>
      <div className="p-3 border-b">
        <Button size="sm" className="w-full gap-2 text-xs h-8">
          <Plus className="h-3 w-3" />
          New Thread
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {(threads.length > 0 ? threads : mockThreads.slice(0, 3)).map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelect(thread.id)}
            className={cn(
              "w-full text-left rounded-md px-2 py-2 transition-colors",
              activeThreadId === thread.id
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <p className="text-xs font-medium line-clamp-2">{thread.title}</p>
            <p className="text-[10px] mt-0.5 opacity-60 line-clamp-1">{thread.lastMessage}</p>
            <Badge variant="outline" className="text-[10px] mt-1 h-4 px-1 py-0 capitalize">
              {thread.mode}
            </Badge>
          </button>
        ))}
      </div>
    </>
  )
}

export function ChatLayout({ courseId }: ChatLayoutProps) {
  const threads = mockThreads.filter((t) => !courseId || t.courseId === courseId)
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id || "thread-1")
  const [mode, setMode] = useState<"explain" | "tutor" | "exam">("explain")
  const [threadsOpen, setThreadsOpen] = useState(false)

  const messages = mockMessages.filter((m) => m.threadId === activeThreadId)

  const handleThreadSelect = (id: string) => {
    setActiveThreadId(id)
    setThreadsOpen(false)
  }

  return (
    <div className="flex gap-0 h-[calc(100vh-10rem)] rounded-xl border overflow-hidden bg-background">
      {/* Left: Thread list — hidden on mobile, visible sm+ */}
      <div className="w-52 flex-shrink-0 border-r flex-col bg-muted/20 hidden sm:flex">
        <ThreadList threads={threads} activeThreadId={activeThreadId} onSelect={handleThreadSelect} />
      </div>

      {/* Center: Conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mode selector */}
        <div className="flex items-center gap-1.5 p-2 sm:p-3 border-b bg-background flex-shrink-0 flex-wrap">
          {/* Mobile: threads toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:hidden flex-shrink-0"
            onClick={() => setThreadsOpen(true)}
            aria-label="Open thread list"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
          {modes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                mode === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
          <Badge variant="outline" className="ml-auto text-xs flex items-center gap-1 flex-shrink-0">
            <Bot className="h-3 w-3" />
            <span className="hidden sm:inline">claude-3.5-sonnet</span>
            <span className="sm:hidden">claude</span>
          </Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} />
        </div>

        {/* Composer */}
        <Composer />
      </div>

      {/* Right: Sources panel */}
      <div className="w-64 flex-shrink-0 border-l hidden lg:flex flex-col">
        <SourcesPanel citations={messages.flatMap((m) => m.citations || [])} />
      </div>

      {/* Mobile: Thread list sheet */}
      <Sheet open={threadsOpen} onOpenChange={setThreadsOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetTitle className="sr-only">Conversations</SheetTitle>
          <div className="flex flex-col h-full bg-muted/20">
            <ThreadList threads={threads} activeThreadId={activeThreadId} onSelect={handleThreadSelect} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
