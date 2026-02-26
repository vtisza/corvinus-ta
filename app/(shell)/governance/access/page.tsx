"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/shell/PageHeader"
import { toast } from "sonner"

const capabilities = ["Chat", "File Upload", "Quiz Gen", "Summary", "Analytics View", "Admin Access"]
const roles = [
  { name: "Student", perms: [true, true, true, true, false, false] },
  { name: "Instructor", perms: [true, true, true, true, true, false] },
  { name: "TA", perms: [true, false, true, true, true, false] },
  { name: "Governance Admin", perms: [true, true, true, true, true, true] },
  { name: "Auditor", perms: [false, false, false, false, true, false] },
]

const consentTemplates = [
  { id: 1, name: "Student AI Consent", lastUpdated: "Jan 15, 2024", status: "active", description: "Consent for students to use AI assistant features, data processing, and retention." },
  { id: 2, name: "Instructor Data Agreement", lastUpdated: "Feb 1, 2024", status: "active", description: "Data processing agreement for instructors uploading course materials." },
  { id: 3, name: "Analytics Opt-in", lastUpdated: "Jan 20, 2024", status: "active", description: "Optional consent for anonymized usage analytics to improve AI quality." },
]

export default function AccessConsentPage() {
  const [editConsentOpen, setEditConsentOpen] = useState(false)
  const [selectedConsent, setSelectedConsent] = useState<typeof consentTemplates[0] | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access & Consent"
        description="Role permissions matrix, consent templates, and transparency controls"
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Access & Consent" }]}
      />

      {/* Role-permission matrix */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Role-Permission Matrix</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                {capabilities.map(c => <TableHead key={c} className="text-xs">{c}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.name}>
                  <TableCell className="font-medium text-sm">{role.name}</TableCell>
                  {role.perms.map((perm, i) => (
                    <TableCell key={i}>
                      <Switch checked={perm} onCheckedChange={() => toast.info("Permission change requires approval (mock)")} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Consent templates */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Consent Templates</h2>
        <div className="space-y-3">
          {consentTemplates.map(template => (
            <Card key={template.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{template.name}</p>
                      <Badge variant="secondary" className="text-xs">{template.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: {template.lastUpdated}</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-7 flex-shrink-0" onClick={() => { setSelectedConsent(template); setEditConsentOpen(true) }}>
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transparency preview */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Student Transparency Page Preview</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-blue-50 p-4 text-sm space-y-3">
            <h3 className="font-bold text-blue-900">How Corvinus AI Works</h3>
            <div className="space-y-2 text-blue-800">
              <p><strong>What data we collect:</strong> Your questions to the AI, course materials you interact with, and anonymized usage patterns.</p>
              <p><strong>How it&apos;s used:</strong> To provide personalized learning support and improve our AI systems.</p>
              <p><strong>Your rights:</strong> You can download or delete your conversation history at any time in Settings.</p>
              <p><strong>Data location:</strong> All data is processed in EU-based servers compliant with GDPR.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit consent dialog */}
      {selectedConsent && (
        <Dialog open={editConsentOpen} onOpenChange={setEditConsentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit: {selectedConsent.name}</DialogTitle>
              <DialogDescription>Update the consent template text. Changes will require DPO approval.</DialogDescription>
            </DialogHeader>
            <Textarea defaultValue={selectedConsent.description} className="min-h-[150px]" />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditConsentOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast.success("Consent template saved for review (mock)"); setEditConsentOpen(false) }}>Save Draft</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
