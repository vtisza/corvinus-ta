export const mockStudentAnalytics = {
  studyTimeHours: 24.5,
  studyStreak: 7,
  quizzesDone: 18,
  masteryPercent: 73,
  weeklyStudyData: [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4.0 },
    { day: "Fri", hours: 3.5 },
    { day: "Sat", hours: 2.0 },
    { day: "Sun", hours: 1.0 },
  ],
  topicMastery: [
    { topic: "Porter's Five Forces", mastery: 90 },
    { topic: "Blue Ocean Strategy", mastery: 65 },
    { topic: "Financial Ratios", mastery: 78 },
    { topic: "IFRS Standards", mastery: 45 },
    { topic: "Digital Attribution", mastery: 82 },
    { topic: "Motivation Theories", mastery: 55 },
    { topic: "DCF Valuation", mastery: 60 },
    { topic: "EU Competition Law", mastery: 30 },
  ],
  weakTopics: [
    { topic: "IFRS Standards", course: "Financial Accounting", mastery: 45 },
    { topic: "EU Competition Law", course: "European Economic Law", mastery: 30 },
    { topic: "Motivation Theories", course: "Organizational Behavior", mastery: 55 },
  ],
  courseProgress: [
    { courseId: "course-1", title: "Business Strategy", progress: 68 },
    { courseId: "course-2", title: "Financial Accounting", progress: 45 },
    { courseId: "course-3", title: "Digital Marketing Analytics", progress: 82 },
    { courseId: "course-4", title: "Organizational Behavior", progress: 30 },
    { courseId: "course-5", title: "Corporate Finance", progress: 55 },
    { courseId: "course-6", title: "European Economic Law", progress: 15 },
  ],
}

export const mockInstructorAnalytics = {
  totalStudents: 247,
  weeklyMessages: 1842,
  flagRate: 2.3,
  avgSatisfaction: 4.2,
  topQuestions: [
    { question: "What is competitive advantage?", count: 47, courseId: "course-1" },
    { question: "How to calculate WACC?", count: 38, courseId: "course-5" },
    { question: "Difference between IAS and IFRS?", count: 31, courseId: "course-2" },
    { question: "What is bounce rate?", count: 28, courseId: "course-3" },
    { question: "Porter vs. Blue Ocean?", count: 24, courseId: "course-1" },
  ],
  confusionTopics: [
    { topic: "Deferred Tax (IFRS)", courseId: "course-2", confusionScore: 85 },
    { topic: "Capital Structure", courseId: "course-5", confusionScore: 72 },
    { topic: "Article 101/102 TFEU", courseId: "course-6", confusionScore: 68 },
    { topic: "Two-Factor Theory", courseId: "course-4", confusionScore: 60 },
  ],
  contentGaps: [
    { gap: "Practical IFRS examples for banking sector", courseId: "course-2" },
    { gap: "Step-by-step DCF walkthrough video", courseId: "course-5" },
    { gap: "EU case law database integration", courseId: "course-6" },
  ],
}

export const mockGovernanceAnalytics = {
  activeUsers: 312,
  totalMessages: 48920,
  estimatedCostEUR: 1847,
  flagRate: 1.8,
  openIncidents: 3,
  adoptionByDept: [
    { dept: "Business School", users: 124, courses: 8 },
    { dept: "Law Faculty", users: 78, courses: 4 },
    { dept: "Economics", users: 65, courses: 5 },
    { dept: "Management", users: 45, courses: 3 },
  ],
  topCoursesByAdoption: [
    { courseId: "course-3", title: "Digital Marketing Analytics", messages: 12847, students: 42 },
    { courseId: "course-1", title: "Business Strategy", messages: 11203, students: 34 },
    { courseId: "course-2", title: "Financial Accounting", messages: 9841, students: 56 },
    { courseId: "course-5", title: "Corporate Finance", messages: 7654, students: 29 },
    { courseId: "course-4", title: "Organizational Behavior", messages: 5432, students: 48 },
  ],
  costByModel: [
    { model: "claude-3-5-sonnet", cost: 1240, tokens: 18400000 },
    { model: "claude-3-haiku", cost: 380, tokens: 42000000 },
    { model: "gpt-4o-mini", cost: 227, tokens: 31000000 },
  ],
}
