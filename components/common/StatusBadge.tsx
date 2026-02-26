import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Assignment statuses
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-800 border-blue-200" },
  graded: { label: "Graded", className: "bg-green-100 text-green-800 border-green-200" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-800 border-red-200" },
  // AI help levels
  none: { label: "No AI", className: "bg-gray-100 text-gray-800 border-gray-200" },
  hints: { label: "Hints Only", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  feedback: { label: "Feedback", className: "bg-blue-100 text-blue-800 border-blue-200" },
  full: { label: "Full AI", className: "bg-green-100 text-green-800 border-green-200" },
  // QnA statuses
  open: { label: "Open", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  answered: { label: "Answered", className: "bg-green-100 text-green-800 border-green-200" },
  pinned: { label: "Pinned", className: "bg-purple-100 text-purple-800 border-purple-200" },
  // Model/connector statuses
  active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 border-gray-200" },
  connected: { label: "Connected", className: "bg-green-100 text-green-800 border-green-200" },
  disconnected: { label: "Disconnected", className: "bg-red-100 text-red-800 border-red-200" },
  syncing: { label: "Syncing", className: "bg-blue-100 text-blue-800 border-blue-200" },
  error: { label: "Error", className: "bg-red-100 text-red-800 border-red-200" },
  // Incident statuses
  new: { label: "New", className: "bg-blue-100 text-blue-800 border-blue-200" },
  investigating: { label: "Investigating", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  mitigated: { label: "Mitigated", className: "bg-orange-100 text-orange-800 border-orange-200" },
  closed: { label: "Closed", className: "bg-green-100 text-green-800 border-green-200" },
  // Severity
  low: { label: "Low", className: "bg-blue-100 text-blue-800 border-blue-200" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  high: { label: "High", className: "bg-orange-100 text-orange-800 border-orange-200" },
  critical: { label: "Critical", className: "bg-red-100 text-red-800 border-red-200" },
  // Policy
  draft: { label: "Draft", className: "bg-gray-100 text-gray-800 border-gray-200" },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-600 border-gray-200" },
  pending_approval: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800 border-gray-200" }
  return (
    <Badge variant="outline" className={cn(config.className, "text-xs font-medium", className)}>
      {config.label}
    </Badge>
  )
}
