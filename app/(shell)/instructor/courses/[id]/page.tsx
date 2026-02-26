"use client"

import { useState, use } from "react"
import { Eye, Send, Plus, Trash2, Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { UploadDialog } from "@/components/common/UploadDialog"
import { HeatmapGrid } from "@/components/common/HeatmapGrid"
import { mockCourses, mockQnaPosts, mockInstructorAnalytics } from "@/lib/mock"
import { toast } from "sonner"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function InstructorCourseCenter({ params }: PageProps) {
  const { id } = use(params)
  const course = mockCourses.find(c => c.id === id) || mockCourses[0]
  const qnaPosts = mockQnaPosts.filter(q => q.courseId === id)
  const [previewBanner, setPreviewBanner] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [difficulty, setDifficulty] = useState([50])
  const [citationsOn, setCitationsOn] = useState(true)
  const [courseMaterialsOnly, setCourseMaterialsOnly] = useState(true)
  const [allowWeb, setAllowWeb] = useState(false)
  const [refuseSolutions, setRefuseSolutions] = useState(true)
  const [hintsOnly, setHintsOnly] = useState(false)
  const [autoAnswer, setAutoAnswer] = useState(false)
  const [customRules, setCustomRules] = useState("")

  const files = [
    { name: "Week 1 Lecture Slides", topic: "Introduction", status: "active", visibility: "students" },
    { name: "Week 2 Lecture Slides", topic: "Five Forces", status: "active", visibility: "students" },
    { name: "Case Study: Apple", topic: "Differentiation", status: "active", visibility: "students" },
    { name: "Mid-term Exam (DRAFT)", topic: "Assessment", status: "draft", visibility: "instructors-only" },
    { name: "Solution Key Week 1", topic: "Assessment", status: "active", visibility: "instructors-only" },
  ]

  return (
    <div>
      {previewBanner && (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2">
          <Eye className="h-4 w-4 text-amber-600" />
          <p className="text-sm text-amber-800 font-medium">Previewing as Student</p>
          <Button size="sm" variant="outline" className="ml-auto h-7 text-xs" onClick={() => setPreviewBanner(false)}>Exit Preview</Button>
        </div>
      )}

      <PageHeader
        title={course.title}
        description={`${course.code} · ${course.enrolledCount} students · ${course.credits} ECTS`}
        breadcrumbs={[
          { label: "Instructor Portal", href: "/instructor" },
          { label: "Courses", href: "/instructor/courses" },
          { label: course.title },
        ]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setPreviewBanner(!previewBanner)}>
              <Eye className="h-4 w-4" /> {previewBanner ? "Exit Preview" : "Preview as Student"}
            </Button>
            <Button className="gap-2" onClick={() => toast.success("Changes published (mock)")}>
              <Send className="h-4 w-4" /> Publish Changes
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="materials">Materials & Knowledge</TabsTrigger>
          <TabsTrigger value="config">Assistant Config</TabsTrigger>
          <TabsTrigger value="qna">Q&A Moderation</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrity">Integrity & Policy</TabsTrigger>
        </TabsList>

        {/* Materials */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Course Files</CardTitle>
                <Button size="sm" className="gap-2 text-xs h-7" onClick={() => setUploadOpen(true)}>
                  <Upload className="h-3 w-3" /> Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((f, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{f.name}</TableCell>
                      <TableCell className="text-sm">{f.topic}</TableCell>
                      <TableCell><StatusBadge status={f.status} /></TableCell>
                      <TableCell>
                        <Badge variant={f.visibility === "students" ? "secondary" : "outline"} className="text-xs">
                          {f.visibility}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success("File settings (mock)")}>Edit</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => toast.success("File removed (mock)")}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Evaluation Set</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Add reference Q&A pairs to evaluate the AI's accuracy on this course.</p>
              <div className="space-y-3">
                {[
                  { q: "What are Porter's Five Forces?", a: "Porter's Five Forces is a framework for analyzing competitive forces..." },
                  { q: "Define competitive advantage", a: "A competitive advantage allows a firm to outperform its competitors..." },
                ].map((pair, i) => (
                  <div key={i} className="rounded-lg border p-3 space-y-2">
                    <p className="text-xs font-medium">Q: {pair.q}</p>
                    <p className="text-xs text-muted-foreground">Expected A: {pair.a}</p>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="gap-2 text-xs h-7">
                  <Plus className="h-3 w-3" /> Add Q&A pair
                </Button>
              </div>
            </CardContent>
          </Card>
          <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Course Material" />
        </TabsContent>

        {/* Assistant Config */}
        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">AI Persona & Rules</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">AI Persona</Label>
                  <Select defaultValue="tutor">
                    <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutor">Socratic Tutor</SelectItem>
                      <SelectItem value="explainer">Direct Explainer</SelectItem>
                      <SelectItem value="coach">Study Coach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Require citations", value: citationsOn, onChange: setCitationsOn },
                    { label: "Restrict to course materials only", value: courseMaterialsOnly, onChange: setCourseMaterialsOnly },
                    { label: "Allow web search", value: allowWeb, onChange: setAllowWeb },
                    { label: "Refuse to provide solutions", value: refuseSolutions, onChange: setRefuseSolutions },
                    { label: "Hints only mode", value: hintsOnly, onChange: setHintsOnly },
                  ].map(setting => (
                    <div key={setting.label} className="flex items-center justify-between">
                      <Label className="text-sm">{setting.label}</Label>
                      <Switch checked={setting.value} onCheckedChange={setting.onChange} />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Custom Rules</Label>
                  <Textarea
                    value={customRules}
                    onChange={e => setCustomRules(e.target.value)}
                    placeholder="Add any additional instructions for the AI assistant..."
                    className="text-sm min-h-[80px]"
                  />
                </div>
                <Button className="w-full gap-2" onClick={() => toast.success("Configuration saved (mock)")}>
                  <Save className="h-4 w-4" /> Save Configuration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Student-Facing Policy Preview</CardTitle></CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-blue-50 p-4 text-sm space-y-2">
                  <p className="font-semibold text-blue-900">AI Assistant Policy for {course.code}</p>
                  <p className="text-blue-800 text-xs">This assistant can help you understand course concepts and get feedback on your work.</p>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p>✓ {citationsOn ? "Will cite course materials" : "Citations optional"}</p>
                    <p>✓ {courseMaterialsOnly ? "Limited to course content" : "Can access web"}</p>
                    <p>{refuseSolutions ? "✗ Will not provide direct solutions" : "✓ Can help with solutions"}</p>
                    <p>✓ {hintsOnly ? "Hints only mode active" : "Full assistance mode"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Q&A Moderation */}
        <TabsContent value="qna" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Button size="sm" variant="outline" className="text-xs h-7">All ({qnaPosts.length})</Button>
            <Button size="sm" variant="outline" className="text-xs h-7">Unanswered ({qnaPosts.filter(q => q.status === "open").length})</Button>
            <Button size="sm" variant="outline" className="text-xs h-7">Trending ({qnaPosts.filter(q => q.trending).length})</Button>
          </div>
          <div className="space-y-3">
            {(qnaPosts.length > 0 ? qnaPosts : mockQnaPosts.slice(0, 3)).map(post => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{post.author} · {post.repliesCount} replies · {post.views} views</p>
                      {post.aiSuggestedAnswer && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-blue-700 mb-1">AI Suggested Answer:</p>
                          <Textarea
                            defaultValue={post.aiSuggestedAnswer}
                            className="text-xs min-h-[60px]"
                          />
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" className="text-xs h-7 gap-1" onClick={() => toast.success("Answer posted (mock)")}>
                              Post
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.success("Saved as draft (mock)")}>
                              Save Draft
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.success("Pinned as canonical (mock)")}>
                              Pin Canonical
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={post.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Auto-Answer Policy</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Enable auto-answers for common questions</Label>
                <Switch checked={autoAnswer} onCheckedChange={setAutoAnswer} />
              </div>
              {autoAnswer && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Auto-answer for these categories:</p>
                  {["Concept explanations", "Assignment clarifications", "Deadline reminders"].map(cat => (
                    <div key={cat} className="flex items-center gap-2">
                      <Checkbox id={cat} defaultChecked />
                      <Label htmlFor={cat} className="text-sm">{cat}</Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment */}
        <TabsContent value="assessment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Quiz Builder</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Topic</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      <SelectItem value="five-forces">Porter's Five Forces</SelectItem>
                      <SelectItem value="generic-strategies">Generic Strategies</SelectItem>
                      <SelectItem value="dynamic-capabilities">Dynamic Capabilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Difficulty: {["Easy", "Medium", "Hard"][Math.floor(difficulty[0] / 34)]}</Label>
                  <Slider value={difficulty} onValueChange={setDifficulty} min={0} max={100} step={1} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Question Types</Label>
                  <div className="space-y-1.5">
                    {["Multiple choice", "Short answer", "True/False", "Essay"].map(type => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox id={type} defaultChecked={type !== "Essay"} />
                        <Label htmlFor={type} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={() => toast.success("Quiz generated (mock)")}>
                  Generate Quiz
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Feedback Assistant</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">Upload student submissions to get AI-generated feedback suggestions.</p>
                <Button variant="outline" className="w-full gap-2" onClick={() => setUploadOpen(true)}>
                  <Upload className="h-4 w-4" /> Upload Submissions
                </Button>
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">Anna Tóth — submission.pdf</p>
                      <Badge variant="secondary" className="text-xs">AI reviewed</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Strong analysis of competitive forces. Recommend improving data citations in section 3.</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="text-xs h-6 px-2" onClick={() => toast.success("Feedback approved (mock)")}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-xs h-6 px-2">Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">Total Interactions</p><p className="text-xl sm:text-2xl font-bold">3,241</p></CardContent></Card>
            <Card><CardContent className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">Avg Messages/Student</p><p className="text-xl sm:text-2xl font-bold">42.3</p></CardContent></Card>
            <Card><CardContent className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">Unanswered Questions</p><p className="text-xl sm:text-2xl font-bold">7</p></CardContent></Card>
            <Card><CardContent className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">Content Gaps Found</p><p className="text-xl sm:text-2xl font-bold">3</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Confusion Topics</CardTitle></CardHeader>
            <CardContent>
              <HeatmapGrid items={mockInstructorAnalytics.confusionTopics.map(t => ({ topic: t.topic, mastery: 100 - t.confusionScore }))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Top Student Questions</CardTitle>
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.success("Report exported (mock)")}>Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockInstructorAnalytics.topQuestions.slice(0, 4).map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <p className="text-sm">{q.question}</p>
                    <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">{q.count}×</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrity & Policy */}
        <TabsContent value="integrity" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Per-Assessment AI Allowance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Assignment 1: Porter's Five Forces", "Assignment 2: Blue Ocean", "Mid-term Exam"].map(assessment => (
                  <div key={assessment} className="flex items-center gap-3">
                    <p className="text-sm flex-1">{assessment}</p>
                    <Select defaultValue="hints">
                      <SelectTrigger className="w-32 text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No AI</SelectItem>
                        <SelectItem value="hints">Hints Only</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="full">Full AI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Policy Editor</CardTitle>
                <Select defaultValue="v2.1">
                  <SelectTrigger className="w-24 text-xs h-7"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v2.1">v2.1</SelectItem>
                    <SelectItem value="v2.0">v2.0</SelectItem>
                    <SelectItem value="v1.9">v1.9</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                defaultValue="The AI assistant may help students understand concepts, generate practice questions, and provide feedback on their work. However, the AI must not complete assignments or provide exam answers."
                className="min-h-[120px] text-sm"
              />
              <Button onClick={() => toast.success("New version saved (mock)")}>Save New Version</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
