"use client"

import { useState } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  accept?: string
}

export function UploadDialog({ open, onClose, title = "Upload Files", description, accept = "*" }: UploadDialogProps) {
  const [files, setFiles] = useState<string[]>([])

  const handleAddFile = () => {
    const name = `document_${files.length + 1}.pdf`
    setFiles((prev) => [...prev, name])
  }

  const handleRemove = (name: string) => {
    setFiles((prev) => prev.filter((f) => f !== name))
  }

  const handleUpload = () => {
    toast.success(`${files.length || 1} file(s) uploaded (mock)`)
    setFiles([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={handleAddFile}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Click to add files</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLSX up to 50MB</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f) => (
              <div key={f} className="flex items-center gap-2 p-2 rounded border bg-muted/20">
                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{f}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(f)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
