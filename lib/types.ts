export type Role = "student" | "instructor" | "governance"

export interface Course {
  id: string
  title: string
  code: string
  instructor: string
  instructorAvatar?: string
  progress: number
  nextDeadline?: string
  nextDeadlineTitle?: string
  tags: string[]
  semester: string
  description: string
  enrolledCount: number
  credits: number
  coverColor: string
}

export interface Assignment {
  id: string
  courseId: string
  courseTitle: string
  title: string
  dueDate: string
  status: "pending" | "submitted" | "graded" | "overdue"
  allowedAiHelp: "none" | "hints" | "feedback" | "full"
  description: string
  maxPoints: number
  points?: number
  rubric: RubricCriteria[]
}

export interface RubricCriteria {
  criterion: string
  weight: number
  description: string
}

export interface QnaPost {
  id: string
  courseId: string
  courseTitle: string
  title: string
  body: string
  tags: string[]
  status: "open" | "answered" | "pinned"
  repliesCount: number
  views: number
  author: string
  createdAt: string
  aiSuggestedAnswer?: string
  trending?: boolean
}

export interface ChatThread {
  id: string
  courseId?: string
  title: string
  lastMessage: string
  lastMessageAt: string
  mode: "explain" | "tutor" | "exam"
}

export interface ChatMessage {
  id: string
  threadId: string
  role: "user" | "assistant"
  content: string
  citations?: Citation[]
  createdAt: string
}

export interface Citation {
  id: string
  title: string
  section: string
  page?: number
  confidence: number
  source: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  role: Role
  userId: string
  userName: string
  courseId?: string
  courseName?: string
  action: string
  model: string
  flagged: boolean
  hasCitations: boolean
  details?: string
  prompt?: string
  response?: string
}

export interface Incident {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  category: string
  status: "new" | "investigating" | "mitigated" | "closed"
  createdAt: string
  updatedAt: string
  description: string
  affectedCourses: string[]
  owner?: string
  timeline: IncidentEvent[]
  postmortem?: {
    summary: string
    rootCause: string
    impact: string
    mitigation: string
    followUps: string
  }
}

export interface IncidentEvent {
  id: string
  timestamp: string
  type: "created" | "updated" | "note" | "mitigated" | "closed"
  description: string
  author: string
}

export interface Policy {
  id: string
  name: string
  version: string
  status: "active" | "draft" | "archived"
  category: string
  content: string
  updatedAt: string
  createdBy: string
}

export interface AIModel {
  id: string
  name: string
  provider: string
  region: string
  status: "active" | "inactive" | "pending"
  costPer1kTokens: number
  avgLatencyMs: number
  environment: string
  capabilities: string[]
}

export interface SourceConnector {
  id: string
  name: string
  type: "lms" | "drive" | "library" | "upload"
  status: "connected" | "disconnected" | "syncing" | "error"
  lastSync?: string
  documentsCount: number
  description: string
}

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

export interface MetricCardData {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  description?: string
  icon?: string
}
