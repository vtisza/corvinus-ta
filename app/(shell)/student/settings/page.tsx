"use client"

import { useState } from "react"
import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shell/PageHeader"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { toast } from "sonner"

export default function StudentSettingsPage() {
  const [shareChatContext, setShareChatContext] = useState(false)
  const [allowAnalytics, setAllowAnalytics] = useState(true)
  const [language, setLanguage] = useState("en")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <div>
      <PageHeader
        title="Settings & Privacy"
        description="Manage your preferences and data"
        breadcrumbs={[{ label: "Student Portal", href: "/student" }, { label: "Settings & Privacy" }]}
      />

      <div className="max-w-2xl space-y-6">
        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Privacy Settings</CardTitle>
            <CardDescription>Control how your data is used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Share chat context with human helpers</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Allow TAs and instructors to see your AI conversations when you request help</p>
              </div>
              <Switch checked={shareChatContext} onCheckedChange={setShareChatContext} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Allow usage analytics</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Help improve the AI by sharing anonymized usage patterns</p>
              </div>
              <Switch checked={allowAnalytics} onCheckedChange={setAllowAnalytics} />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Preferred Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hu">Magyar (Hungarian)</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Controls</CardTitle>
            <CardDescription>Manage your personal data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={() => toast.success("Data export started (mock)")}>
              <Download className="h-4 w-4" /> Download My Data
            </Button>
            <div>
              <Button variant="destructive" className="gap-2 w-full sm:w-auto" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4" /> Delete Conversation History
              </Button>
              <p className="text-xs text-muted-foreground mt-1">This will permanently delete all your AI chat history.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => toast.success("Conversation history deleted (mock)")}
        title="Delete Conversation History"
        description="This will permanently delete all your AI chat conversations. This action cannot be undone."
        confirmLabel="Delete All"
        variant="destructive"
      />
    </div>
  )
}
