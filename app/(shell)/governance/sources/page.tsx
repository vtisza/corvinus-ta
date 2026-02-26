"use client"

import { RefreshCw, Settings, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { mockConnectors } from "@/lib/mock"
import { formatDateTime } from "@/lib/utils"
import { toast } from "sonner"

const sourceInventory = [
  { name: "BUS-401 Lecture Slides", course: "Business Strategy", classification: "Internal", permSync: "synced", docs: 48 },
  { name: "Corvinus Library — Strategy", course: "Business Strategy", classification: "Licensed", permSync: "synced", docs: 234 },
  { name: "ACC-201 Course Materials", course: "Financial Accounting", classification: "Internal", permSync: "synced", docs: 67 },
  { name: "IFRS Standards Database", course: "Financial Accounting", classification: "Public", permSync: "partial", docs: 1240 },
  { name: "EU Law Repository", course: "European Economic Law", classification: "Public", permSync: "synced", docs: 892 },
]

const connectorIcons: Record<string, string> = {
  lms: "🎓",
  drive: "📁",
  library: "📚",
  upload: "⬆️",
}

export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Sources"
        description="Manage connectors, source inventory, and data retention"
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Knowledge Sources" }]}
      />

      {/* Connectors */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Source Connectors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockConnectors.map(connector => (
            <Card key={connector.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{connectorIcons[connector.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{connector.name}</p>
                      <StatusBadge status={connector.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{connector.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{connector.documentsCount.toLocaleString()} docs</span>
                      {connector.lastSync && <span>Last sync: {formatDateTime(connector.lastSync)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast.success("Sync started (mock)")}>
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast.success("Connector settings (mock)")}>
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Source inventory */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Source Inventory</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Permission Sync</TableHead>
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourceInventory.map(s => (
                <TableRow key={s.name}>
                  <TableCell className="font-medium text-sm">{s.name}</TableCell>
                  <TableCell className="text-sm">{s.course}</TableCell>
                  <TableCell>
                    <Badge variant={s.classification === "Internal" ? "secondary" : "outline"} className="text-xs">{s.classification}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${s.permSync === "synced" ? "text-green-700 border-green-300" : "text-yellow-700 border-yellow-300"}`}>
                      {s.permSync}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{s.docs.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Retention settings */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Retention Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Student conversation history", value: "90" },
            { label: "Audit log retention", value: "365" },
            { label: "Uploaded documents", value: "semester" },
          ].map(setting => (
            <div key={setting.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label className="text-sm sm:flex-1">{setting.label}</Label>
              <Select defaultValue={setting.value}>
                <SelectTrigger className="w-full sm:w-40 text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="semester">End of semester</SelectItem>
                  <SelectItem value="forever">Indefinitely</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button className="mt-2" onClick={() => toast.success("Retention settings saved (mock)")}>Save Retention Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
