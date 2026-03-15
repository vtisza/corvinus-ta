"use client"

/**
 * A2UIRenderer — React renderer for the A2UI protocol.
 *
 * Responsibilities:
 *  1. Accept a list of A2UIMessage objects (from an AI agent).
 *  2. Maintain a surface state (component tree + data model).
 *  3. Render the surface using Tailwind-styled native React components.
 *  4. Call onAction() when the user interacts with a widget.
 *
 * The component catalog here maps to the shadcn/ui components already used
 * in the Corvinus TA project so no extra dependencies are needed.
 */

import { useEffect, useReducer, useCallback } from "react"
import {
  A2UIMessage,
  A2UISurface,
  A2UIComponent,
  A2UIComponentEntry,
  A2UIAction,
} from "@/lib/a2ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Surface state reducer
// ---------------------------------------------------------------------------

type SurfaceMap = Record<string, A2UISurface>

type Action =
  | { type: "CREATE_SURFACE"; surfaceId: string; name?: string }
  | { type: "UPDATE_COMPONENTS"; surfaceId: string; components: A2UIComponentEntry[] }
  | { type: "UPDATE_DATA_MODEL"; surfaceId: string; updates: Record<string, unknown> }
  | { type: "DELETE_SURFACE"; surfaceId: string }
  | { type: "SET_DATA_VALUE"; surfaceId: string; key: string; value: unknown }

