"use client"

/**
 * A2UI Example — Corvinus AI Teaching Assistant
 *
 * This page demonstrates how the A2UI (Agent-to-UI) protocol lets an AI
 * agent return structured, interactive UI instead of plain text.
 *
 * Flow:
 *  1. Student types a question (e.g. "Quiz me on Porter's Five Forces")
 *  2. The mock agent returns a stream of A2UI v0.9 messages (JSON lines)
 *  3. A2UIRenderer processes the messages and renders native React widgets
 *  4. The student interacts with the widgets (answers, buttons)
 *  5. Interactions are sent back to the agent as A2UIAction events
 *
 * In production, step 2 would call a real LLM API endpoint that emits
 * A2UI JSONL in its response body.
 */

import { useState, useCallback } from "react"
import { Send, Sparkles, Code2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shell/PageHeader"
import { A2UIRenderer } from "@/components/a2ui/A2UIRenderer"
import { A2UIMessage, A2UIAction, parseA2UIMessages } from "@/lib/a2ui"
import { toast } from "sonner"

// ---------------------------------------------------------------------------
// Mock agent responses — each is a JSONL string the "server" would stream.
// In production these would come from an LLM endpoint that supports A2UI.
// ---------------------------------------------------------------------------

const MOCK_RESPONSES: Record<string, string> = {
  quiz: `
{"version":"v0.9","createSurface":{"surfaceId":"main","name":"Porter's Five Forces Quiz"}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[
  {"id":"title","component":{"component":"Text","text":"Porter's Five Forces — Quick Quiz","variant":"h3"}},
  {"id":"div1","component":{"component":"Divider"}},
  {"id":"q1-label","component":{"component":"Text","text":"1. Which force refers to the threat from companies producing similar products?","variant":"body"}},
  {"id":"q1","component":{"component":"CheckBox","label":"Threat of new entrants","dataKey":"q1a"}},
  {"id":"q1b","component":{"component":"CheckBox","label":"Threat of substitutes ✓","dataKey":"q1b"}},
  {"id":"q1c","component":{"component":"CheckBox","label":"Bargaining power of buyers","dataKey":"q1c"}},
  {"id":"div2","component":{"component":"Divider"}},
  {"id":"q2-label","component":{"component":"Text","text":"2. What is the name of Michael Porter's framework?","variant":"body"}},
  {"id":"q2","component":{"component":"TextField","label":"Your answer","dataKey":"q2answer","textFieldType":"shortText"}},
  {"id":"div3","component":{"component":"Divider"}},
  {"id":"submit","component":{"component":"Button","label":"Submit Answers","variant":"primary","action":"submit_quiz"}}
]}}
`.trim(),

  summary: `
{"version":"v0.9","createSurface":{"surfaceId":"main","name":"Lecture Summary"}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[
  {"id":"title","component":{"component":"Text","text":"Financial Accounting — Lecture 5 Summary","variant":"h3"}},
  {"id":"subtitle","component":{"component":"Text","text":"Key concepts covered this week","variant":"caption"}},
  {"id":"div0","component":{"component":"Divider"}},
  {"id":"cards","component":{"component":"List","direction":"vertical","children":[
    {"component":"Card","child":{"component":"Column","children":[
      {"component":"Text","text":"Balance Sheet","variant":"h5"},
      {"component":"Text","text":"A snapshot of a company's assets, liabilities, and shareholders' equity at a specific point in time. Assets = Liabilities + Equity.","variant":"body"}
    ]}},
    {"component":"Card","child":{"component":"Column","children":[
      {"component":"Text","text":"Income Statement","variant":"h5"},
      {"component":"Text","text":"Reports revenues and expenses over a period. Net Income = Revenue − Expenses. Also called the Profit & Loss statement.","variant":"body"}
    ]}},
    {"component":"Card","child":{"component":"Column","children":[
      {"component":"Text","text":"Cash Flow Statement","variant":"h5"},
      {"component":"Text","text":"Tracks cash inflows and outflows across operating, investing, and financing activities. Bridges the gap between accrual accounting and actual cash.","variant":"body"}
    ]}}
  ]}},
  {"id":"div1","component":{"component":"Divider"}},
  {"id":"actions","component":{"component":"Row","children":[
    {"component":"Button","label":"Generate Flashcards","variant":"primary","action":"gen_flashcards"},
    {"component":"Button","label":"Practice Quiz","variant":"outline","action":"gen_quiz"}
  ]}}
]}}
`.trim(),

  planner: `
{"version":"v0.9","createSurface":{"surfaceId":"main","name":"Study Planner"}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[
  {"id":"title","component":{"component":"Text","text":"Personalised Study Planner","variant":"h3"}},
  {"id":"desc","component":{"component":"Text","text":"Tell me about your upcoming exams and I'll create a schedule.","variant":"body"}},
  {"id":"div0","component":{"component":"Divider"}},
  {"id":"exam-name","component":{"component":"TextField","label":"Exam subject","dataKey":"examSubject","textFieldType":"shortText"}},
  {"id":"exam-date","component":{"component":"TextField","label":"Exam date","dataKey":"examDate","textFieldType":"date"}},
  {"id":"hours","component":{"component":"TextField","label":"Hours available per day","dataKey":"hoursPerDay","textFieldType":"number"}},
  {"id":"focus","component":{"component":"TextField","label":"Topics you find hardest (optional)","dataKey":"hardTopics","textFieldType":"longText"}},
  {"id":"div1","component":{"component":"Divider"}},
  {"id":"create-btn","component":{"component":"Button","label":"Create My Study Plan","variant":"primary","action":"create_plan"}}
]}}
`.trim(),

  feedback: `
{"version":"v0.9","createSurface":{"surfaceId":"main","name":"Assignment Feedback"}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[
  {"id":"title","component":{"component":"Text","text":"Assignment Feedback — Porter Analysis Essay","variant":"h3"}},
  {"id":"score","component":{"component":"Row","justify":"spaceBetween","align":"center","children":[
    {"component":"Text","text":"Overall Score","variant":"h4"},
    {"component":"Text","text":"84 / 100","variant":"h4"}
  ]}},
  {"id":"div0","component":{"component":"Divider"}},
  {"id":"criteria","component":{"component":"List","direction":"vertical","children":[
    {"component":"Card","child":{"component":"Row","justify":"spaceBetween","align":"center","children":[
      {"component":"Column","children":[
        {"component":"Text","text":"Argument Clarity","variant":"h5"},
        {"component":"Text","text":"Well-structured with clear thesis","variant":"caption"}
      ]},
      {"component":"Text","text":"22 / 25","variant":"body"}
    ]}},
    {"component":"Card","child":{"component":"Row","justify":"spaceBetween","align":"center","children":[
      {"component":"Column","children":[
        {"component":"Text","text":"Evidence & Citations","variant":"h5"},
        {"component":"Text","text":"Good use of sources; add more recent examples","variant":"caption"}
      ]},
      {"component":"Text","text":"19 / 25","variant":"body"}
    ]}},
    {"component":"Card","child":{"component":"Row","justify":"spaceBetween","align":"center","children":[
      {"component":"Column","children":[
        {"component":"Text","text":"Critical Analysis","variant":"h5"},
        {"component":"Text","text":"Strong analysis of competitive rivalry","variant":"caption"}
      ]},
      {"component":"Text","text":"23 / 25","variant":"body"}
    ]}},
    {"component":"Card","child":{"component":"Row","justify":"spaceBetween","align":"center","children":[
      {"component":"Column","children":[
        {"component":"Text","text":"Writing Quality","variant":"h5"},
        {"component":"Text","text":"Minor grammar issues in conclusion","variant":"caption"}
      ]},
      {"component":"Text","text":"20 / 25","variant":"body"}
    ]}}
  ]}},
  {"id":"div1","component":{"component":"Divider"}},
  {"id":"next","component":{"component":"Row","children":[
    {"component":"Button","label":"View Detailed Comments","variant":"primary","action":"view_comments"},
    {"component":"Button","label":"Resubmit","variant":"outline","action":"resubmit"}
  ]}}
]}}
`.trim(),
}

// Short command → mock response key
const INTENT_MAP: Array<[RegExp, string]> = [
  [/quiz|test|practis/i, "quiz"],
  [/summar|lecture|notes|concept/i, "summary"],
  [/plan|schedul|exam prep/i, "planner"],
  [/feedback|grade|mark|score|essay/i, "feedback"],
]

function detectIntent(input: string): string | null {
  for (const [re, key] of INTENT_MAP) {
    if (re.test(input)) return key
  }
  return null
}

// Predefined prompts shown as quick-action chips
const QUICK_PROMPTS = [
  { label: "Quiz me on Porter's Five Forces", intent: "quiz" },
  { label: "Summarise this week's accounting lecture", intent: "summary" },
  { label: "Build me a study planner", intent: "planner" },
  { label: "Show assignment feedback", intent: "feedback" },
]

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function A2UIDemoPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<A2UIMessage[]>([])
  const [rawJsonl, setRawJsonl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [lastAction, setLastAction] = useState<A2UIAction | null>(null)

  const runQuery = useCallback((intentKey: string) => {
    const jsonl = MOCK_RESPONSES[intentKey]
    if (!jsonl) return
    setLoading(true)
    setLastAction(null)

    // Simulate streaming delay
    setTimeout(() => {
      const parsed = parseA2UIMessages(jsonl)
      setMessages(parsed)
      setRawJsonl(jsonl)
      setLoading(false)
    }, 600)
  }, [])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const intent = detectIntent(trimmed)
    if (intent) {
      runQuery(intent)
    } else {
      toast.info("Try one of the quick prompts — this demo covers quiz, summary, planner, and feedback.", {
        duration: 4000,
      })
    }
    setInput("")
  }

  const handleAction = useCallback((action: A2UIAction) => {
    setLastAction(action)
    toast.success(`Action "${action.action}" received from surface "${action.surfaceId}"`)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="A2UI Example"
        description="See how AI agents can return rich, interactive interfaces instead of plain text."
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "A2UI Demo" }]}
      />

      {/* Explainer banner */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">What is A2UI?</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>A2UI (Agent-to-UI)</strong> is an open protocol by Google that lets AI agents emit
            declarative JSON describing UI components — cards, forms, buttons, lists — instead of unstructured
            text. The client renders those components natively using its own widget library, keeping the UI safe
            and consistent.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">v0.9 spec</Badge>
            <Badge variant="secondary">Declarative JSON</Badge>
            <Badge variant="secondary">Incremental updates</Badge>
            <Badge variant="secondary">Apache 2.0</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick-prompt chips */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Try a prompt</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <Button
              key={p.intent}
              variant="outline"
              size="sm"
              onClick={() => runQuery(p.intent)}
              disabled={loading}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="e.g. Quiz me on this week's lecture…"
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main content: rendered UI + raw JSON tabs */}
      {(messages.length > 0 || loading) && (
        <Tabs defaultValue="rendered">
          <div className="flex items-center justify-between mb-2">
            <TabsList>
              <TabsTrigger value="rendered">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Rendered UI
              </TabsTrigger>
              <TabsTrigger value="raw">
                <Code2 className="h-3.5 w-3.5 mr-1.5" />
                Raw A2UI JSONL
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Rendered surface */}
          <TabsContent value="rendered">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-normal">
                  Surface: <code className="font-mono text-foreground">main</code>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Agent is generating UI…
                  </div>
                ) : (
                  <A2UIRenderer
                    messages={messages}
                    surfaceId="main"
                    onAction={handleAction}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw JSONL */}
          <TabsContent value="raw">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-normal">
                  A2UI v0.9 message stream (JSONL — one message per line)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted rounded-lg p-4 overflow-auto max-h-[480px] whitespace-pre-wrap leading-relaxed">
                  {rawJsonl.split("\n").map((line, i) => {
                    try {
                      return JSON.stringify(JSON.parse(line), null, 2)
                    } catch {
                      return line
                    }
                  }).join("\n\n---\n\n")}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Last action log */}
      {lastAction && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              ↩ Action sent back to agent
            </p>
            <pre className="text-xs text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded p-3 overflow-auto">
              {JSON.stringify(lastAction, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Architecture overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong className="text-foreground">Agent generates A2UI JSONL</strong> — the LLM returns a
              stream of JSON-Lines messages (<code className="font-mono text-xs">createSurface</code>,{" "}
              <code className="font-mono text-xs">updateComponents</code>, …).
            </li>
            <li>
              <strong className="text-foreground">Client parses the stream</strong> — each line is parsed
              into a typed <code className="font-mono text-xs">A2UIMessage</code> and fed to the renderer.
            </li>
            <li>
              <strong className="text-foreground">A2UIRenderer builds the surface</strong> — components are
              added/replaced incrementally, enabling progressive rendering as the stream arrives.
            </li>
            <li>
              <strong className="text-foreground">User interacts</strong> — button clicks, form inputs, and
              checkbox toggles produce an <code className="font-mono text-xs">A2UIAction</code> sent back to
              the agent for the next turn.
            </li>
          </ol>
          <div className="rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">
            {`User prompt\n   → LLM (with A2UI system prompt)\n   → A2UI JSONL stream\n   → A2UIRenderer\n   → Native React widgets\n   → A2UIAction\n   → LLM (next turn)`}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
