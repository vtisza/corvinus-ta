"use client"

import Link from "next/link"
import { Upload, Settings, PenSquare, Flag, BookOpen, AlertCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shell/PageHeader"
import { MetricCard } from "@/components/common/MetricCard"
import { mockCourses, mockInstructorAnalytics } from "@/lib/mock"
import { toast } from "sonner"

const alerts = [
  { id: 1, type: "flag", message: "3 student messages flagged in Financial Accounting", course: "ACC-201", severity: "high" },
  { id: 2, type: "question", message: "12 unanswered questions in Q&A this week", course: "BUS-401", severity: "medium" },
  { id: 3, type: "content", message: "Knowledge base hasn't been updated in 14 days", course: "LAW-280", severity: "low" },
  { id: 4, type: "assignment", message: "60 submissions pending grading", course: "FIN-420", severity: "medium" },
]

const alertColors = {
  high: "text-red-700 bg-red-50 border-red-200",
  medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
  low: "text-blue-700 bg-blue-50 border-blue-200",
}

const quickActions = [
  { label: "Upload Materials", icon: Upload, action: "Upload dialog (mock)" },
  { label: "Configure Assistant", icon: Settings, action: "Assistant config (mock)" },
  { label: "Generate Quiz", icon: PenSquare, action: "Quiz generation (mock)" },
  { label: "Review Flags", icon: Flag, action: "Flags review (mock)" },
]

export default function InstructorHomePage() {
  const data = mockInstructorAnalytics

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instructor Dashboard"
        description="Welcome back, Dr. Varga. Here's an overview of your courses."
        breadcrumbs={[{ label: "Instructor Portal" }]}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Students" value={data.totalStudents} change="+12 this semester" changeType="positive" icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Weekly Messages" value={data.weeklyMessages.toLocaleString()} change="↑ 8% vs last week" changeType="positive" icon={<BookOpen className="h-5 w-5" />} />
        <MetricCard title="Flag Rate" value={`${data.flagRate}%`} change="Industry avg: 2.1%" changeType="neutral" icon={<Flag className="h-5 w-5" />} />
        <MetricCard title="Satisfaction" value={`${data.avgSatisfaction}/5.0`} change="+0.2 this month" changeType="positive" icon={<AlertCircle className="h-5 w-5" />} />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(a => {
            const Icon = a.icon
            return (
              <Button key={a.label} variant="outline" className="gap-2" onClick={() => toast.success(a.action)}>
                <Icon className="h-4 w-4" />
                {a.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Alerts & Notifications</h2>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className={`flex items-center gap-3 rounded-lg border p-3 ${alertColors[alert.severity as keyof typeof alertColors]}`}>
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs opacity-70">{alert.course}</p>
              </div>
              <Badge variant="outline" className="flex-shrink-0 text-xs capitalize">{alert.severity}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Courses I Teach</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/instructor/courses" className="text-xs">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCourses.slice(0, 3).map(course => (
            <Card key={course.id} className="overflow-hidden">
              <div className={`h-16 bg-gradient-to-br ${course.coverColor} flex items-end p-3`}>
                <div>
                  <p className="text-white text-xs font-medium opacity-80">{course.code}</p>
                  <p className="text-white text-sm font-semibold line-clamp-1">{course.title}</p>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{course.enrolledCount} students</span>
                  <span className="text-muted-foreground">{course.credits} ECTS</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Avg. progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
                <Button size="sm" variant="outline" className="mt-2 w-full text-xs h-7" asChild>
                  <Link href={`/instructor/courses/${course.id}`}>Manage</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
