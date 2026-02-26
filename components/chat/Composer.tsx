"use client"

import { useState } from "react"
import { Send, Paperclip, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UploadDialog } from "@/components/common/UploadDialog"
import { toast } from "sonner"

export function Composer() {
  const [value, setValue] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleSend = () => {
    if (!value.trim()) return
    toast.success("Message sent (mock)")
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t p-3 bg-background flex-shrink-0">
      <div className="flex gap-2 items-end">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this course... (Enter to send)"
          className="min-h-[60px] max-h-[120px] resize-none text-sm"
        />
        <div className="flex flex-col gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setUploadOpen(true)}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setValue("")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={handleSend}
            disabled={!value.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Attach Files" />
    </div>
  )
}
