"use client"

import { Download, TrendingUp, Users, BookOpen, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/shell/PageHeader"
import { MetricCard } from "@/components/common/MetricCard"
import { mockGovernanceAnalytics } from "@/lib/mock"
import { toast } from "sonner"

export default function AdoptionPage() {
  const data = mockGovernanceAnalytics

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adoption & Impact"
        description="Platform adoption metrics, learning outcomes, and cost analysis"
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Adoption & Impact" }]}
        action={
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Dashboard exported (mock)")}>
            <Download className="h-4 w-4" /> Export Dashboard
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Active Users" value={data.activeUsers} change="↑ 18% vs last month" changeType="positive" icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Total Messages" value={data.totalMessages.toLocaleString()} change="Since launch" changeType="neutral" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard title="Courses with AI" value="14" change="of 18 total" changeType="neutral" icon={<BookOpen className="h-5 w-5" />} />
        <MetricCard title="Monthly Cost (EUR)" value={`€${data.estimatedCostEUR.toLocaleString()}`} change="Within budget" changeType="positive" icon={<DollarSign className="h-5 w-5" />} />
      </div>

      {/* Adoption by department */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Adoption by Department</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.adoptionByDept.map(dept => (
              <div key={dept.dept}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{dept.dept}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{dept.users} users</span>
                    <span>{dept.courses} courses</span>
                  </div>
                </div>
                <Progress value={(dept.users / data.activeUsers) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course adoption table */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Top Courses by Usage</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Avg. Messages/Student</TableHead>
                <TableHead>Adoption Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topCoursesByAdoption.map(c => (
                <TableRow key={c.courseId}>
                  <TableCell className="font-medium text-sm">{c.title}</TableCell>
                  <TableCell className="text-sm">{c.messages.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{c.students}</TableCell>
                  <TableCell className="text-sm font-semibold">{Math.round(c.messages / c.students)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.min((c.messages / c.students) / 3 * 100, 100)} className="h-1.5 w-16" />
                      <span className="text-xs">{Math.min(Math.round((c.messages / c.students) / 3 * 100), 100)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cost breakdown */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Cost Breakdown by Model</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.costByModel.map(m => (
              <div key={m.model}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium font-mono">{m.model}</p>
                    <Badge variant="outline" className="text-xs">{(m.tokens / 1000000).toFixed(1)}M tokens</Badge>
                  </div>
                  <p className="text-sm font-bold">€{m.cost.toLocaleString()}</p>
                </div>
                <Progress value={(m.cost / data.estimatedCostEUR) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning impact proxy */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Learning Impact Indicators</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Student Satisfaction (AI)", value: "4.2/5.0", change: "+0.3 vs pre-AI", positive: true },
              { label: "Avg. Study Time/Week", value: "12.4h", change: "+1.8h vs last sem", positive: true },
              { label: "Office Hours Requests", value: "↓ 34%", change: "Reduced by AI help", positive: true },
            ].map(m => (
              <div key={m.label} className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                <Badge variant="secondary" className={`text-xs mt-2 ${m.positive ? "text-green-700 bg-green-50" : ""}`}>{m.change}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">*Learning impact metrics are proxy indicators from student surveys and LMS data. Direct causal attribution not established.</p>
        </CardContent>
      </Card>
    </div>
  )
}
