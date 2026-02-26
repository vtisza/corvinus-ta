"use client"

import { useState } from "react"
import Link from "next/link"
import { Send, BookOpen, Clock, Bell, ChevronRight, Flame, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { mockCourses, mockAssignments } from "@/lib/mock"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

const studyPlan = [
  { day: "Mon", task: "Read Porter's Five Forces Ch. 3", course: "Business Strategy", done: true },
  { day: "Tue", task: "Practice quiz: Financial Ratios", course: "Financial Accounting", done: true },
  { day: "Wed", task: "Review Digital Analytics lecture slides", course: "Digital Marketing", done: false },
  { day: "Thu", task: "Case Study: OTP Bank analysis", course: "Corporate Finance", done: false },
  { day: "Fri", task: "Work on EU Competition Law essay", course: "European Economic Law", done: false },
]

const announcements = [
  { id: 1, title: "Guest lecture: Strategy in Practice", course: "Business Strategy", date: "Mar 20" },
  { id: 2, title: "Mid-term exam schedule published", course: "Financial Accounting", date: "Mar 18" },
  { id: 3, title: "Group project teams announced", course: "Digital Marketing", date: "Mar 15" },
]

export default function StudentHomePage() {
  const [query, setQuery] = useState("")
  const upcomingDeadlines = mockAssignments.filter(a => a.status === "pending").slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl bg-gradient-to-br from-[#003366] to-[#0055a4] text-white p-6">
        <h1 className="text-xl font-bold">Good morning, Anna!</h1>
        <p className="text-blue-100 text-sm mt-1">You have 3 pending assignments and a 7-day study streak.</p>
        <div className="mt-4 flex gap-2">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask the AI assistant anything..."
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50 flex-1"
            onKeyDown={e => { if (e.key === "Enter") { toast.success("Question sent (mock)"); setQuery("") }}}
          />
          <Button
            size="icon"
            className="bg-white text-[#003366] hover:bg-white/90"
            onClick={() => { toast.success("Question sent (mock)"); setQuery("") }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Continue Studying */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" /> Continue Studying
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">Business Strategy</p>
            <p className="text-xs text-muted-foreground">Porter's Five Forces — Ch. 3</p>
            <div className="mt-2">
              <Progress value={68} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">68% complete</p>
            </div>
            <Button size="sm" className="mt-3 w-full" asChild>
              <Link href="/student/courses/course-1">Continue</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" /> Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingDeadlines.map(a => (
                <div key={a.id} className="flex items-center justify-between gap-2">
                  <p className="text-xs truncate">{a.title}</p>
                  <Badge variant="outline" className="text-[10px] flex-shrink-0">{formatDate(a.dueDate)}</Badge>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
              <Link href="/student/assignments">View all</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-500" /> Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {announcements.map(a => (
                <div key={a.id}>
                  <p className="text-xs font-medium">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{a.course} · {a.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">My Courses</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/courses" className="gap-1 text-xs">View all <ChevronRight className="h-3 w-3" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCourses.slice(0, 6).map(course => (
            <Card key={course.id} className="overflow-hidden">
              <div className={`h-16 bg-gradient-to-br ${course.coverColor} flex items-end p-3`}>
                <div>
                  <p className="text-white text-xs font-medium opacity-80">{course.code}</p>
                  <p className="text-white text-sm font-semibold line-clamp-1">{course.title}</p>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">{course.instructor}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
                {course.nextDeadline && (
                  <p className="text-[10px] text-muted-foreground mt-2 truncate">
                    Due: {formatDate(course.nextDeadline)} — {course.nextDeadlineTitle}
                  </p>
                )}
                <Button size="sm" variant="outline" className="mt-2 w-full text-xs h-7" asChild>
                  <Link href={`/student/courses/${course.id}`}>Open Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Study plan */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              This Week's Study Plan
              <Badge variant="secondary" className="ml-1 text-xs">7-day streak</Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => toast.success("Edit plan (mock)")}>Edit plan</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {studyPlan.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-8 text-center text-xs font-medium flex-shrink-0 ${item.done ? "text-muted-foreground" : "text-foreground"}`}>{item.day}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${item.done ? "line-through text-muted-foreground" : ""}`}>{item.task}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{item.course}</p>
                </div>
                {item.done && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
