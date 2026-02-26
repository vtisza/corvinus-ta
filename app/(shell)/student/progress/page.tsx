"use client"

import { Flame, Clock, Trophy, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shell/PageHeader"
import { MetricCard } from "@/components/common/MetricCard"
import { HeatmapGrid } from "@/components/common/HeatmapGrid"
import { mockStudentAnalytics } from "@/lib/mock"
import { toast } from "sonner"

export default function StudentProgressPage() {
  const data = mockStudentAnalytics

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Progress"
        description="Track your learning journey and identify areas for improvement"
        breadcrumbs={[{ label: "Student Portal", href: "/student" }, { label: "My Progress" }]}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Study Time" value={`${data.studyTimeHours}h`} change="This week" changeType="neutral" icon={<Clock className="h-5 w-5" />} />
        <MetricCard title="Study Streak" value={`${data.studyStreak} days`} change="+3 from last week" changeType="positive" icon={<Flame className="h-5 w-5" />} />
        <MetricCard title="Quizzes Done" value={data.quizzesDone} change="All time" changeType="neutral" icon={<Trophy className="h-5 w-5" />} />
        <MetricCard title="Avg. Mastery" value={`${data.masteryPercent}%`} change="+5% this month" changeType="positive" icon={<Target className="h-5 w-5" />} />
      </div>

      {/* Topic mastery heatmap */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Topic Mastery Heatmap</CardTitle></CardHeader>
        <CardContent>
          <HeatmapGrid items={data.topicMastery} />
        </CardContent>
      </Card>

      {/* Weak topics */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Areas to Improve</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.weakTopics.map(t => (
              <div key={t.topic} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{t.topic}</p>
                    <span className="text-xs text-muted-foreground">{t.mastery}%</span>
                  </div>
                  <Progress value={t.mastery} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-0.5">{t.course}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-7 flex-shrink-0" onClick={() => toast.success("Opening practice session (mock)")}>
                  Practice
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Per-course progress */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Progress by Course</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.courseProgress.map(c => (
              <div key={c.courseId}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{c.title}</p>
                  <span className="text-xs font-semibold">{c.progress}%</span>
                </div>
                <Progress value={c.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
