"use client"

import { useState, use } from "react"
import { RefreshCw, Save, Download, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shell/PageHeader"
import { mockCourses } from "@/lib/mock"
import { toast } from "sonner"

const toolMeta: Record<string, { name: string; description: string }> = {
  flashcards: { name: "Flashcards", description: "Generate AI flashcards for spaced repetition study" },
  quiz: { name: "Practice Quiz", description: "Create custom practice quizzes with explanations" },
  summary: { name: "Lecture Summary", description: "AI-generated summaries of course material" },
  map: { name: "Concept Map", description: "Visual representation of concept relationships" },
  compare: { name: "Compare Concepts", description: "Side-by-side comparison of theories and frameworks" },
}

const mockOutputs: Record<string, string> = {
  flashcards: `**Flashcard Set: Porter's Five Forces (15 cards)**

---
**Q: What are Porter's Five Forces?**
A: A framework for analyzing the competitive forces that determine industry profitability: (1) Threat of new entrants, (2) Bargaining power of suppliers, (3) Bargaining power of buyers, (4) Threat of substitutes, (5) Competitive rivalry.

---
**Q: When is the threat of new entrants HIGH?**
A: When entry barriers are low — e.g., low capital requirements, no proprietary technology, no established brand loyalty, no regulatory barriers.

---
**Q: What is an example of high supplier power?**
A: Intel supplying microprocessors to PC manufacturers — few alternatives exist, and switching costs are high.

...and 12 more cards generated.`,

  quiz: `**Practice Quiz: Business Strategy — Difficulty: Medium**

**Q1.** According to Porter, a firm that tries to compete on both cost leadership AND differentiation simultaneously risks becoming:
a) A niche player
b) "Stuck in the middle"
c) A market leader
d) An industry disruptor
✓ **Answer: b) "Stuck in the middle"** — Porter argues this leads to below-average performance as the firm fails to achieve either advantage effectively.

**Q2.** The Blue Ocean Strategy, developed by Kim and Mauborgne, differs from Porter's frameworks primarily because it:
a) Focuses on competing more effectively within existing markets
b) Advocates creating uncontested market space
c) Emphasizes cost reduction above all else
d) Applies only to startup companies
✓ **Answer: b) Advocates creating uncontested market space**

...3 more questions generated.`,

  summary: `**Lecture Summary: Week 4 — Dynamic Capabilities**

**Key Concepts:**
- Dynamic capabilities are the firm's ability to integrate, build, and reconfigure internal and external competencies to address rapidly changing environments (Teece et al., 1997)
- Contrast with ordinary capabilities: operational efficiency vs. strategic adaptability

**Three Components of Dynamic Capabilities:**
1. **Sensing** — Scanning for opportunities and threats in the environment
2. **Seizing** — Mobilizing resources to capture value from identified opportunities
3. **Reconfiguring** — Continuously renewing and transforming the asset base

**Key Takeaway:** Sustainable competitive advantage in dynamic environments requires more than just operational efficiency — firms must continuously sense, seize, and reconfigure their capability base.`,

  map: `**Concept Map: Strategic Management**

[Competitive Advantage]
├── Sources
│   ├── Cost Leadership → Economies of scale, Process efficiency
│   ├── Differentiation → Brand, Innovation, Quality
│   └── Focus → Niche market dominance
├── Analysis Frameworks
│   ├── Porter's Five Forces → Industry attractiveness
│   ├── VRIO Framework → Resource analysis
│   └── Value Chain Analysis → Activity optimization
└── Sustainability
    ├── Core Competencies → Hard to imitate
    └── Dynamic Capabilities → Continuous adaptation`,

  compare: `**Comparison: Porter's Generic Strategies vs. Blue Ocean Strategy**

| Dimension | Porter | Blue Ocean |
|-----------|--------|------------|
| Market view | Compete in existing markets | Create new market space |
| Competitive focus | Beat rivals | Make rivals irrelevant |
| Cost vs. Value | Trade-off required | Both simultaneously |
| Strategy tools | Five Forces, Value Chain | Strategy Canvas, ERRC |
| Risk | Getting "stuck in the middle" | Imitation over time |
| Example | Walmart (cost) / Apple (diff.) | Cirque du Soleil |

**When to use Porter:** Stable, mature industries where competitive position matters.
**When to use Blue Ocean:** Saturated markets needing radical innovation and value creation.`,
}

interface PageProps {
  params: Promise<{ tool: string }>
}

export default function ToolDetailPage({ params }: PageProps) {
  const { tool } = use(params)
  const meta = toolMeta[tool] || { name: tool, description: "Study tool" }
  const [course, setCourse] = useState("course-1")
  const [difficulty, setDifficulty] = useState([50])
  const [count, setCount] = useState("10")
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    setLoading(true)
    setGenerated(false)
    setTimeout(() => {
      setLoading(false)
      setGenerated(true)
    }, 1500)
  }

  const output = mockOutputs[tool] || "Generated content will appear here..."

  return (
    <div>
      <PageHeader
        title={meta.name}
        description={meta.description}
        breadcrumbs={[
          { label: "Student Portal", href: "/student" },
          { label: "Study Tools", href: "/student/tools" },
          { label: meta.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCourses.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Topic</Label>
              <Select defaultValue="all">
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  <SelectItem value="week1">Week 1: Introduction</SelectItem>
                  <SelectItem value="week2">Week 2: Five Forces</SelectItem>
                  <SelectItem value="week3">Week 3: Generic Strategies</SelectItem>
                  <SelectItem value="week4">Week 4: Dynamic Capabilities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Difficulty: {["Easy", "Medium", "Hard"][Math.floor(difficulty[0] / 34)]}</Label>
              <Slider
                value={difficulty}
                onValueChange={setDifficulty}
                min={0}
                max={100}
                step={1}
                className="mt-1"
              />
            </div>

            {(tool === "flashcards" || tool === "quiz") && (
              <div className="space-y-1.5">
                <Label className="text-xs">Count</Label>
                <Select value={count} onValueChange={setCount}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["5", "10", "15", "20", "30"].map(n => (
                      <SelectItem key={n} value={n}>{n} {tool === "flashcards" ? "cards" : "questions"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button className="w-full gap-2" onClick={handleGenerate} disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Generating..." : "Generate"}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Generated Output</CardTitle>
              {generated && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={handleGenerate}>
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => toast.success("Saved to plan (mock)")}>
                    <Save className="h-3 w-3" /> Save
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => toast.success("Exported (mock)")}>
                    <Download className="h-3 w-3" /> Export
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-32 w-full mt-4" />
              </div>
            ) : generated ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed text-foreground bg-muted/30 rounded-lg p-4">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3">✨</div>
                <p className="text-sm font-medium">Configure and generate</p>
                <p className="text-xs text-muted-foreground mt-1">Set your preferences and click Generate to create your study material.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
