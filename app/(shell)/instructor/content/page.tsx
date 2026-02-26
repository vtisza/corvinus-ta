"use client"

import { useState } from "react"
import { Upload, Eye, Folder, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shell/PageHeader"
import { UploadDialog } from "@/components/common/UploadDialog"
import { toast } from "sonner"

const folders = [
  { name: "Business Strategy", files: 12, size: "45 MB" },
  { name: "Financial Accounting", files: 18, size: "67 MB" },
  { name: "Digital Marketing", files: 9, size: "23 MB" },
  { name: "Organizational Behavior", files: 14, size: "38 MB" },
  { name: "Corporate Finance", files: 11, size: "52 MB" },
  { name: "European Economic Law", files: 7, size: "19 MB" },
]

const recentFiles = [
  { name: "Week 4 Dynamic Capabilities Slides.pdf", course: "Business Strategy", uploaded: "Mar 12", size: "3.2 MB", status: "indexed" },
  { name: "IFRS 16 Case Study.docx", course: "Financial Accounting", uploaded: "Mar 11", size: "1.1 MB", status: "indexing" },
  { name: "GA4 Attribution Models.pptx", course: "Digital Marketing", uploaded: "Mar 10", size: "5.8 MB", status: "indexed" },
  { name: "DCF Model Template.xlsx", course: "Corporate Finance", uploaded: "Mar 9", size: "2.4 MB", status: "indexed" },
]

export default function ContentStudioPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [search, setSearch] = useState("")

  return (
    <div>
      <PageHeader
        title="Content Studio"
        description="Manage all course materials and knowledge base across your courses"
        breadcrumbs={[{ label: "Instructor Portal", href: "/instructor" }, { label: "Content Studio" }]}
        action={
          <Button className="gap-2" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" /> Upload Materials
          </Button>
        }
      />

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search materials..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Folder list */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Course Folders</h2>
          <div className="space-y-2">
            {folders.map(f => (
              <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors">
                <Folder className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.files} files · {f.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold">Recent Files</h2>
          <div className="space-y-2">
            {recentFiles.map(f => (
              <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg border">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">{f.course}</p>
                    <span className="text-xs text-muted-foreground">·</span>
                    <p className="text-xs text-muted-foreground">{f.uploaded}</p>
                    <span className="text-xs text-muted-foreground">·</span>
                    <p className="text-xs text-muted-foreground">{f.size}</p>
                  </div>
                </div>
                <Badge variant={f.status === "indexed" ? "secondary" : "outline"} className="text-xs flex-shrink-0">
                  {f.status}
                </Badge>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success("Preview (mock)")}>
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Course Materials" />
    </div>
  )
}
