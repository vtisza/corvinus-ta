import { ChatThread, ChatMessage } from "@/lib/types"

export const mockThreads: ChatThread[] = [
  {
    id: "thread-1",
    courseId: "course-1",
    title: "Porter's Five Forces explained",
    lastMessage: "The threat of substitutes for OTP Bank is moderate...",
    lastMessageAt: "2024-03-12T15:30:00Z",
    mode: "explain",
  },
  {
    id: "thread-2",
    courseId: "course-1",
    title: "Blue Ocean Strategy examples",
    lastMessage: "Let me give you a practice question on this topic...",
    lastMessageAt: "2024-03-11T10:15:00Z",
    mode: "tutor",
  },
  {
    id: "thread-3",
    courseId: "course-2",
    title: "Deferred tax calculations",
    lastMessage: "Based on IAS 12, the key principle is...",
    lastMessageAt: "2024-03-10T14:00:00Z",
    mode: "explain",
  },
  {
    id: "thread-4",
    courseId: "course-3",
    title: "GA4 Attribution Models",
    lastMessage: "Data-driven attribution uses machine learning to...",
    lastMessageAt: "2024-03-09T11:45:00Z",
    mode: "explain",
  },
]

export const mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    threadId: "thread-1",
    role: "user",
    content: "Can you explain Porter's Five Forces framework and how it applies to banking?",
    createdAt: "2024-03-12T15:00:00Z",
  },
  {
    id: "msg-2",
    threadId: "thread-1",
    role: "assistant",
    content: `Porter's Five Forces is a framework developed by Michael E. Porter to analyze the competitive forces that shape an industry. For banking, here's how each force applies:

**1. Threat of New Entrants** — Moderate to Low
Traditional banking has high barriers: capital requirements, regulatory compliance (ECB licensing), and customer trust. However, fintech startups and neobanks (Revolut, N26) have lowered entry barriers through technology.

**2. Bargaining Power of Suppliers** — Low to Moderate
Banks' main "suppliers" are capital (deposits and wholesale funding) and technology vendors. Depositors have some power through interest rate shopping, but switching costs keep most customers loyal.

**3. Bargaining Power of Buyers** — Increasing
Corporate clients have significant power due to their size and the ability to negotiate terms. Retail customers historically had low power, but digital comparison tools and open banking regulations (PSD2 in the EU) are increasing their leverage.

**4. Threat of Substitutes** — High and Growing
Fintech alternatives for payments (Stripe, PayPal), lending (peer-to-peer platforms), and investment (robo-advisors) represent significant substitutes to traditional banking products.

**5. Competitive Rivalry** — High
Banking is mature and competitive, with multiple similarly-sized players competing primarily on rates and increasingly on digital experience.`,
    citations: [
      {
        id: "cit-1",
        title: "Competitive Strategy: Techniques for Analyzing Industries and Competitors",
        section: "Chapter 1: The Five Competitive Forces That Shape Strategy",
        page: 4,
        confidence: 0.94,
        source: "Porter, M.E. (2008)",
      },
      {
        id: "cit-2",
        title: "Course Lecture Notes: Week 3 - Industry Analysis",
        section: "Five Forces in Financial Services",
        page: 12,
        confidence: 0.88,
        source: "BUS-401 Course Materials",
      },
    ],
    createdAt: "2024-03-12T15:01:00Z",
  },
  {
    id: "msg-3",
    threadId: "thread-1",
    role: "user",
    content: "What about for OTP Bank specifically? What's their position?",
    createdAt: "2024-03-12T15:15:00Z",
  },
  {
    id: "msg-4",
    threadId: "thread-1",
    role: "assistant",
    content: `For OTP Bank, Hungary's largest commercial bank, the Five Forces analysis looks like this:

**OTP's Competitive Position:**
OTP holds approximately 25% market share in Hungary across retail deposits, making it a dominant player. Their regional expansion into 11+ CEE countries provides diversification.

**Key observations:**
- The threat of substitutes is **moderate** for OTP given their strong branch network and trusted brand among older demographics
- Rivalry is **intense** but OTP benefits from first-mover advantage in CEE markets
- Their recent acquisition of Ipoteka Bank (Uzbekistan) and Sberbank Slovenia shows proactive response to competitive pressures

**Strategic implication for your assignment:** OTP's main competitive response has been geographic diversification rather than product innovation — an interesting contrast to Western European banks. This could be a strong angle for your Porter's analysis.`,
    citations: [
      {
        id: "cit-3",
        title: "OTP Bank Annual Report 2023",
        section: "Strategic Overview",
        page: 8,
        confidence: 0.92,
        source: "OTP Bank Investor Relations",
      },
    ],
    createdAt: "2024-03-12T15:16:00Z",
  },
]
