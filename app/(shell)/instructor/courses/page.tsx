"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shell/PageHeader"
import { mockCourses } from "@/lib/mock"

export default function InstructorCoursesPage() {
  const [search, setSearch] = useState("")
  const filtered = mockCourses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Courses I Teach"
        description={`${mockCourses.length} active courses this semester`}
        breadcrumbs={[{ label: "Instructor Portal", href: "/instructor" }, { label: "Courses" }]}
      />
      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(course => (
          <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-20 bg-gradient-to-br ${course.coverColor} flex items-end p-4`}>
              <div>
                <p className="text-white text-xs font-medium opacity-80">{course.code}</p>
                <p className="text-white font-semibold line-clamp-1">{course.title}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{course.enrolledCount} students</span>
                <span>{course.credits} ECTS</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {course.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <Progress value={course.progress} className="h-1.5 mb-1" />
              <p className="text-xs text-muted-foreground">Avg. student progress: {course.progress}%</p>
              <Button size="sm" className="mt-3 w-full text-xs h-7" asChild>
                <Link href={`/instructor/courses/${course.id}`}>Open Course Center</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
