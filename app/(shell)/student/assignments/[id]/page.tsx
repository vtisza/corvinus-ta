"use client"

import { useState, use } from "react"
import { Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { UploadDialog } from "@/components/common/UploadDialog"
import { mockAssignments } from "@/lib/mock"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

const aiHelpColors: Record<string, string> = {
  none: "bg-gray-100 text-gray-800",
  hints: "bg-yellow-100 text-yellow-800",
  feedback: "bg-blue-100 text-blue-800",
  full: "bg-green-100 text-green-800",
}

const aiHelpDesc: Record<string, string> = {
  none: "No AI assistance is permitted for this assignment.",
  hints: "AI may provide hints and conceptual guidance only. No complete solutions.",
  feedback: "AI may provide feedback on your work. Submit drafts for review.",
  full: "Full AI assistance is permitted. Disclosure of AI use is required.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AssignmentDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const assignment = mockAssignments.find(a => a.id === id) || mockAssignments[0]
  const [uploadOpen, setUploadOpen] = useState(false)
  const [disclosure, setDisclosure] = useState("")
  const [submitted, setSubmitted] = useState(assignment.status === "submitted")

  return (
    <div>
      <PageHeader
        title={assignment.title}
        description={`${assignment.courseTitle} · Due ${formatDate(assignment.dueDate)} · ${assignment.maxPoints} points`}
        breadcrumbs={[
          { label: "Student Portal", href: "/student" },
          { label: "Assignments", href: "/student/assignments" },
          { label: assignment.title },
        ]}
      />

      {/* AI help banner */}
      <div className={`rounded-lg p-3 mb-4 flex items-start gap-3 ${aiHelpColors[assignment.allowedAiHelp]}`}>
        <div className="text-lg">🤖</div>
        <div>
          <p className="text-sm font-semibold">AI Assistance: {assignment.allowedAiHelp.charAt(0).toUpperCase() + assignment.allowedAiHelp.slice(1)}</p>
          <p className="text-xs mt-0.5">{aiHelpDesc[assignment.allowedAiHelp]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Instructions */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Instructions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{assignment.description}</p>
            </CardContent>
          </Card>

          {/* Submission */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Your Submission</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {submitted ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">Assignment submitted successfully</p>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="w-full gap-2" onClick={() => setUploadOpen(true)}>
                    <Upload className="h-4 w-4" /> Upload Submission File
                  </Button>
                  {assignment.allowedAiHelp !== "none" && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium">AI Use Disclosure (required)</p>
                      <Textarea
                        placeholder="Describe how you used AI assistance in this assignment..."
                        value={disclosure}
                        onChange={e => setDisclosure(e.target.value)}
                        className="text-sm min-h-[80px]"
                      />
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast.success("Assignment submitted (mock)")
                      setSubmitted(true)
                    }}
                  >
                    Submit Assignment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rubric */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Rubric</CardTitle>
                <StatusBadge status={assignment.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignment.rubric.map((r, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-medium">{r.criterion}</p>
                      <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">{r.weight}%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                    {i < assignment.rubric.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">{assignment.maxPoints} points</span>
                </div>
                {assignment.points !== undefined && (
                  <div className="flex justify-between text-sm text-green-600 mt-1">
                    <span>Your grade</span>
                    <span className="font-bold">{assignment.points}/{assignment.maxPoints}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Submission" />
    </div>
  )
}
