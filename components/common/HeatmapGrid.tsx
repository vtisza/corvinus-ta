import { cn } from "@/lib/utils"

interface HeatmapItem {
  topic: string
  mastery: number
}

interface HeatmapGridProps {
  items: HeatmapItem[]
  title?: string
}

function getMasteryColor(mastery: number): string {
  if (mastery >= 80) return "bg-green-500"
  if (mastery >= 60) return "bg-yellow-400"
  if (mastery >= 40) return "bg-orange-400"
  return "bg-red-400"
}

function getMasteryLabel(mastery: number): string {
  if (mastery >= 80) return "Strong"
  if (mastery >= 60) return "Developing"
  if (mastery >= 40) return "Needs Work"
  return "Weak"
}

export function HeatmapGrid({ items, title }: HeatmapGridProps) {
  return (
    <div>
      {title && <p className="text-sm font-medium mb-3">{title}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.topic}
            className="relative rounded-lg overflow-hidden border"
          >
            <div
              className={cn("absolute inset-0 opacity-20", getMasteryColor(item.mastery))}
            />
            <div className="relative p-3">
              <p className="text-xs font-medium text-foreground line-clamp-2">{item.topic}</p>
              <div className="flex items-center gap-1 mt-2">
                <div className={cn("h-2 w-2 rounded-full", getMasteryColor(item.mastery))} />
                <span className="text-xs text-muted-foreground">{item.mastery}% · {getMasteryLabel(item.mastery)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
        {[
          { label: "Strong (80%+)", color: "bg-green-500" },
          { label: "Developing (60-79%)", color: "bg-yellow-400" },
          { label: "Needs Work (40-59%)", color: "bg-orange-400" },
          { label: "Weak (<40%)", color: "bg-red-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={cn("h-2 w-2 rounded-full", item.color)} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
