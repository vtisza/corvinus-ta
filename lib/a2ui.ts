/**
 * A2UI (Agent-to-UI) Type Definitions — v0.10
 *
 * A2UI is an open standard by Google that allows AI agents to generate
 * rich, declarative UI via JSON messages streamed as JSONL. The agent
 * describes *what* to show and the renderer maps those to native widgets.
 *
 * Key design: **Adjacency list** — components are a flat array identified
 * by `id`. Children are referenced by their ID strings (not nested objects),
 * which makes the format easy for LLMs to generate incrementally.
 *
 * Spec reference: https://github.com/google/A2UI (v0.10)
 */

// ---------------------------------------------------------------------------
// Primitive value types — either a literal or a data-model path reference
// ---------------------------------------------------------------------------

/** A literal string value or a JSON Pointer path into the data model */
export type StringValue = string | { path: string }
/** A literal number or a data-model path */
export type NumberValue = number | { path: string }
/** A literal boolean or a data-model path */
export type BooleanValue = boolean | { path: string }

// Helpers to resolve values against a data model
export function resolveString(v: StringValue | undefined, dm: DataModel): string {
  if (v === undefined) return ""
  if (typeof v === "string") return v
  return String(getPath(dm, v.path) ?? "")
}
export function resolveNumber(v: NumberValue | undefined, dm: DataModel): number {
  if (v === undefined) return 0
  if (typeof v === "number") return v
  return Number(getPath(dm, v.path) ?? 0)
}
export function resolveBoolean(v: BooleanValue | undefined, dm: DataModel): boolean {
  if (v === undefined) return false
  if (typeof v === "boolean") return v
  return Boolean(getPath(dm, v.path))
}

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

export type DataModel = Record<string, unknown>

