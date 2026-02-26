"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { mockIncidents, mockCourses } from "@/lib/mock"
import { formatDateTime } from "@/lib/utils"
import { toast } from "sonner"

const severityColors: Record<string, string> = {
  low: "text-blue-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  critical: "text-red-500",
}

const statusColumns = ["new", "investigating", "mitigated", "closed"] as const

export default function IncidentsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [severity, setSeverity] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban")

  return (
    <div>
      <PageHeader
        title="Incidents"
        description={`${mockIncidents.filter(i => i.status !== "closed").length} active · ${mockIncidents.filter(i => i.status === "closed").length} closed`}
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Incidents" }]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setViewMode(viewMode === "kanban" ? "table" : "kanban")}>
              {viewMode === "kanban" ? "Table view" : "Kanban view"}
            </Button>
            <Button className="gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> Create Incident
            </Button>
          </div>
        }
      />

      {viewMode === "kanban" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusColumns.map(status => {
            const incidents = mockIncidents.filter(i => i.status === status)
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide capitalize text-muted-foreground">{status}</p>
                  <Badge variant="secondary" className="text-xs">{incidents.length}</Badge>
                </div>
                <div className="space-y-2">
                  {incidents.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-center">
                      <p className="text-xs text-muted-foreground">No {status} incidents</p>
                    </div>
                  ) : (
                    incidents.map(inc => (
                      <Card key={inc.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${severityColors[inc.severity]}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium line-clamp-2">{inc.title}</p>
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                <StatusBadge status={inc.severity} />
                                <Badge variant="outline" className="text-[10px]">{inc.category}</Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1">{formatDateTime(inc.createdAt)}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="w-full mt-2 text-xs h-6" asChild>
                            <Link href={`/governance/incidents/${inc.id}`}>View Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Title</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Severity</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Created</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {mockIncidents.map(inc => (
                  <tr key={inc.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 text-sm font-medium">{inc.title}</td>
                    <td className="p-3"><StatusBadge status={inc.severity} /></td>
                    <td className="p-3"><StatusBadge status={inc.status} /></td>
                    <td className="p-3"><Badge variant="outline" className="text-xs">{inc.category}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDateTime(inc.createdAt)}</td>
                    <td className="p-3">
                      <Button size="sm" variant="ghost" className="text-xs h-7" asChild>
                        <Link href={`/governance/incidents/${inc.id}`}>Open</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Create incident dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Incident</DialogTitle>
            <DialogDescription>Document a new AI-related incident for investigation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger><SelectValue placeholder="Select severity..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic-integrity">Academic Integrity</SelectItem>
                  <SelectItem value="hallucination">Hallucination</SelectItem>
                  <SelectItem value="data-privacy">Data Privacy</SelectItem>
                  <SelectItem value="bias">Bias/Fairness</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="content-quality">Content Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Affected Courses</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select courses..." /></SelectTrigger>
                <SelectContent>
                  {mockCourses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what happened..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Incident created (mock)"); setCreateOpen(false) }}>Create Incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
