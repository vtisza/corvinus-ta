"use client"

import { useState } from "react"
import { Plus, Edit, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { mockPolicies } from "@/lib/mock"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

const blocklist = ["write my essay", "give me exam answers", "ignore previous instructions", "jailbreak", "pretend you are"]

export default function PoliciesPage() {
  const [simulatorPrompt, setSimulatorPrompt] = useState("")
  const [simulatorResult, setSimulatorResult] = useState<{ allowed: boolean; reason: string } | null>(null)
  const [newBlockword, setNewBlockword] = useState("")
  const [blocklistItems, setBlocklistItems] = useState(blocklist)
  const [citationRequired, setCitationRequired] = useState(true)
  const [sensitiveHandling, setSensitiveHandling] = useState("warn")

  const runSimulator = () => {
    if (!simulatorPrompt.trim()) return
    const isBlocked = blocklistItems.some(b => simulatorPrompt.toLowerCase().includes(b))
    const mentionsExam = simulatorPrompt.toLowerCase().includes("exam") || simulatorPrompt.toLowerCase().includes("answer")
    setSimulatorResult({
      allowed: !isBlocked && !mentionsExam,
      reason: isBlocked
        ? `Prompt matches blocked pattern: "${blocklistItems.find(b => simulatorPrompt.toLowerCase().includes(b))}"`
        : mentionsExam
        ? "Prompt appears to request exam answers — refused per Academic Integrity policy"
        : "Prompt is compliant with all active policies",
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policies & Guardrails"
        description="Manage AI behaviour policies, guardrails, and test prompts"
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Policies & Guardrails" }]}
        action={<Button className="gap-2" onClick={() => toast.success("New policy draft created (mock)")}><Plus className="h-4 w-4" /> New Policy</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy library */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Policy Library</h2>
          {mockPolicies.map(policy => (
            <Card key={policy.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{policy.name}</p>
                      <Badge variant="outline" className="text-xs">{policy.version}</Badge>
                      <StatusBadge status={policy.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{policy.category} · Updated {formatDate(policy.updatedAt)}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{policy.content}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs flex-shrink-0 gap-1" onClick={() => toast.success("Policy editor opened (mock)")}>
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guardrails */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Guardrail Settings</h2>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground tracking-wide">Sensitive Topics</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Global Citation Requirement</Label>
                <Switch checked={citationRequired} onCheckedChange={setCitationRequired} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sensitive Topics Handling</Label>
                <Select value={sensitiveHandling} onValueChange={setSensitiveHandling}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Block entirely</SelectItem>
                    <SelectItem value="warn">Warn and allow</SelectItem>
                    <SelectItem value="redirect">Redirect to support</SelectItem>
                    <SelectItem value="allow">Allow with citation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground tracking-wide">Blocklist</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add phrase to block..."
                  value={newBlockword}
                  onChange={e => setNewBlockword(e.target.value)}
                  className="h-8 text-sm flex-1"
                  onKeyDown={e => {
                    if (e.key === "Enter" && newBlockword.trim()) {
                      setBlocklistItems(prev => [...prev, newBlockword.trim()])
                      setNewBlockword("")
                    }
                  }}
                />
                <Button size="sm" className="h-8" onClick={() => {
                  if (newBlockword.trim()) {
                    setBlocklistItems(prev => [...prev, newBlockword.trim()])
                    setNewBlockword("")
                    toast.success("Added to blocklist (mock)")
                  }
                }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blocklistItems.map(item => (
                  <Badge key={item} variant="secondary" className="text-xs gap-1 cursor-pointer" onClick={() => setBlocklistItems(prev => prev.filter(b => b !== item))}>
                    {item} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policy Simulator */}
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" /> Policy Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={simulatorPrompt}
                onChange={e => setSimulatorPrompt(e.target.value)}
                placeholder="Enter a test prompt to check against active policies..."
                className="text-sm min-h-[80px]"
              />
              <Button className="w-full gap-2" onClick={runSimulator} disabled={!simulatorPrompt.trim()}>
                Run Simulation
              </Button>
              {simulatorResult && (
                <div className={`rounded-lg border p-3 ${simulatorResult.allowed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={simulatorResult.allowed ? "secondary" : "destructive"} className="text-xs">
                      {simulatorResult.allowed ? "✓ Allowed" : "✗ Refused"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{simulatorResult.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