/** Resolve a JSON Pointer path (e.g. "/user/name", "/cart/items/0") */
export function getPath(obj: unknown, path: string): unknown {
  const parts = path.replace(/^\//, "").split("/").filter(Boolean)
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

/** Set a value at a JSON Pointer path, returning a new object */
export function setPath(obj: DataModel, path: string, value: unknown): DataModel {
  const parts = path.replace(/^\//, "").split("/").filter(Boolean)
  if (parts.length === 0) return obj
  const result = { ...obj }
  let cur: Record<string, unknown> = result
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    cur[key] = typeof cur[key] === "object" && cur[key] !== null ? { ...(cur[key] as object) } : {}
    cur = cur[key] as Record<string, unknown>
  }
  cur[parts[parts.length - 1]] = value
  return result
}

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

/** An action sent from UI → agent when the user interacts */
export interface EventAction {
  event: { name: string }
  context?: Record<string, unknown>
}

/** A local function call (no server round-trip needed) */
export interface FunctionCallAction {
  functionCall: {
    call: string
    args?: Record<string, unknown>
  }
}

export type ComponentAction = EventAction | FunctionCallAction

// ---------------------------------------------------------------------------
// Component descriptors (adjacency list — children are ID strings)
// ---------------------------------------------------------------------------

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "caption" | "body"
export type ButtonVariant = "primary" | "secondary" | "outline"
export type TextFieldType = "shortText" | "longText" | "number" | "obscured" | "date"
export type Distribution = "start" | "center" | "end" | "spaceBetween" | "spaceAround"
export type Alignment = "start" | "center" | "end"

export interface TextComponent {
  component: "Text"
  text: StringValue
  variant?: TextVariant
}

export interface ButtonComponent {
  component: "Button"
  /** ID of the child component to render inside the button */
  child?: string
  /** Plain label (shorthand for a Text child) */
  label?: string
  variant?: ButtonVariant
  action: ComponentAction
}

export interface CardComponent {
  component: "Card"
  /** ID of the single child component */
  child: string
}

export interface RowComponent {
  component: "Row"
  /** IDs of child components */
  children: string[]
  justify?: Distribution
  align?: Alignment
}

export interface ColumnComponent {
  component: "Column"
  /** IDs of child components */
  children: string[]
  justify?: Distribution
  align?: Alignment
}

export interface ListComponent {
  component: "List"
  /** IDs of child components */
  children: string[]
  direction?: "vertical" | "horizontal"
}

export interface TextFieldComponent {
  component: "TextField"
  label: StringValue
  value?: StringValue
  textFieldType?: TextFieldType
  /** JSON Pointer path in data model to bind to */
  dataPath?: string
  checks?: ValidationCheck[]
}

export interface CheckBoxComponent {
  component: "CheckBox"
  label: StringValue
  value?: BooleanValue
  dataPath?: string
}

export interface SliderComponent {
  component: "Slider"
  value?: NumberValue
  minValue: NumberValue
  maxValue: NumberValue
  dataPath?: string
}

export interface DividerComponent {
  component: "Divider"
  axis?: "horizontal" | "vertical"
}

export interface IconComponent {
  component: "Icon"
  name: string
}

export interface ImageComponent {
  component: "Image"
  url: StringValue
  alt?: string
  fit?: "cover" | "contain" | "fill"
}

export interface ValidationCheck {
  call: string
  message?: string
  args?: Record<string, unknown>
}

export type A2UIComponentDescriptor =
  | TextComponent
  | ButtonComponent
  | CardComponent
  | RowComponent
  | ColumnComponent
  | ListComponent
  | TextFieldComponent
  | CheckBoxComponent
  | SliderComponent
  | DividerComponent
  | IconComponent
  | ImageComponent

// ---------------------------------------------------------------------------
// A named entry in the component flat-list (adjacency list node)
// ---------------------------------------------------------------------------

export interface A2UIComponentEntry {
  /** Unique ID within the surface */
  id: string
  /** The component descriptor */
  component: A2UIComponentDescriptor["component"]
  // All other fields from the specific descriptor (spread in practice)
  [key: string]: unknown
}

// Typed accessor helper
export function entryAs<T extends A2UIComponentDescriptor>(entry: A2UIComponentEntry): T {
  return entry as unknown as T
}

// ---------------------------------------------------------------------------
// v0.10 Message types (JSONL — one message per line)
// ---------------------------------------------------------------------------

/** Initialise a named surface with its catalog and optional theme */
export interface CreateSurfaceMessage {
  version: "v0.10"
  createSurface: {
    surfaceId: string
    name?: string
    catalogId?: string
    theme?: Record<string, unknown>
    /** Whether the server wants the data model echoed back on actions */
    sendDataModel?: boolean
  }
}

/** Add or replace components on a surface (flat adjacency list) */
export interface UpdateComponentsMessage {
  version: "v0.10"
  updateComponents: {
    surfaceId: string
    components: A2UIComponentEntry[]
  }
}

/** Update the data model at a JSON Pointer path */
export interface UpdateDataModelMessage {
  version: "v0.10"
  updateDataModel: {
    surfaceId: string
    /** JSON Pointer path (e.g. "/user/name") — omit to replace root */
    path?: string
    value: unknown
  }
}

/** Remove a surface and all its components */
export interface DeleteSurfaceMessage {
  version: "v0.10"
  deleteSurface: {
    surfaceId: string
  }
}

export type A2UIMessage =
  | CreateSurfaceMessage
  | UpdateComponentsMessage
  | UpdateDataModelMessage
  | DeleteSurfaceMessage

// ---------------------------------------------------------------------------
// Action sent from the UI back to the agent
// ---------------------------------------------------------------------------

export interface A2UIAction {
  version: "v0.10"
  action: {
    name: string
    surfaceId: string
    sourceComponentId: string
    timestamp: string
    context?: Record<string, unknown>
    /** Current data model (if sendDataModel was true) */
    dataModel?: DataModel
  }
}

// ---------------------------------------------------------------------------
// Surface state (managed by the renderer)
// ---------------------------------------------------------------------------

export interface A2UISurface {
  id: string
  name?: string
  catalogId?: string
  /** Flat map of id → component entry */
  components: Record<string, A2UIComponentEntry>
  dataModel: DataModel
}

// ---------------------------------------------------------------------------
// Helper: parse a JSONL stream of A2UI messages
// ---------------------------------------------------------------------------

export function parseA2UIMessages(jsonl: string): A2UIMessage[] {
  return jsonl
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as A2UIMessage)
}
