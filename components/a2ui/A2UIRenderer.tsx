"use client"

/**
 * A2UIRenderer — React renderer for the A2UI v0.10 protocol.
 *
 * Architecture:
 *  • Components are stored in a flat map (adjacency list) keyed by ID.
 *  • A root component with id "root" is the tree entry point.
 *  • Children are ID strings resolved at render time — this mirrors the
 *    spec's "safe like data" design (no arbitrary nesting in the JSON).
 *  • The renderer maintains surface state via useReducer and re-processes
 *    messages whenever the input list changes.
 *
 * Spec: https://github.com/google/A2UI (v0.10)
 */

import { useEffect, useReducer, useCallback } from "react"
import {
  A2UIMessage,
  A2UISurface,
  A2UIComponentEntry,
  A2UIAction,
  DataModel,
  resolveString,
  resolveBoolean,
  resolveNumber,
  setPath,
  EventAction,
  TextComponent,
  ButtonComponent,
  CardComponent,
  RowComponent,
  ColumnComponent,
  ListComponent,
  TextFieldComponent,
  CheckBoxComponent,
  SliderComponent,
} from "@/lib/a2ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Surface state reducer
// ---------------------------------------------------------------------------

type SurfaceMap = Record<string, A2UISurface>

type ReducerAction =
  | { type: "CREATE_SURFACE"; surfaceId: string; name?: string; catalogId?: string }
  | { type: "UPDATE_COMPONENTS"; surfaceId: string; components: A2UIComponentEntry[] }
  | { type: "UPDATE_DATA_MODEL"; surfaceId: string; path?: string; value: unknown }
  | { type: "DELETE_SURFACE"; surfaceId: string }
  | { type: "SET_DATA_PATH"; surfaceId: string; path: string; value: unknown }

