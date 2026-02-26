"use client"

import { useState } from "react"
import { Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/shell/PageHeader"
import { RightDrawer } from "@/components/shell/RightDrawer"
import { mockAuditLog } from "@/lib/mock"
import { AuditLogEntry } from "@/lib/types"
import { formatDateTime } from "@/lib/utils"
import { toast } from "sonner"

export default function AuditLogPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = mockAuditLog.filter(entry => {
    const matchSearch = !search || entry.userName.toLowerCase().includes(search.toLowerCase()) || entry.action.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || entry.role === roleFilter
    const matchFlagged = !flaggedOnly || entry.flagged
    return matchSearch && matchRole && matchFlagged
  })

  const openDetail = (entry: AuditLogEntry) => {
    setSelectedEntry(entry)
    setDrawerOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description={`${mockAuditLog.length} entries · ${mockAuditLog.filter(e => e.flagged).length} flagged`}
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Audit Log" }]}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search user or action..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
            <SelectItem value="governance">Governance</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Switch checked={flaggedOnly} onCheckedChange={setFlaggedOnly} id="flagged-filter" />
          <Label htmlFor="flagged-filter" className="text-sm">Flagged only</Label>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 20).map(entry => (
                <TableRow key={entry.id} className={entry.flagged ? "bg-red-50" : ""}>
                  <TableCell className="text-xs font-mono whitespace-nowrap">{formatDateTime(entry.timestamp)}</TableCell>
                  <TableCell className="text-sm">{entry.userName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">{entry.role}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{entry.courseName || "—"}</TableCell>
                  <TableCell className="text-sm">{entry.action}</TableCell>
                  <TableCell className="text-xs font-mono">{entry.model}</TableCell>
                  <TableCell>
                    {entry.flagged && <Badge variant="destructive" className="text-xs">Flagged</Badge>}
                    {entry.hasCitations && <Badge variant="secondary" className="text-xs ml-1">Cited</Badge>}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => openDetail(entry)}>
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail drawer */}
      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Audit Entry Detail"
        description={selectedEntry?.action}
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { label: "User", value: selectedEntry.userName },
                { label: "Role", value: selectedEntry.role },
                { label: "Action", value: selectedEntry.action },
                { label: "Model", value: selectedEntry.model },
                { label: "Course", value: selectedEntry.courseName || "—" },
                { label: "Timestamp", value: formatDateTime(selectedEntry.timestamp) },
                { label: "Flagged", value: selectedEntry.flagged ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-24 flex-shrink-0">{label}</span>
                  <span className="text-xs">{value}</span>
                </div>
              ))}
            </div>
            {selectedEntry.prompt && (
              <div>
                <p className="text-xs font-medium mb-1">User Prompt</p>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs">{selectedEntry.prompt}</p>
                </div>
              </div>
            )}
            {selectedEntry.response && (
              <div>
                <p className="text-xs font-medium mb-1">AI Response (excerpt)</p>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs">{selectedEntry.response}</p>
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full text-xs gap-2" onClick={() => toast.success("Entry exported (mock)")}>
              Export Entry
            </Button>
          </div>
        )}
      </RightDrawer>
    </div>
  )
}
