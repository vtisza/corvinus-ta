"use client"

import { Bot, User } from "lucide-react"
import { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MessageActions } from "./MessageActions"
import { Badge } from "@/components/ui/badge"

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Start a conversation</p>
          <p className="text-xs text-muted-foreground mt-1">Ask a question about your course material</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
          {/* Avatar */}
          <div className={cn(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium",
            msg.role === "user" ? "bg-primary" : "bg-gradient-to-br from-purple-500 to-blue-600"
          )}>
            {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>

          <div className={cn("max-w-[78%] space-y-1", msg.role === "user" ? "items-end" : "items-start")}>
            {/* Bubble */}
            <div className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted rounded-tl-sm"
            )}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>

            {/* Citations */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="flex flex-wrap gap-1 px-1">
                {msg.citations.map((c) => (
                  <Badge key={c.id} variant="outline" className="text-[10px] gap-1">
                    <span className="font-medium">[{c.confidence > 0.9 ? "high" : "med"}]</span>
                    {c.source}
                  </Badge>
                ))}
              </div>
            )}

            {/* Message actions (only for assistant) */}
            {msg.role === "assistant" && <MessageActions />}
          </div>
        </div>
      ))}
    </div>
  )
}
