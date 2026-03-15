/**
 * A2UI (Agent-to-UI) Type Definitions
 *
 * A2UI is an open standard by Google that allows AI agents to generate
 * rich, declarative UI via JSON messages. The agent describes *what* to show
 * (text, cards, buttons, forms…) and the renderer maps those to native widgets.
 *
 * Spec reference: https://github.com/google/A2UI
 * This file implements the v0.9 message format.
 */

// ---------------------------------------------------------------------------
// Component definitions
// ---------------------------------------------------------------------------

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "caption" | "body"
export type ButtonVariant = "primary" | "secondary" | "outline"
export type TextFieldType = "shortText" | "longText" | "number" | "obscured" | "date"
export type Distribution = "start" | "center" | "end" | "spaceBetween" | "spaceAround"
export type Alignment = "start" | "center" | "end"

export interface TextComponent {
  component: "Text"
  text: string
  variant?: TextVariant
}

export interface ButtonComponent {
  component: "Button"
  label: string
  variant?: ButtonVariant
  /** Action identifier sent back to the agent when clicked */
  action: string
}

export interface CardComponent {
  component: "Card"
  child: A2UIComponent
}

export interface RowComponent {
  component: "Row"
  children: A2UIComponent[]
  justify?: Distribution
  align?: Alignment
}

export interface ColumnComponent {
  component: "Column"
  children: A2UIComponent[]
  justify?: Distribution
  align?: Alignment
}

export interface ListComponent {
  component: "List"
  children: A2UIComponent[]
  direction?: "vertical" | "horizontal"
}

export interface TextFieldComponent {
  component: "TextField"
  label: string
  value?: string
  textFieldType?: TextFieldType
  /** Data-model key to bind to */
  dataKey?: string
}

export interface CheckBoxComponent {
  component: "CheckBox"
  label: string
  value?: boolean
  dataKey?: string
}

export interface DividerComponent {
  component: "Divider"
}

export interface IconComponent {
  component: "Icon"
  name: string
}

export interface ImageComponent {
  component: "Image"
  url: string
  alt?: string
  fit?: "cover" | "contain" | "fill"
}

export type A2UIComponent =
  | TextComponent
  | ButtonComponent
  | CardComponent
  | RowComponent
  | ColumnComponent
  | ListComponent
  | TextFieldComponent
  | CheckBoxComponent
  | DividerComponent
  | IconComponent
  | ImageComponent

// ---------------------------------------------------------------------------
// Components with IDs (as placed in an A2UI surface)
// ---------------------------------------------------------------------------

export interface A2UIComponentEntry {
  /** Unique ID within the surface; used for incremental updates */
  id: string
  /** The component descriptor */
  component: A2UIComponent
}

// ---------------------------------------------------------------------------
// v0.9 Message types
// ---------------------------------------------------------------------------

/** Initialise a named surface with its component catalog */
export interface CreateSurfaceMessage {
  version: "v0.9"
  createSurface: {
    surfaceId: string
    /** Human-readable surface name */
    name?: string
  }
}

/** Add or replace components on a surface */
export interface UpdateComponentsMessage {
  version: "v0.9"
  updateComponents: {
    surfaceId: string
    components: A2UIComponentEntry[]
  }
}

/** Update the data model (key-value pairs shared with components) */
export interface UpdateDataModelMessage {
  version: "v0.9"
  updateDataModel: {
    surfaceId: string
    /** JSON-Pointer paths → native JSON values */
    updates: Record<string, unknown>
  }
}

/** Remove a surface and all its components */
export interface DeleteSurfaceMessage {
  version: "v0.9"
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
// Action message (sent from UI back to agent when user interacts)
// ---------------------------------------------------------------------------

export interface A2UIAction {
  surfaceId: string
  componentId: string
  action: string
  /** Current data model at the time of the action */
  dataModel?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Surface state (managed by the renderer)
// ---------------------------------------------------------------------------

export interface A2UISurface {
  id: string
  name?: string
  components: A2UIComponentEntry[]
  dataModel: Record<string, unknown>
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
