import { CheckCircle2, AlertCircle, MessageSquare, Circle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateTime } from "@/lib/utils"

interface TimelineEvent {
  id: string
  timestamp: string
  type: "created" | "updated" | "note" | "mitigated" | "closed"
  description: string
  author: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

const typeConfig = {
  created: { icon: Circle, color: "text-blue-500 bg-blue-50 border-blue-200" },
  updated: { icon: AlertCircle, color: "text-yellow-500 bg-yellow-50 border-yellow-200" },
  note: { icon: MessageSquare, color: "text-gray-500 bg-gray-50 border-gray-200" },
  mitigated: { icon: CheckCircle2, color: "text-orange-500 bg-orange-50 border-orange-200" },
  closed: { icon: XCircle, color: "text-green-500 bg-green-50 border-green-200" },
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {events.map((event, idx) => {
          const config = typeConfig[event.type] || typeConfig.note
          const Icon = config.icon
          return (
            <div key={event.id} className="flex gap-3 relative pl-10">
              <div className={cn(
                "absolute left-2 top-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center",
                config.color
              )}>
                <Icon className="h-2.5 w-2.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{event.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{event.author}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
