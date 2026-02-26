"use client"

import Link from "next/link"
import { Layers, HelpCircle, FileText, Map, GitCompare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shell/PageHeader"

const tools = [
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Generate AI-powered flashcards from any course topic. Study with spaced repetition.",
    icon: Layers,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: "quiz",
    name: "Practice Quiz",
    description: "Create custom quizzes with adaptive difficulty. Get instant explanations for wrong answers.",
    icon: HelpCircle,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    id: "summary",
    name: "Lecture Summary",
    description: "Get AI-generated summaries of lectures and readings. Export as PDF or share with classmates.",
    icon: FileText,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    id: "map",
    name: "Concept Map",
    description: "Visualize connections between concepts. Build knowledge graphs to understand complex topics.",
    icon: Map,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    id: "compare",
    name: "Compare Concepts",
    description: "Side-by-side comparison of theories, frameworks, or case studies. Perfect for exam prep.",
    icon: GitCompare,
    color: "text-red-500",
    bg: "bg-red-50",
  },
]

export default function StudyToolsPage() {
  return (
    <div>
      <PageHeader
        title="Study Tools"
        description="AI-powered tools to enhance your learning"
        breadcrumbs={[{ label: "Student Portal", href: "/student" }, { label: "Study Tools" }]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => {
          const Icon = tool.icon
          return (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg ${tool.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`h-5 w-5 ${tool.color}`} />
                </div>
                <CardTitle className="text-base">{tool.name}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/student/tools/${tool.id}`}>Open {tool.name}</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
