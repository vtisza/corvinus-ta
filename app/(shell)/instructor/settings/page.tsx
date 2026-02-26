"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shell/PageHeader"
import { toast } from "sonner"

export default function InstructorSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings & Policy"
        description="Manage your instructor profile and global AI policy settings"
        breadcrumbs={[{ label: "Instructor Portal", href: "/instructor" }, { label: "Settings & Policy" }]}
      />

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">First Name</Label>
                <Input defaultValue="Katalin" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Last Name</Label>
                <Input defaultValue="Varga" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input defaultValue="katalin.varga@uni-corvinus.hu" />
            </div>
            <Button onClick={() => toast.success("Profile updated (mock)")}>Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Global AI Settings</CardTitle>
            <CardDescription>These settings apply across all your courses unless overridden per course.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Require citation in all AI responses", desc: "AI must cite sources for all factual claims" },
              { label: "Enable student analytics sharing", desc: "Allow students to see their usage statistics" },
              { label: "AI escalation notifications", desc: "Get notified when AI escalates to human help" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">{s.label}</Label>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
            <Button onClick={() => toast.success("Settings saved (mock)")}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
