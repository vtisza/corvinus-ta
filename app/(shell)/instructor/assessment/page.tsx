"use client"

import { useState } from "react"
import { Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shell/PageHeader"
import { UploadDialog } from "@/components/common/UploadDialog"
import { toast } from "sonner"

const questionBank = [
  { id: 1, question: "Define Porter's Five Forces and explain their relevance to strategic analysis.", type: "Essay", difficulty: "Medium", course: "BUS-401" },
  { id: 2, question: "Which of the following is NOT one of Porter's generic strategies?", type: "MCQ", difficulty: "Easy", course: "BUS-401" },
  { id: 3, question: "Calculate the WACC for a company with 40% equity at 12% cost and 60% debt at 6% pre-tax, with 25% tax rate.", type: "Calculation", difficulty: "Hard", course: "FIN-420" },
  { id: 4, question: "What is the key difference between deferred tax assets and liabilities?", type: "Short Answer", difficulty: "Medium", course: "ACC-201" },
]

export default function AssessmentStudioPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [difficulty, setDifficulty] = useState([50])

  return (
    <div>
      <PageHeader
        title="Assessment Studio"
        description="Create quizzes, rubrics, and AI-powered feedback across all courses"
        breadcrumbs={[{ label: "Instructor Portal", href: "/instructor" }, { label: "Assessment Studio" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz builder */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Quiz Builder</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Course</Label>
              <Select defaultValue="course-1">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="course-1">Business Strategy (BUS-401)</SelectItem>
                  <SelectItem value="course-2">Financial Accounting (ACC-201)</SelectItem>
                  <SelectItem value="course-5">Corporate Finance (FIN-420)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Difficulty: {["Easy", "Medium", "Hard"][Math.floor(difficulty[0] / 34)]}</Label>
              <Slider value={difficulty} onValueChange={setDifficulty} min={0} max={100} step={1} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Question Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Multiple choice", "Short answer", "True/False", "Essay", "Calculation"].map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox id={type} defaultChecked={type !== "Essay"} />
                    <Label htmlFor={type} className="text-xs">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={() => toast.success("Quiz generated (mock)")}>Generate Quiz</Button>
          </CardContent>
        </Card>

        {/* Feedback assistant */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Feedback Assistant</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Upload student submissions to get AI feedback suggestions.</p>
            <Button variant="outline" className="w-full gap-2" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Upload Submissions
            </Button>
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium">Balázs Kovács — submission.pdf</p>
              <p className="text-xs text-muted-foreground mt-1">AI Feedback: Good structural analysis. Balance sheet section needs more detail on contingent liabilities treatment under IFRS 37.</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" className="text-xs h-6 px-2" onClick={() => toast.success("Feedback approved (mock)")}>Approve</Button>
                <Button size="sm" variant="outline" className="text-xs h-6 px-2">Edit</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question bank */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Question Bank</CardTitle>
              <Button size="sm" className="gap-2 text-xs h-7" onClick={() => toast.success("Add question (mock)")}>
                <Plus className="h-3 w-3" /> Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {questionBank.map(q => (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{q.question}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{q.type}</Badge>
                      <Badge variant="outline" className={`text-xs ${q.difficulty === "Hard" ? "text-red-700" : q.difficulty === "Easy" ? "text-green-700" : "text-yellow-700"}`}>{q.difficulty}</Badge>
                      <Badge variant="secondary" className="text-xs">{q.course}</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => toast.success("Question edited (mock)")}>Edit</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Student Submissions" />
    </div>
  )
}
