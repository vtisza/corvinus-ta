"use client"

import { BookOpen, ZoomIn, ZoomOut, HelpCircle, CheckSquare, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const actions = [
  { icon: BookOpen, label: "Show sources", action: "Sources shown (mock)" },
  { icon: ZoomOut, label: "Explain simpler", action: "Simplified explanation (mock)" },
  { icon: ZoomIn, label: "Explain deeper", action: "Deeper explanation (mock)" },
  { icon: HelpCircle, label: "Practice questions", action: "Practice questions generated (mock)" },
  { icon: CheckSquare, label: "Check my answer", action: "Answer checked (mock)" },
  { icon: Flag, label: "Flag as wrong", action: "Flagged for review (mock)" },
]

export function MessageActions() {
  return (
    <div className="flex flex-wrap gap-1 px-1">
      {actions.map(({ icon: Icon, label, action }) => (
        <Button
          key={label}
          variant="ghost"
          size="sm"
          className="h-6 text-[10px] px-2 gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => toast.success(action)}
        >
          <Icon className="h-3 w-3" />
          {label}
        </Button>
      ))}
    </div>
  )
}
