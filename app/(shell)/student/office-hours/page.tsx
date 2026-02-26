"use client"

import { useState } from "react"
import { MessageSquare, Calendar, HelpCircle, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shell/PageHeader"
import { toast } from "sonner"

const slots = [
  { id: 1, date: "Mon, Mar 18", time: "10:00–11:00", instructor: "Dr. Katalin Varga", course: "Business Strategy", type: "Virtual", available: 3 },
  { id: 2, date: "Tue, Mar 19", time: "14:00–15:00", instructor: "Prof. Gábor Szabo", course: "Financial Accounting", type: "In-person", available: 1 },
  { id: 3, date: "Wed, Mar 20", time: "09:00–10:00", instructor: "TA: Márton Bak", course: "Business Strategy", type: "Virtual", available: 5 },
  { id: 4, date: "Thu, Mar 21", time: "11:00–12:00", instructor: "Dr. Éva Horváth", course: "Digital Marketing", type: "Virtual", available: 2 },
  { id: 5, date: "Fri, Mar 22", time: "15:00–16:00", instructor: "Prof. Péter Molnár", course: "Corporate Finance", type: "In-person", available: 0 },
]

export default function OfficeHoursPage() {
  const [aiQuery, setAiQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [includeChatContext, setIncludeChatContext] = useState(true)
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div>
      <PageHeader
        title="Office Hours"
        description="Get help from AI first, then escalate to instructors or TAs"
        breadcrumbs={[{ label: "Student Portal", href: "/student" }, { label: "Office Hours" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI first */}
        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Ask the AI First
              </CardTitle>
              <CardDescription className="text-xs">The AI can answer most questions instantly — no waiting!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Describe your question or problem..."
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                className="min-h-[100px] text-sm bg-white"
              />
              <Button
                className="w-full gap-2"
                onClick={() => {
                  if (!aiQuery.trim()) return
                  toast.success("AI response generated (mock)")
                  setAiQuery("")
                }}
              >
                <HelpCircle className="h-4 w-4" />
                Ask AI Assistant
              </Button>
            </CardContent>
          </Card>

          {/* Escalation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Still need help?</CardTitle>
              <CardDescription className="text-xs">Request a session with a TA or instructor</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2" onClick={() => setDialogOpen(true)}>
                <Calendar className="h-4 w-4" />
                Request TA/Instructor Help
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Booking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slots.map(slot => (
                <div key={slot.id} className={`rounded-lg border p-3 ${slot.available === 0 ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{slot.date}, {slot.time}</p>
                      <p className="text-xs text-muted-foreground">{slot.instructor} · {slot.course}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{slot.type}</Badge>
                        <span className="text-xs text-muted-foreground">{slot.available} spots left</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="text-xs h-7 flex-shrink-0"
                      disabled={slot.available === 0}
                      onClick={() => toast.success(`Booked: ${slot.date} ${slot.time} (mock)`)}
                    >
                      {slot.available === 0 ? "Full" : "Book"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help request dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Help from Instructor/TA</DialogTitle>
            <DialogDescription>Describe your issue and we'll match you with the right person.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger><SelectValue placeholder="Select topic..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="assignment">Assignment help</SelectItem>
                <SelectItem value="concept">Concept clarification</SelectItem>
                <SelectItem value="exam">Exam preparation</SelectItem>
                <SelectItem value="grade">Grade inquiry</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Describe your question or concern in detail..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex items-center gap-2">
              <Switch checked={includeChatContext} onCheckedChange={setIncludeChatContext} id="chat-context" />
              <Label htmlFor="chat-context" className="text-sm">Include my recent AI chat context</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Help request submitted (mock)"); setDialogOpen(false) }}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
