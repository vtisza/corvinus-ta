"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { mockQnaPosts } from "@/lib/mock"
import { toast } from "sonner"

export default function QnAHubPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = mockQnaPosts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || p.status === filter || (filter === "trending" && p.trending)
    return matchSearch && matchFilter
  })

  return (
    <div>
      <PageHeader
        title="Q&A Hub"
        description="Moderate student questions across all your courses"
        breadcrumbs={[{ label: "Instructor Portal", href: "/instructor" }, { label: "Q&A Hub" }]}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search questions..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "open", "answered", "trending"].map(f => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="text-xs h-8 capitalize" onClick={() => setFilter(f)}>
              {f === "all" ? `All (${mockQnaPosts.length})` : f}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(post => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{post.title}</p>
                    <StatusBadge status={post.status} />
                    {post.trending && <Badge variant="secondary" className="text-xs">Trending</Badge>}
                    <Badge variant="outline" className="text-xs">{post.courseTitle}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{post.author} · {post.repliesCount} replies · {post.views} views</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.body}</p>
                  {post.aiSuggestedAnswer && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-blue-700">AI Suggested Answer:</p>
                      <Textarea defaultValue={post.aiSuggestedAnswer} className="text-xs min-h-[60px]" />
                      <div className="flex gap-2">
                        <Button size="sm" className="text-xs h-7" onClick={() => toast.success("Answer posted (mock)")}>Post Answer</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.success("Pinned (mock)")}>Pin</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
