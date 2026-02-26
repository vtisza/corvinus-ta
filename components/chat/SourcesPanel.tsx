"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Citation } from "@/lib/types"
import { BookOpen, Wrench, Shield, BookMarked } from "lucide-react"

interface SourcesPanelProps {
  citations: Citation[]
}

const glossaryTerms = [
  { term: "Porter's Five Forces", definition: "A framework for analyzing the competitive forces that shape an industry." },
  { term: "Competitive Advantage", definition: "A position that allows a firm to outperform its competitors over time." },
  { term: "Core Competency", definition: "An organizational capability that enables and sustains competitive advantage." },
  { term: "WACC", definition: "Weighted Average Cost of Capital — the average rate a company pays to finance its assets." },
]

const allowedTools = [
  { name: "Course Knowledge Base", status: "enabled" },
  { name: "Web Search", status: "disabled" },
  { name: "Code Execution", status: "disabled" },
  { name: "Calculator", status: "enabled" },
]

export function SourcesPanel({ citations }: SourcesPanelProps) {
  const uniqueCitations = Array.from(new Map(citations.map((c) => [c.id, c])).values())

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <p className="text-xs font-semibold">Context</p>
      </div>
      <Tabs defaultValue="sources" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-3 mt-2 h-7 text-xs grid grid-cols-4">
          <TabsTrigger value="sources" className="text-[10px] px-1">
            <BookOpen className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="glossary" className="text-[10px] px-1">
            <BookMarked className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-[10px] px-1">
            <Wrench className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="policy" className="text-[10px] px-1">
            <Shield className="h-3 w-3" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="flex-1 overflow-y-auto p-3 mt-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Sources</p>
          {uniqueCitations.length === 0 ? (
            <p className="text-xs text-muted-foreground">No sources in this thread yet.</p>
          ) : (
            <div className="space-y-2">
              {uniqueCitations.map((c) => (
                <div key={c.id} className="rounded-lg border p-2 bg-muted/20">
                  <p className="text-[11px] font-medium line-clamp-2">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.section}</p>
                  {c.page && <p className="text-[10px] text-muted-foreground">p. {c.page}</p>}
                  <Badge
                    variant="outline"
                    className={`text-[10px] mt-1 h-4 px-1 ${c.confidence > 0.9 ? "text-green-700 border-green-300 bg-green-50" : "text-yellow-700 border-yellow-300 bg-yellow-50"}`}
                  >
                    {Math.round(c.confidence * 100)}% confidence
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="glossary" className="flex-1 overflow-y-auto p-3 mt-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Glossary</p>
          <div className="space-y-2">
            {glossaryTerms.map((t) => (
              <div key={t.term} className="rounded-lg border p-2">
                <p className="text-[11px] font-semibold">{t.term}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t.definition}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="flex-1 overflow-y-auto p-3 mt-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Allowed Tools</p>
          <div className="space-y-2">
            {allowedTools.map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-lg border p-2">
                <p className="text-[11px] font-medium">{t.name}</p>
                <Badge
                  variant="outline"
                  className={`text-[10px] h-4 px-1 ${t.status === "enabled" ? "text-green-700 border-green-300 bg-green-50" : "text-gray-500 border-gray-300 bg-gray-50"}`}
                >
                  {t.status}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="policy" className="flex-1 overflow-y-auto p-3 mt-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Course Policy</p>
          <div className="space-y-2 text-[11px] text-muted-foreground">
            <div className="rounded-lg border p-2 bg-blue-50 border-blue-200">
              <p className="font-medium text-blue-800">AI Assistance Level</p>
              <p className="mt-0.5 text-blue-700">Hints only — AI will guide but not solve assignments</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className="font-medium">Citations Required</p>
              <p className="mt-0.5">All answers cite verified course materials</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className="font-medium">Data Privacy</p>
              <p className="mt-0.5">Conversations processed in EU. Retained 90 days.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
