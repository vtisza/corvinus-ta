import { ReactNode } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  description?: string
  icon?: ReactNode
  className?: string
}

export function MetricCard({ title, value, change, changeType = "neutral", description, icon, className }: MetricCardProps) {
  const TrendIcon = changeType === "positive" ? TrendingUp : changeType === "negative" ? TrendingDown : Minus

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                changeType === "positive" ? "text-green-600" :
                changeType === "negative" ? "text-red-600" : "text-muted-foreground"
              )}>
                <TrendIcon className="h-3 w-3" />
                <span>{change}</span>
              </div>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
