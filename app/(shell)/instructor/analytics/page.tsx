"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shell/PageHeader"
import { MetricCard } from "@/components/common/MetricCard"
import { HeatmapGrid } from "@/components/common/HeatmapGrid"
import { mockInstructorAnalytics } from "@/lib/mock"
import { toast } from "sonner"

export default function InstructorAnalyticsPage() {
  const data = mockInstructorAnalytics

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Usage insights, confusion patterns, and content gaps across all courses"
        breadcrumbs={[{ label: "Instructor Portal", href: "/instructor" }, { label: "Analytics" }]}
        action={
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Report exported (mock)")}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Students" value={data.totalStudents} change="+12 this semester" changeType="positive" />
        <MetricCard title="Weekly Messages" value={data.weeklyMessages.toLocaleString()} change="↑ 8%" changeType="positive" />
        <MetricCard title="Flag Rate" value={`${data.flagRate}%`} description="Industry avg: 2.1%" />
        <MetricCard title="Satisfaction" value={`${data.avgSatisfaction}/5.0`} change="+0.2 this month" changeType="positive" />
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Topic Confusion Heatmap</CardTitle></CardHeader>
        <CardContent>
          <HeatmapGrid items={data.confusionTopics.map(t => ({ topic: t.topic, mastery: 100 - t.confusionScore }))} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top Student Questions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.topQuestions.map((q, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <p className="text-sm">{q.question}</p>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0 text-xs">{q.count}×</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Content Gaps</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.contentGaps.map((g, i) => (
                <div key={i} className="p-3 rounded-lg border bg-orange-50 border-orange-200">
                  <p className="text-sm font-medium text-orange-900">{g.gap}</p>
                  <p className="text-xs text-orange-700 mt-0.5">{g.courseId}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