function surfaceReducer(state: SurfaceMap, action: ReducerAction): SurfaceMap {
  switch (action.type) {
    case "CREATE_SURFACE":
      return {
        ...state,
        [action.surfaceId]: {
          id: action.surfaceId,
          name: action.name,
          catalogId: action.catalogId,
          components: {},
          dataModel: {},
        },
      }

    case "UPDATE_COMPONENTS": {
      const surface = state[action.surfaceId] ?? {
        id: action.surfaceId,
        components: {},
        dataModel: {},
      }
      const updated = { ...surface.components }
      for (const entry of action.components) {
        updated[entry.id] = entry
      }
      return { ...state, [action.surfaceId]: { ...surface, components: updated } }
    }

    case "UPDATE_DATA_MODEL": {
      const surface = state[action.surfaceId]
      if (!surface) return state
      const newModel = action.path
        ? setPath(surface.dataModel, action.path, action.value)
        : (action.value as DataModel)
      return { ...state, [action.surfaceId]: { ...surface, dataModel: newModel } }
    }

    case "DELETE_SURFACE": {
      const next = { ...state }
      delete next[action.surfaceId]
      return next
    }

    case "SET_DATA_PATH": {
      const surface = state[action.surfaceId]
      if (!surface) return state
      return {
        ...state,
        [action.surfaceId]: {
          ...surface,
          dataModel: setPath(surface.dataModel, action.path, action.value),
        },
      }
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Component renderer — resolves children by ID from the flat map
// ---------------------------------------------------------------------------

interface RenderCtx {
  surfaceId: string
  components: Record<string, A2UIComponentEntry>
  dataModel: DataModel
  onAction: (action: A2UIAction) => void
  onDataChange: (path: string, value: unknown) => void
}

function renderComponent(id: string, ctx: RenderCtx, depth = 0): React.ReactNode {
  if (depth > 20) return null // guard against circular refs
  const entry = ctx.components[id]
  if (!entry) return null

  const { surfaceId, components, dataModel, onAction, onDataChange } = ctx
  const dm = dataModel

  switch (entry.component) {
    // --- Text ---
    case "Text": {
      const c = entry as unknown as TextComponent
      const variantClass: Record<string, string> = {
        h1: "text-3xl font-bold",
        h2: "text-2xl font-bold",
        h3: "text-xl font-semibold",
        h4: "text-lg font-semibold",
        h5: "text-base font-semibold",
        caption: "text-xs text-muted-foreground",
        body: "text-sm",
      }
      return (
        <p key={id} className={cn("leading-relaxed", variantClass[c.variant ?? "body"])}>
          {resolveString(c.text, dm)}
        </p>
      )
    }

    // --- Button ---
    case "Button": {
      const c = entry as unknown as ButtonComponent
      const handleClick = () => {
        if (!c.action) return
        if ("functionCall" in c.action) {
          // local function calls (e.g. openUrl) — fire and ignore for now
          return
        }
        const ev = c.action as EventAction
        onAction({
          version: "v0.10",
          action: {
            name: ev.event.name,
            surfaceId,
            sourceComponentId: id,
            timestamp: new Date().toISOString(),
            context: ev.context,
            dataModel: dm,
          },
        })
      }
      return (
        <Button
          key={id}
          variant={
            c.variant === "primary"
              ? "default"
              : c.variant === "outline"
              ? "outline"
              : "secondary"
          }
          onClick={handleClick}
        >
          {c.child
            ? renderComponent(c.child, ctx, depth + 1)
            : c.label ?? ""}
        </Button>
      )
    }

    // --- Card ---
    case "Card": {
      const c = entry as unknown as CardComponent
      return (
        <Card key={id}>
          <CardContent className="p-4">
            {renderComponent(c.child, ctx, depth + 1)}
          </CardContent>
        </Card>
      )
    }

    // --- Row ---
    case "Row": {
      const c = entry as unknown as RowComponent
      return (
        <div
          key={id}
          className={cn(
            "flex flex-row gap-3 flex-wrap",
            c.justify === "spaceBetween"
              ? "justify-between"
              : c.justify === "center"
              ? "justify-center"
              : c.justify === "end"
              ? "justify-end"
              : "justify-start",
            c.align === "center"
              ? "items-center"
              : c.align === "end"
              ? "items-end"
              : "items-start"
          )}
        >
          {c.children.map((childId) => renderComponent(childId, ctx, depth + 1))}
        </div>
      )
    }

    // --- Column ---
    case "Column": {
      const c = entry as unknown as ColumnComponent
      return (
        <div key={id} className="flex flex-col gap-3">
          {c.children.map((childId) => renderComponent(childId, ctx, depth + 1))}
        </div>
      )
    }

    // --- List ---
    case "List": {
      const c = entry as unknown as ListComponent
      return (
        <div
          key={id}
          className={cn(
            "flex gap-3",
            c.direction === "horizontal" ? "flex-row flex-wrap" : "flex-col"
          )}
        >
          {c.children.map((childId) => renderComponent(childId, ctx, depth + 1))}
        </div>
      )
    }

    // --- TextField ---
    case "TextField": {
      const c = entry as unknown as TextFieldComponent
      const label = resolveString(c.label, dm)
      const value = c.dataPath
        ? String(
            (dm as Record<string, unknown>)[c.dataPath] ??
              resolveString(c.value, dm)
          )
        : resolveString(c.value, dm)
      const isLong = c.textFieldType === "longText"
      return (
        <div key={id} className="space-y-1.5">
          <Label>{label}</Label>
          {isLong ? (
            <Textarea
              value={value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                c.dataPath && onDataChange(c.dataPath, e.target.value)
              }
              placeholder={label}
              rows={4}
            />
          ) : (
            <Input
              type={
                c.textFieldType === "number"
                  ? "number"
                  : c.textFieldType === "obscured"
                  ? "password"
                  : c.textFieldType === "date"
                  ? "date"
                  : "text"
              }
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                c.dataPath && onDataChange(c.dataPath, e.target.value)
              }
              placeholder={label}
            />
          )}
        </div>
      )
    }

    // --- CheckBox ---
    case "CheckBox": {
      const c = entry as unknown as CheckBoxComponent
      const label = resolveString(c.label, dm)
      const checked = c.dataPath
        ? Boolean((dm as Record<string, unknown>)[c.dataPath])
        : resolveBoolean(c.value, dm)
      return (
        <div key={id} className="flex items-center gap-2">
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={(val: boolean | "indeterminate") =>
              c.dataPath && onDataChange(c.dataPath, Boolean(val))
            }
          />
          <Label htmlFor={id} className="cursor-pointer">
            {label}
          </Label>
        </div>
      )
    }

    // --- Slider ---
    case "Slider": {
      const c = entry as unknown as SliderComponent
      const val = c.dataPath
        ? Number((dm as Record<string, unknown>)[c.dataPath] ?? resolveNumber(c.value, dm))
        : resolveNumber(c.value, dm)
      return (
        <div key={id} className="space-y-2">
          <Slider
            value={[val]}
            min={resolveNumber(c.minValue, dm)}
            max={resolveNumber(c.maxValue, dm)}
            onValueChange={([v]: number[]) =>
              c.dataPath && onDataChange(c.dataPath, v)
            }
          />
        </div>
      )
    }

    // --- Divider ---
    case "Divider":
      return <Separator key={id} />

    // --- Icon (stub) ---
    case "Icon":
      return (
        <span key={id} className="text-muted-foreground text-sm font-mono">
          [{(entry as unknown as { name: string }).name}]
        </span>
      )

    // --- Image ---
    case "Image": {
      const url = resolveString((entry as unknown as { url: string }).url, dm)
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={id}
          src={url}
          alt={(entry as { alt?: string }).alt ?? ""}
          className="rounded-lg max-w-full object-contain"
        />
      )
    }


    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Surface view
// ---------------------------------------------------------------------------

interface SurfaceViewProps {
  surface: A2UISurface
  onAction: (action: A2UIAction) => void
  onDataChange: (path: string, value: unknown) => void
}

function SurfaceView({ surface, onAction, onDataChange }: SurfaceViewProps) {
  const ctx: RenderCtx = {
    surfaceId: surface.id,
    components: surface.components,
    dataModel: surface.dataModel,
    onAction,
    onDataChange,
  }
  // Start from the "root" component
  const root = renderComponent("root", ctx)
  if (!root) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No root component found. Make sure the agent includes a component with id "root".
      </p>
    )
  }
  return <>{root}</>
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface A2UIRendererProps {
  /** A2UI v0.10 messages emitted by the agent */
  messages: A2UIMessage[]
  /** Which surface to render (default: "main") */
  surfaceId?: string
  /** Called when the user fires an event action */
  onAction?: (action: A2UIAction) => void
}

/**
 * A2UIRenderer
 *
 * Drop this into any page to display agent-generated UI.
 * Feed it the list of A2UIMessage objects and it will maintain the
 * surface state, resolving component IDs to render the adjacency list tree.
 */
export function A2UIRenderer({
  messages,
  surfaceId = "main",
  onAction,
}: A2UIRendererProps) {
  const [surfaces, dispatch] = useReducer(surfaceReducer, {})

  useEffect(() => {
    dispatch({ type: "DELETE_SURFACE", surfaceId })

    for (const msg of messages) {
      if ("createSurface" in msg) {
        dispatch({
          type: "CREATE_SURFACE",
          surfaceId: msg.createSurface.surfaceId,
          name: msg.createSurface.name,
          catalogId: msg.createSurface.catalogId,
        })
      } else if ("updateComponents" in msg) {
        dispatch({
          type: "UPDATE_COMPONENTS",
          surfaceId: msg.updateComponents.surfaceId,
          components: msg.updateComponents.components,
        })
      } else if ("updateDataModel" in msg) {
        dispatch({
          type: "UPDATE_DATA_MODEL",
          surfaceId: msg.updateDataModel.surfaceId,
          path: msg.updateDataModel.path,
          value: msg.updateDataModel.value,
        })
      } else if ("deleteSurface" in msg) {
        dispatch({
          type: "DELETE_SURFACE",
          surfaceId: msg.deleteSurface.surfaceId,
        })
      }
    }
  }, [messages, surfaceId])

  const handleAction = useCallback(
    (action: A2UIAction) => onAction?.(action),
    [onAction]
  )

  const handleDataChange = useCallback(
    (path: string, value: unknown) =>
      dispatch({ type: "SET_DATA_PATH", surfaceId, path, value }),
    [surfaceId]
  )

  const surface = surfaces[surfaceId]
  if (!surface || Object.keys(surface.components).length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No UI generated yet.
      </div>
    )
  }

  return (
    <SurfaceView
      surface={surface}
      onAction={handleAction}
      onDataChange={handleDataChange}
    />
  )
}
