"use client"

/**
 * A2UI Example — Corvinus AI Teaching Assistant
 *
 * Demonstrates the A2UI v0.10 protocol (open standard by Google):
 * an AI agent returns JSONL describing a UI surface using an adjacency-list
 * of components; the client renders them as native widgets.
 *
 * Key spec concepts shown here:
 *  • createSurface  — initialise the rendering canvas
 *  • updateComponents — flat adjacency list (children = ID strings, not nested)
 *  • updateDataModel — JSON Pointer path updates to a shared data model
 *  • Data binding — component values reference the data model via {path:}
 *  • Actions — button clicks emit A2UIAction events back to the agent
 *
 * Protocol reference: https://github.com/google/A2UI
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
// Mock agent responses — proper A2UI v0.10 JSONL (adjacency list format)
// In production this would stream from an LLM endpoint.
// ---------------------------------------------------------------------------

const MOCK_RESPONSES: Record<string, string> = {
  // --- Quiz ---
  quiz: [
    // 1. Create the surface
    `{"version":"v0.10","createSurface":{"surfaceId":"main","name":"Porter Quiz","catalogId":"https://a2ui.org/specification/v0_10/basic_catalog.json","sendDataModel":true}}`,
    // 2. Define the flat component adjacency list
    `{"version":"v0.10","updateComponents":{"surfaceId":"main","components":[
      {"id":"root","component":"Column","children":["title","div0","q1lbl","q1a","q1b","q1c","div1","q2lbl","q2field","div2","submit"]},
      {"id":"title","component":"Text","text":"Porter's Five Forces — Quick Quiz","variant":"h3"},
      {"id":"div0","component":"Divider"},
      {"id":"q1lbl","component":"Text","text":"1. Which force refers to the threat from companies producing similar products?","variant":"body"},
      {"id":"q1a","component":"CheckBox","label":"Threat of new entrants","dataPath":"/q1a"},
      {"id":"q1b","component":"CheckBox","label":"Threat of substitutes ✓","dataPath":"/q1b"},
      {"id":"q1c","component":"CheckBox","label":"Bargaining power of buyers","dataPath":"/q1c"},
      {"id":"div1","component":"Divider"},
      {"id":"q2lbl","component":"Text","text":"2. What is the name of Michael Porter's framework?","variant":"body"},
      {"id":"q2field","component":"TextField","label":"Your answer","textFieldType":"shortText","dataPath":"/q2answer"},
      {"id":"div2","component":"Divider"},
      {"id":"submit","component":"Button","label":"Submit Answers","variant":"primary","action":{"event":{"name":"submit_quiz"}}}
    ]}}`,
    // 3. Seed the data model with initial values
    `{"version":"v0.10","updateDataModel":{"surfaceId":"main","value":{"q1a":false,"q1b":false,"q1c":false,"q2answer":""}}}`,
  ].join("\n"),

  // --- Lecture Summary ---
  summary: [
    `{"version":"v0.10","createSurface":{"surfaceId":"main","name":"Lecture Summary"}}`,
    `{"version":"v0.10","updateComponents":{"surfaceId":"main","components":[
      {"id":"root","component":"Column","children":["title","subtitle","div0","cards","div1","actions"]},
      {"id":"title","component":"Text","text":"Financial Accounting — Lecture 5 Summary","variant":"h3"},
      {"id":"subtitle","component":"Text","text":"Key concepts covered this week","variant":"caption"},
      {"id":"div0","component":"Divider"},
      {"id":"cards","component":"List","children":["card-bs","card-is","card-cf"],"direction":"vertical"},
      {"id":"card-bs","component":"Card","child":"col-bs"},
      {"id":"col-bs","component":"Column","children":["bs-title","bs-body"]},
      {"id":"bs-title","component":"Text","text":"Balance Sheet","variant":"h5"},
      {"id":"bs-body","component":"Text","text":"A snapshot of assets, liabilities, and equity at a point in time. Assets = Liabilities + Equity.","variant":"body"},
      {"id":"card-is","component":"Card","child":"col-is"},
      {"id":"col-is","component":"Column","children":["is-title","is-body"]},
      {"id":"is-title","component":"Text","text":"Income Statement","variant":"h5"},
      {"id":"is-body","component":"Text","text":"Reports revenues and expenses over a period. Net Income = Revenue − Expenses.","variant":"body"},
      {"id":"card-cf","component":"Card","child":"col-cf"},
      {"id":"col-cf","component":"Column","children":["cf-title","cf-body"]},
      {"id":"cf-title","component":"Text","text":"Cash Flow Statement","variant":"h5"},
      {"id":"cf-body","component":"Text","text":"Tracks cash inflows and outflows across operating, investing, and financing activities.","variant":"body"},
      {"id":"div1","component":"Divider"},
      {"id":"actions","component":"Row","children":["btn-fc","btn-quiz"]},
      {"id":"btn-fc","component":"Button","label":"Generate Flashcards","variant":"primary","action":{"event":{"name":"gen_flashcards"}}},
      {"id":"btn-quiz","component":"Button","label":"Practice Quiz","variant":"outline","action":{"event":{"name":"gen_quiz"}}}
    ]}}`,
  ].join("\n"),

  // --- Study Planner (form with data binding) ---
  planner: [
    `{"version":"v0.10","createSurface":{"surfaceId":"main","name":"Study Planner","sendDataModel":true}}`,
    `{"version":"v0.10","updateComponents":{"surfaceId":"main","components":[
      {"id":"root","component":"Column","children":["title","desc","div0","f-subject","f-date","f-hours","f-topics","div1","btn-create"]},
      {"id":"title","component":"Text","text":"Personalised Study Planner","variant":"h3"},
      {"id":"desc","component":"Text","text":"Tell me about your upcoming exam and I'll create a schedule.","variant":"body"},
      {"id":"div0","component":"Divider"},
      {"id":"f-subject","component":"TextField","label":"Exam subject","textFieldType":"shortText","dataPath":"/examSubject"},
      {"id":"f-date","component":"TextField","label":"Exam date","textFieldType":"date","dataPath":"/examDate"},
      {"id":"f-hours","component":"TextField","label":"Study hours available per day","textFieldType":"number","dataPath":"/hoursPerDay"},
      {"id":"f-topics","component":"TextField","label":"Topics you find hardest (optional)","textFieldType":"longText","dataPath":"/hardTopics"},
      {"id":"div1","component":"Divider"},
      {"id":"btn-create","component":"Button","label":"Create My Study Plan","variant":"primary","action":{"event":{"name":"create_plan"}}}
    ]}}`,
    `{"version":"v0.10","updateDataModel":{"surfaceId":"main","value":{"examSubject":"","examDate":"","hoursPerDay":"3","hardTopics":""}}}`,
  ].join("\n"),

  // --- Assignment Feedback (data-bound scorecard) ---
  feedback: [
    `{"version":"v0.10","createSurface":{"surfaceId":"main","name":"Assignment Feedback"}}`,
    `{"version":"v0.10","updateComponents":{"surfaceId":"main","components":[
      {"id":"root","component":"Column","children":["title","score-row","div0","criteria","div1","actions"]},
      {"id":"title","component":"Text","text":"Assignment Feedback — Porter Analysis Essay","variant":"h3"},
      {"id":"score-row","component":"Row","children":["score-lbl","score-val"],"justify":"spaceBetween","align":"center"},
      {"id":"score-lbl","component":"Text","text":"Overall Score","variant":"h4"},
      {"id":"score-val","component":"Text","text":{"path":"/overall"},"variant":"h4"},
      {"id":"div0","component":"Divider"},
      {"id":"criteria","component":"List","children":["c1","c2","c3","c4"],"direction":"vertical"},
      {"id":"c1","component":"Card","child":"c1-row"},
      {"id":"c1-row","component":"Row","children":["c1-col","c1-score"],"justify":"spaceBetween","align":"center"},
      {"id":"c1-col","component":"Column","children":["c1-title","c1-note"]},
      {"id":"c1-title","component":"Text","text":"Argument Clarity","variant":"h5"},
      {"id":"c1-note","component":"Text","text":"Well-structured with clear thesis","variant":"caption"},
      {"id":"c1-score","component":"Text","text":{"path":"/scores/clarity"},"variant":"body"},
      {"id":"c2","component":"Card","child":"c2-row"},
      {"id":"c2-row","component":"Row","children":["c2-col","c2-score"],"justify":"spaceBetween","align":"center"},
      {"id":"c2-col","component":"Column","children":["c2-title","c2-note"]},
      {"id":"c2-title","component":"Text","text":"Evidence & Citations","variant":"h5"},
      {"id":"c2-note","component":"Text","text":"Good sources; add more recent examples","variant":"caption"},
      {"id":"c2-score","component":"Text","text":{"path":"/scores/evidence"},"variant":"body"},
      {"id":"c3","component":"Card","child":"c3-row"},
      {"id":"c3-row","component":"Row","children":["c3-col","c3-score"],"justify":"spaceBetween","align":"center"},
      {"id":"c3-col","component":"Column","children":["c3-title","c3-note"]},
      {"id":"c3-title","component":"Text","text":"Critical Analysis","variant":"h5"},
      {"id":"c3-note","component":"Text","text":"Strong analysis of competitive rivalry","variant":"caption"},
      {"id":"c3-score","component":"Text","text":{"path":"/scores/analysis"},"variant":"body"},
      {"id":"c4","component":"Card","child":"c4-row"},
      {"id":"c4-row","component":"Row","children":["c4-col","c4-score"],"justify":"spaceBetween","align":"center"},
      {"id":"c4-col","component":"Column","children":["c4-title","c4-note"]},
      {"id":"c4-title","component":"Text","text":"Writing Quality","variant":"h5"},
      {"id":"c4-note","component":"Text","text":"Minor grammar issues in conclusion","variant":"caption"},
      {"id":"c4-score","component":"Text","text":{"path":"/scores/writing"},"variant":"body"},
      {"id":"div1","component":"Divider"},
      {"id":"actions","component":"Row","children":["btn-comments","btn-resubmit"]},
      {"id":"btn-comments","component":"Button","label":"View Detailed Comments","variant":"primary","action":{"event":{"name":"view_comments"}}},
      {"id":"btn-resubmit","component":"Button","label":"Resubmit","variant":"outline","action":{"event":{"name":"resubmit"}}}
    ]}}`,
    // Data model — the Text components bound to paths get their values here
    `{"version":"v0.10","updateDataModel":{"surfaceId":"main","value":{"overall":"84 / 100","scores":{"clarity":"22 / 25","evidence":"19 / 25","analysis":"23 / 25","writing":"20 / 25"}}}}`,
  ].join("\n"),
}

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
    setTimeout(() => {
      setMessages(parseA2UIMessages(jsonl))
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
      toast.info("Try one of the quick prompts — quiz, summary, planner, or feedback.", { duration: 4000 })
    }
    setInput("")
  }

  const handleAction = useCallback((action: A2UIAction) => {
    setLastAction(action)
    toast.success(`Action "${action.action.name}" received`)
  }, [])

  const prettyJsonl = rawJsonl
    .split("\n")
    .map((line) => {
      try {
        return JSON.stringify(JSON.parse(line), null, 2)
      } catch {
        return line
      }
    })
    .join("\n\n---\n\n")

  return (
    <div className="space-y-6">
      <PageHeader
        title="A2UI Example"
        description="AI agents return rich, interactive UI described as declarative JSON — not plain text."
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "A2UI Demo" }]}
      />

      {/* Protocol explainer */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">What is A2UI?</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>A2UI</strong> (Agent-to-UI, by Google) is an open protocol where agents stream
            JSONL messages that describe a UI surface — cards, forms, buttons, lists — using an{" "}
            <strong>adjacency list</strong>: every component has an ID and references its children
            by ID string, making the format easy for LLMs to generate incrementally and safely.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["v0.10 spec", "Adjacency list", "Data binding", "JSONL streaming", "Apache 2.0"].map((t) => (
              <Badge key={t} variant="secondary">{t}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick prompts */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Try a prompt</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <Button key={p.intent} variant="outline" size="sm" onClick={() => runQuery(p.intent)} disabled={loading}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Free-text input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSend()}
          placeholder="e.g. Quiz me on Porter's Five Forces…"
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Rendered surface + raw JSONL tabs */}
      {(messages.length > 0 || loading) && (
        <Tabs defaultValue="rendered">
          <TabsList className="mb-2">
            <TabsTrigger value="rendered">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Rendered UI
            </TabsTrigger>
            <TabsTrigger value="raw">
              <Code2 className="h-3.5 w-3.5 mr-1.5" />
              Raw A2UI JSONL
            </TabsTrigger>
          </TabsList>

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
                  <A2UIRenderer messages={messages} surfaceId="main" onAction={handleAction} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raw">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-normal">
                  A2UI v0.10 message stream — one JSON object per line (JSONL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted rounded-lg p-4 overflow-auto max-h-[480px] whitespace-pre-wrap leading-relaxed">
                  {prettyJsonl}
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
              ↩ A2UIAction sent back to agent
            </p>
            <pre className="text-xs text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded p-3 overflow-auto">
              {JSON.stringify(lastAction, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Architecture explainer */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Protocol Flow</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong className="text-foreground">createSurface</strong> — agent initialises a named
              canvas and declares which component catalog it will use.
            </li>
            <li>
              <strong className="text-foreground">updateComponents</strong> — agent sends a flat
              adjacency list of component entries. Each entry has an{" "}
              <code className="font-mono text-xs">id</code> and its children are referenced by ID string —
              never nested inline. A component with{" "}
              <code className="font-mono text-xs">id: "root"</code> is the tree root.
            </li>
            <li>
              <strong className="text-foreground">updateDataModel</strong> — agent populates a shared
              data model via JSON Pointer paths (e.g.{" "}
              <code className="font-mono text-xs">/scores/clarity</code>).
              Component values bound to <code className="font-mono text-xs">{`{"path": "..."}`}</code>{" "}
              read from this model.
            </li>
            <li>
              <strong className="text-foreground">A2UIAction</strong> — when the user interacts
              (button click, form submit), the renderer fires an action event carrying the event name,
              component ID, timestamp, and the current data model back to the agent for the next turn.
            </li>
          </ol>
          <div className="rounded-lg bg-muted p-3 font-mono text-xs leading-loose">
            {`User prompt → LLM (A2UI system prompt)\n   → createSurface (JSONL)\n   → updateComponents (flat adjacency list)\n   → updateDataModel (JSON Pointer values)\n   → A2UIRenderer → native React widgets\n   → A2UIAction → LLM (next turn)`}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
