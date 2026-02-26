"use client"

import Link from "next/link"
import { AlertTriangle, Users, MessageSquare, DollarSign, Flag, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/shell/PageHeader"
import { MetricCard } from "@/components/common/MetricCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { mockGovernanceAnalytics, mockIncidents } from "@/lib/mock"
import { formatDateTime } from "@/lib/utils"

const complianceChecklist = [
  { label: "GDPR Data Processing Agreement", done: true },
  { label: "EU AI Act Risk Assessment", done: true },
  { label: "Annual Privacy Audit", done: true },
  { label: "Student Consent Collection", done: true },
  { label: "Model Bias Assessment (Q1 2024)", done: false },
  { label: "Incident Response Plan Review", done: false },
]

export default function GovernanceDashboardPage() {
  const data = mockGovernanceAnalytics
  const recentIncidents = mockIncidents.filter(i => i.status !== "closed").slice(0, 3)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Governance Dashboard"
        description="Platform-wide oversight, compliance, and risk management"
        breadcrumbs={[{ label: "Governance" }]}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Active Users" value={data.activeUsers} change="312 this semester" changeType="neutral" icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Total Messages" value={data.totalMessages.toLocaleString()} change="↑ 12% vs last month" changeType="positive" icon={<MessageSquare className="h-5 w-5" />} />
        <MetricCard title="Est. Cost (EUR)" value={`€${data.estimatedCostEUR.toLocaleString()}`} change="This month" changeType="neutral" icon={<DollarSign className="h-5 w-5" />} />
        <MetricCard title="Flag Rate" value={`${data.flagRate}%`} change="Target: <2%" changeType="positive" icon={<Flag className="h-5 w-5" />} />
        <MetricCard title="Open Incidents" value={data.openIncidents} change="2 high severity" changeType="negative" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance checklist */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Compliance Checklist</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {complianceChecklist.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.done
                    ? <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />}
                  <p className={`text-xs ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
              {complianceChecklist.filter(c => c.done).length}/{complianceChecklist.length} items complete
            </div>
          </CardContent>
        </Card>

        {/* Recent incidents */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Recent Incidents</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                <Link href="/governance/incidents">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentIncidents.map(inc => (
                <div key={inc.id} className="flex items-start gap-3 p-2 rounded-lg border hover:bg-muted/30">
                  <AlertTriangle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${inc.severity === "critical" ? "text-red-500" : inc.severity === "high" ? "text-orange-500" : "text-yellow-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{inc.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StatusBadge status={inc.severity} />
                      <StatusBadge status={inc.status} />
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs flex-shrink-0" asChild>
                    <Link href={`/governance/incidents/${inc.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top courses by adoption */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Top Courses by Adoption</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Msg/Student</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topCoursesByAdoption.map(c => (
                <TableRow key={c.courseId}>
                  <TableCell className="text-sm font-medium">{c.title}</TableCell>
                  <TableCell className="text-sm">{c.messages.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{c.students}</TableCell>
                  <TableCell className="text-sm font-medium">{Math.round(c.messages / c.students)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
