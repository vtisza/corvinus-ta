"use client"

import { useState } from "react"
import Link from "next/link"
import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/shell/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { mockAssignments } from "@/lib/mock"
import { formatDate } from "@/lib/utils"

const aiHelpColors: Record<string, string> = {
  none: "text-gray-600 border-gray-300",
  hints: "text-yellow-700 border-yellow-300 bg-yellow-50",
  feedback: "text-blue-700 border-blue-300 bg-blue-50",
  full: "text-green-700 border-green-300 bg-green-50",
}

export default function AssignmentsPage() {
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = mockAssignments.filter(a =>
    statusFilter === "all" || a.status === statusFilter
  )

  return (
    <div>
      <PageHeader
        title="Assignments"
        description={`${mockAssignments.filter(a => a.status === "pending").length} pending · ${mockAssignments.filter(a => a.status === "overdue").length} overdue`}
        breadcrumbs={[{ label: "Student Portal", href: "/student" }, { label: "Assignments" }]}
      />

      <div className="flex gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-12 w-12" />}
          title="No assignments found"
          description="No assignments match the current filter."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <Card key={a.id} className={a.status === "overdue" ? "border-red-200 bg-red-50/30" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.courseTitle}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <StatusBadge status={a.status} />
                      <Badge variant="outline" className={`text-xs ${aiHelpColors[a.allowedAiHelp]}`}>
                        AI: {a.allowedAiHelp}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Due {formatDate(a.dueDate)}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{a.maxPoints} pts{a.points !== undefined ? ` · Received: ${a.points}` : ""}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{a.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7 flex-shrink-0" asChild>
                    <Link href={`/student/assignments/${a.id}`}>Open</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
