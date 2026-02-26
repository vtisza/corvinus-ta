"use client"

import { useState } from "react"
import { Plus, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { mockModels } from "@/lib/mock"
import { toast } from "sonner"

export default function ModelsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [disableTarget, setDisableTarget] = useState<string | null>(null)

  const envProfiles = [
    { name: "Production", models: ["Claude 3.5 Sonnet", "Claude 3 Haiku", "GPT-4o mini"], status: "active" },
    { name: "Staging", models: ["GPT-4o", "Mistral Large"], status: "active" },
    { name: "Evaluation", models: ["Gemini 1.5 Flash", "Mistral Large"], status: "active" },
  ]

  return (
    <div>
      <PageHeader
        title="Models & Providers"
        description="Manage AI model access, environments, and approval status"
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Models & Providers" }]}
        action={
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Model
          </Button>
        }
      />

      {/* Models table */}
      <Card className="mb-6">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost/1k tokens</TableHead>
                <TableHead>Avg Latency</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockModels.map(model => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{model.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{model.provider}</TableCell>
                  <TableCell className="text-sm">{model.region}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">{model.environment}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={model.status} /></TableCell>
                  <TableCell className="text-sm font-mono">${model.costPer1kTokens}</TableCell>
                  <TableCell className="text-sm">{model.avgLatencyMs}ms</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {model.status !== "active" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 border-green-300" onClick={() => toast.success(`${model.name} approved (mock)`)}>Approve</Button>
                      )}
                      {model.status === "active" && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => setDisableTarget(model.id)}>Disable</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Environment profiles */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Environment Profiles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {envProfiles.map(profile => (
            <Card key={profile.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{profile.name}</CardTitle>
                  <StatusBadge status={profile.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {profile.models.map(m => (
                    <div key={m} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <p className="text-xs text-muted-foreground">{m}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add model dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Model</DialogTitle>
            <DialogDescription>Register a new AI model for evaluation or production use.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Model Name</Label>
              <Input placeholder="e.g. Claude 3 Opus" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Provider</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select provider..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="mistral">Mistral AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Region</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select EU region..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eu-frankfurt">EU (Frankfurt)</SelectItem>
                  <SelectItem value="eu-ireland">EU (Ireland)</SelectItem>
                  <SelectItem value="eu-paris">EU (Paris)</SelectItem>
                  <SelectItem value="eu-stockholm">EU (Stockholm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Model added for evaluation (mock)"); setAddOpen(false) }}>Add Model</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!disableTarget}
        onClose={() => setDisableTarget(null)}
        onConfirm={() => toast.success("Model disabled (mock)")}
        title="Disable Model"
        description="This will immediately remove the model from active use. Students will be routed to fallback models."
        confirmLabel="Disable"
        variant="destructive"
      />
    </div>
  )
}