function surfaceReducer(state: SurfaceMap, action: Action): SurfaceMap {
  switch (action.type) {
    case "CREATE_SURFACE":
      return {
        ...state,
        [action.surfaceId]: {
          id: action.surfaceId,
          name: action.name,
          components: [],
          dataModel: {},
        },
      }
    case "UPDATE_COMPONENTS": {
      const surface = state[action.surfaceId] ?? {
        id: action.surfaceId,
        components: [],
        dataModel: {},
      }
      // Merge: replace existing entries with matching IDs, append new ones
      const existing = [...surface.components]
      for (const incoming of action.components) {
        const idx = existing.findIndex((c) => c.id === incoming.id)
        if (idx >= 0) {
          existing[idx] = incoming
        } else {
          existing.push(incoming)
        }
      }
      return { ...state, [action.surfaceId]: { ...surface, components: existing } }
    }
    case "UPDATE_DATA_MODEL": {
      const surface = state[action.surfaceId]
      if (!surface) return state
      return {
        ...state,
        [action.surfaceId]: {
          ...surface,
          dataModel: { ...surface.dataModel, ...action.updates },
        },
      }
    }
    case "DELETE_SURFACE": {
      const next = { ...state }
      delete next[action.surfaceId]
      return next
    }
    case "SET_DATA_VALUE": {
      const surface = state[action.surfaceId]
      if (!surface) return state
      return {
        ...state,
        [action.surfaceId]: {
          ...surface,
          dataModel: { ...surface.dataModel, [action.key]: action.value },
        },
      }
    }
    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Component renderer (recursive)
// ---------------------------------------------------------------------------

interface ComponentRendererProps {
  entry: A2UIComponentEntry
  surfaceId: string
  dataModel: Record<string, unknown>
  onAction: (action: A2UIAction) => void
  onDataChange: (key: string, value: unknown) => void
}

function ComponentRenderer({
  entry,
  surfaceId,
  dataModel,
  onAction,
  onDataChange,
}: ComponentRendererProps) {
  const comp = entry.component

  switch (comp.component) {
    case "Text": {
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
        <p className={cn("leading-relaxed", variantClass[comp.variant ?? "body"])}>
          {comp.text}
        </p>
      )
    }

    case "Button":
      return (
        <Button
          variant={
            comp.variant === "primary"
              ? "default"
              : comp.variant === "outline"
              ? "outline"
              : "secondary"
          }
          onClick={() =>
            onAction({
              surfaceId,
              componentId: entry.id,
              action: comp.action,
              dataModel,
            })
          }
        >
          {comp.label}
        </Button>
      )

    case "Card":
      return (
        <Card>
          <CardContent className="p-4">
            <ComponentRenderer
              entry={{ id: `${entry.id}__child`, component: comp.child }}
              surfaceId={surfaceId}
              dataModel={dataModel}
              onAction={onAction}
              onDataChange={onDataChange}
            />
          </CardContent>
        </Card>
      )

    case "Row":
      return (
        <div
          className={cn(
            "flex flex-row gap-3 flex-wrap",
            comp.justify === "spaceBetween"
              ? "justify-between"
              : comp.justify === "center"
              ? "justify-center"
              : comp.justify === "end"
              ? "justify-end"
              : "justify-start",
            comp.align === "center"
              ? "items-center"
              : comp.align === "end"
              ? "items-end"
              : "items-start"
          )}
        >
          {comp.children.map((child, i) => (
            <ComponentRenderer
              key={i}
              entry={{ id: `${entry.id}__${i}`, component: child }}
              surfaceId={surfaceId}
              dataModel={dataModel}
              onAction={onAction}
              onDataChange={onDataChange}
            />
          ))}
        </div>
      )

    case "Column":
      return (
        <div className="flex flex-col gap-3">
          {comp.children.map((child, i) => (
            <ComponentRenderer
              key={i}
              entry={{ id: `${entry.id}__${i}`, component: child }}
              surfaceId={surfaceId}
              dataModel={dataModel}
              onAction={onAction}
              onDataChange={onDataChange}
            />
          ))}
        </div>
      )

    case "List":
      return (
        <div
          className={cn(
            "flex gap-3",
            comp.direction === "horizontal" ? "flex-row flex-wrap" : "flex-col"
          )}
        >
          {comp.children.map((child, i) => (
            <ComponentRenderer
              key={i}
              entry={{ id: `${entry.id}__${i}`, component: child }}
              surfaceId={surfaceId}
              dataModel={dataModel}
              onAction={onAction}
              onDataChange={onDataChange}
            />
          ))}
        </div>
      )

    case "TextField": {
      const value = comp.dataKey
        ? (dataModel[comp.dataKey] as string) ?? comp.value ?? ""
        : comp.value ?? ""
      const isLong = comp.textFieldType === "longText"
      return (
        <div className="space-y-1.5">
          <Label>{comp.label}</Label>
          {isLong ? (
            <Textarea
              value={value}
              onChange={(e) =>
                comp.dataKey && onDataChange(comp.dataKey, e.target.value)
              }
              placeholder={comp.label}
              rows={4}
            />
          ) : (
            <Input
              type={
                comp.textFieldType === "number"
                  ? "number"
                  : comp.textFieldType === "obscured"
                  ? "password"
                  : comp.textFieldType === "date"
                  ? "date"
                  : "text"
              }
              value={value}
              onChange={(e) =>
                comp.dataKey && onDataChange(comp.dataKey, e.target.value)
              }
              placeholder={comp.label}
            />
          )}
        </div>
      )
    }

    case "CheckBox": {
      const checked = comp.dataKey
        ? Boolean(dataModel[comp.dataKey])
        : Boolean(comp.value)
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={entry.id}
            checked={checked}
            onCheckedChange={(val) =>
              comp.dataKey && onDataChange(comp.dataKey, Boolean(val))
            }
          />
          <Label htmlFor={entry.id} className="cursor-pointer">
            {comp.label}
          </Label>
        </div>
      )
    }

    case "Divider":
      return <Separator />

    case "Icon":
      // Inline SVG placeholder — in production, map to your icon library
      return (
        <span className="text-muted-foreground text-sm font-mono">[{comp.name}]</span>
      )

    case "Image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={comp.url}
          alt={comp.alt ?? ""}
          className={cn(
            "rounded-lg max-w-full",
            comp.fit === "cover" ? "object-cover" : "object-contain"
          )}
        />
      )

    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Surface renderer
// ---------------------------------------------------------------------------

interface A2UISurfaceRendererProps {
  surface: A2UISurface
  onAction: (action: A2UIAction) => void
  onDataChange: (key: string, value: unknown) => void
}

function SurfaceRenderer({ surface, onAction, onDataChange }: A2UISurfaceRendererProps) {
  return (
    <div className="space-y-4">
      {surface.components.map((entry) => (
        <ComponentRenderer
          key={entry.id}
          entry={entry}
          surfaceId={surface.id}
          dataModel={surface.dataModel}
          onAction={onAction}
          onDataChange={onDataChange}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface A2UIRendererProps {
  /** A2UI v0.9 messages emitted by the agent (may grow over time) */
  messages: A2UIMessage[]
  /** Which surface to render (default: "main") */
  surfaceId?: string
  /** Called when the user interacts with a widget */
  onAction?: (action: A2UIAction) => void
}

/**
 * A2UIRenderer
 *
 * Drop this into any page to display agent-generated UI.
 * Feed it the list of A2UI messages your agent returned and it will
 * maintain the surface state automatically.
 */
export function A2UIRenderer({
  messages,
  surfaceId = "main",
  onAction,
}: A2UIRendererProps) {
  const [surfaces, dispatch] = useReducer(surfaceReducer, {})

  // Re-process messages whenever they change
  useEffect(() => {
    // Reset target surface each time messages change
    dispatch({ type: "DELETE_SURFACE", surfaceId })

    for (const msg of messages) {
      if ("createSurface" in msg) {
        dispatch({
          type: "CREATE_SURFACE",
          surfaceId: msg.createSurface.surfaceId,
          name: msg.createSurface.name,
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
          updates: msg.updateDataModel.updates,
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
    (action: A2UIAction) => {
      onAction?.(action)
    },
    [onAction]
  )

  const handleDataChange = useCallback(
    (key: string, value: unknown) => {
      dispatch({ type: "SET_DATA_VALUE", surfaceId, key, value })
    },
    [surfaceId]
  )

  const surface = surfaces[surfaceId]
  if (!surface || surface.components.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No UI generated yet.
      </div>
    )
  }

  return (
    <SurfaceRenderer
      surface={surface}
      onAction={handleAction}
      onDataChange={handleDataChange}
    />
  )
}
