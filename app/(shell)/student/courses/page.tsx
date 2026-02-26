"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shell/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { mockCourses } from "@/lib/mock"
import { formatDate } from "@/lib/utils"

export default function StudentCoursesPage() {
  const [search, setSearch] = useState("")
  const [semester, setSemester] = useState("all")

  const filtered = mockCourses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
    const matchSemester = semester === "all" || c.semester === semester
    return matchSearch && matchSemester
  })

  return (
    <div>
      <PageHeader
        title="My Courses"
        description="All enrolled courses for the current semester"
        breadcrumbs={[{ label: "Student Portal", href: "/student" }, { label: "My Courses" }]}
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="Spring 2024">Spring 2024</SelectItem>
            <SelectItem value="Fall 2023">Fall 2023</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 flex-wrap">
          {["Strategy", "Finance", "Marketing", "Law"].map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted text-xs">{tag}</Badge>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="No courses found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Next Deadline</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(course => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.code} · {course.credits} ECTS</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{course.instructor}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={course.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-0.5">{course.progress}%</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {course.nextDeadline ? (
                        <div>
                          <p className="font-medium">{formatDate(course.nextDeadline)}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{course.nextDeadlineTitle}</p>
                        </div>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {course.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                        <Link href={`/student/courses/${course.id}`}>Open</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
