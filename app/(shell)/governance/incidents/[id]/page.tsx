"use client"

import { useState, use } from "react"
import { Save, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Timeline } from "@/components/common/Timeline"
import { UploadDialog } from "@/components/common/UploadDialog"
import { mockIncidents } from "@/lib/mock"
import { formatDateTime } from "@/lib/utils"
import { toast } from "sonner"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function IncidentDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const incident = mockIncidents.find(i => i.id === id) || mockIncidents[0]
  const [status, setStatus] = useState(incident.status)
  const [note, setNote] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [postmortem, setPostmortem] = useState(incident.postmortem || {
    summary: "",
    rootCause: "",
    impact: "",
    mitigation: "",
    followUps: "",
  })

  const severityBorderColor = {
    low: "border-l-blue-500",
    medium: "border-l-yellow-500",
    high: "border-l-orange-500",
    critical: "border-l-red-500",
  }[incident.severity] || "border-l-gray-400"

  return (
    <div>
      <PageHeader
        title={incident.title}
        description={`${incident.category} · ${incident.affectedCourses.length} course(s) affected · Created ${formatDateTime(incident.createdAt)}`}
        breadcrumbs={[
          { label: "Governance", href: "/governance" },
          { label: "Incidents", href: "/governance/incidents" },
          { label: `INC-${incident.id.split("-")[1]}` },
        ]}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={incident.severity} />
            <Select value={status} onValueChange={(v: typeof status) => { setStatus(v); toast.success("Status updated (mock)") }}>
              <SelectTrigger className="w-36 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className={`border-l-4 ${severityBorderColor}`}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{incident.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {incident.affectedCourses.map(courseId => (
                  <Badge key={courseId} variant="outline" className="text-xs">{courseId}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Timeline</CardTitle></CardHeader>
            <CardContent>
              <Timeline events={incident.timeline} />
            </CardContent>
          </Card>

          {/* Postmortem */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Postmortem</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: "summary", label: "Summary" },
                { key: "rootCause", label: "Root Cause" },
                { key: "impact", label: "Impact" },
                { key: "mitigation", label: "Mitigation Steps" },
                { key: "followUps", label: "Follow-up Actions" },
              ].map(field => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-xs font-medium">{field.label}</Label>
                  <Textarea
                    value={postmortem[field.key as keyof typeof postmortem]}
                    onChange={e => setPostmortem(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={`Describe ${field.label.toLowerCase()}...`}
                    className="text-sm min-h-[60px]"
                  />
                </div>
              ))}
              <Button className="gap-2" onClick={() => toast.success("Postmortem saved (mock)")}>
                <Save className="h-4 w-4" /> Save Postmortem
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Assign Owner</Label>
                <Select defaultValue={incident.owner || "unassigned"}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="dpo">Data Protection Officer</SelectItem>
                    <SelectItem value="dr-varga">Dr. Katalin Varga</SelectItem>
                    <SelectItem value="prof-szabo">Prof. Gábor Szabo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs">Add Note</Label>
                <Textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note to the timeline..."
                  className="text-sm min-h-[70px]"
                />
                <Button size="sm" className="w-full gap-2 text-xs" onClick={() => { toast.success("Note added (mock)"); setNote("") }}>
                  <Plus className="h-3 w-3" /> Add Note
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => setUploadOpen(true)}>
                <Upload className="h-3 w-3" /> Attach File
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Incident ID", value: incident.id.toUpperCase() },
                { label: "Category", value: incident.category },
                { label: "Owner", value: incident.owner || "Unassigned" },
                { label: "Created", value: formatDateTime(incident.createdAt) },
                { label: "Last updated", value: formatDateTime(incident.updatedAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{label}</span>
                  <span className="text-xs font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Attach File to Incident" />
    </div>
  )
}
