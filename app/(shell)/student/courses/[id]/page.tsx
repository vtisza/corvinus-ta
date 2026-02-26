"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Bot, Upload, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/shell/PageHeader"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { StatusBadge } from "@/components/common/StatusBadge"
import { mockCourses, mockAssignments, mockQnaPosts } from "@/lib/mock"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CourseSpacePage({ params }: PageProps) {
  const { id } = use(params)
  const course = mockCourses.find(c => c.id === id) || mockCourses[0]
  const assignments = mockAssignments.filter(a => a.courseId === id)
  const qnaPosts = mockQnaPosts.filter(q => q.courseId === id)
  const [qnaDialogOpen, setQnaDialogOpen] = useState(false)
  const [qnaTitle, setQnaTitle] = useState("")
  const [qnaBody, setQnaBody] = useState("")

  const materials = [
    { name: "Lecture Slides — Week 1", type: "pdf", size: "2.4 MB" },
    { name: "Lecture Slides — Week 2", type: "pdf", size: "3.1 MB" },
    { name: "Required Reading: Porter (2008)", type: "pdf", size: "8.7 MB" },
    { name: "Case Study: Apple Strategy", type: "docx", size: "1.2 MB" },
    { name: "Tutorial Recording — Week 3", type: "mp4", size: "145 MB" },
    { name: "Assignment 1 Brief", type: "pdf", size: "0.5 MB" },
  ]

  return (
    <div>
      <PageHeader
        title={course.title}
        description={`${course.code} · ${course.instructor} · ${course.credits} ECTS · ${course.enrolledCount} students`}
        breadcrumbs={[
          { label: "Student Portal", href: "/student" },
          { label: "My Courses", href: "/student/courses" },
          { label: course.title },
        ]}
        action={
          <Button asChild className="gap-2">
            <Link href={`/student/courses/${id}?tab=assistant`}>
              <Bot className="h-4 w-4" /> Open Assistant
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assistant">Assistant</TabsTrigger>
          <TabsTrigger value="qna">Q&A {qnaPosts.length > 0 && `(${qnaPosts.length})`}</TabsTrigger>
          <TabsTrigger value="assignments">Assignments {assignments.length > 0 && `(${assignments.length})`}</TabsTrigger>
          <TabsTrigger value="office-hours">Office Hours</TabsTrigger>
          <TabsTrigger value="policy">Course Policy</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Your Progress</p>
                <p className="text-2xl font-bold mt-1">{course.progress}%</p>
                <Progress value={course.progress} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Next Deadline</p>
                <p className="text-sm font-semibold mt-1">{course.nextDeadlineTitle}</p>
                <p className="text-xs text-muted-foreground">{course.nextDeadline ? formatDate(course.nextDeadline) : "—"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Open Q&A Questions</p>
                <p className="text-2xl font-bold mt-1">{qnaPosts.filter(q => q.status === "open").length}</p>
                <p className="text-xs text-muted-foreground">of {qnaPosts.length} total</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Course Description</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{course.description}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Completed lecture", detail: "Week 4: Dynamic Capabilities", time: "Today" },
                  { action: "Generated flashcards", detail: "Porter's Five Forces — 15 cards", time: "Yesterday" },
                  { action: "Asked AI", detail: "What is competitive advantage?", time: "2 days ago" },
                  { action: "Submitted assignment", detail: "Industry Analysis Report", time: "3 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-20 text-xs text-muted-foreground flex-shrink-0">{item.time}</div>
                    <div>
                      <span className="font-medium">{item.action}: </span>
                      <span className="text-muted-foreground">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials */}
        <TabsContent value="materials">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Course Materials</CardTitle>
                <Button size="sm" variant="outline" className="gap-2 text-xs h-7">
                  <Upload className="h-3 w-3" /> Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {materials.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${m.type === "pdf" ? "bg-red-500" : m.type === "docx" ? "bg-blue-500" : "bg-purple-500"}`}>
                      {m.type.toUpperCase().slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.size}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs h-7 flex-shrink-0" onClick={() => toast.success("Download started (mock)")}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assistant */}
        <TabsContent value="assistant" className="h-[calc(100vh-16rem)]">
          <ChatLayout courseId={id} />
        </TabsContent>

        {/* Q&A */}
        <TabsContent value="qna">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Course Q&A ({qnaPosts.length} posts)</h3>
            <Button size="sm" className="gap-2 text-xs" onClick={() => setQnaDialogOpen(true)}>
              <Plus className="h-3 w-3" /> Ask Question
            </Button>
          </div>
          <div className="space-y-3">
            {qnaPosts.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">No questions yet. Be the first to ask!</div>
            ) : (
              qnaPosts.map(post => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{post.title}</p>
                          <StatusBadge status={post.status} />
                          {post.trending && <Badge variant="secondary" className="text-xs">Trending</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.body}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{post.author}</span>
                          <span>·</span>
                          <span>{post.repliesCount} replies</span>
                          <span>·</span>
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* New question dialog */}
          <Dialog open={qnaDialogOpen} onOpenChange={setQnaDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
                <DialogDescription>Post your question to the course Q&A board</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Question title..."
                  value={qnaTitle}
                  onChange={e => setQnaTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Describe your question in detail..."
                  value={qnaBody}
                  onChange={e => setQnaBody(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setQnaDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => { toast.success("Question posted (mock)"); setQnaDialogOpen(false); setQnaTitle(""); setQnaBody("") }}>
                  Post Question
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments">
          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">No assignments for this course yet.</div>
            ) : (
              assignments.map(a => (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{a.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <StatusBadge status={a.status} />
                          <Badge variant="outline" className="text-xs gap-1">
                            AI: {a.allowedAiHelp}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Due {formatDate(a.dueDate)}</span>
                          <span className="text-xs text-muted-foreground">{a.maxPoints} pts</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs h-7 flex-shrink-0" asChild>
                        <Link href={`/student/assignments/${a.id}`}>Open</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Office Hours */}
        <TabsContent value="office-hours">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Ask the AI First</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Before booking office hours, try asking the AI — it can answer most questions instantly.</p>
                <div className="flex gap-2">
                  <input className="flex-1 h-9 rounded-md border border-input px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="What's your question?" />
                  <Button size="sm" onClick={() => toast.success("AI response (mock)")}>Ask AI</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Available Slots</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { slot: "Mon Mar 18, 10:00–11:00", instructor: course.instructor, type: "Virtual" },
                    { slot: "Wed Mar 20, 14:00–15:00", instructor: course.instructor, type: "In-person" },
                    { slot: "Fri Mar 22, 09:00–10:00", instructor: "TA: Márton Bak", type: "Virtual" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">{s.slot}</p>
                        <p className="text-xs text-muted-foreground">{s.instructor} · {s.type}</p>
                      </div>
                      <Button size="sm" className="text-xs h-7" onClick={() => toast.success("Slot booked (mock)")}>Book</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policy */}
        <TabsContent value="policy">
          <div className="space-y-4">
            {[
              { title: "AI Assistance Level", content: "Students may use AI for hints and concept explanations. The AI will not complete assignments or provide exam answers. All AI use must be disclosed.", color: "blue" },
              { title: "Citation Requirements", content: "The AI assistant will always cite course materials. Students must verify all AI-provided information against primary sources before including in assignments.", color: "green" },
              { title: "Data Privacy", content: "Your conversations are private and only accessible to you and university administrators for quality assurance. Conversations are deleted after 90 days.", color: "purple" },
              { title: "Academic Integrity", content: "Using AI to produce substantial portions of graded work is a violation of the Corvinus academic integrity policy and may result in disciplinary action.", color: "red" },
            ].map((policy) => (
              <Card key={policy.title} className={`border-l-4 border-l-${policy.color}-500`}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{policy.title}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{policy.content}</p></CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
