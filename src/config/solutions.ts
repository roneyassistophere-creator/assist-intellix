import { Bot, Megaphone, Network, Target, Workflow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type SubSolution = {
  slug: string
  title: string
  tagline: string
  problem: string
  capabilities: string[]
  outcome: string
}

export type Solution = {
  slug: string
  title: string
  tagline: string
  icon: LucideIcon
  problem: string
  whatTheAgentDoes: string[]
  outcome: string
  /** Compliance or other footnote rendered under the solution block. */
  note?: string
  subSolutions: SubSolution[]
}

/**
 * Single source of truth for the solutions offering. Drives the header nav
 * (src/config/site.ts), the /services pages, and the sitemap — keep slugs in
 * sync with nothing: everything derives from here.
 */
export const solutions: Solution[] = [
  {
    slug: 'lead-generation-agents',
    title: 'Lead Generation Agents',
    tagline: 'Agents that find, research, and book qualified prospects — straight onto your calendar.',
    icon: Target,
    problem:
      'Manual prospecting is slow, inconsistent, and expensive. Your pipeline shouldn’t depend on someone’s spare hours.',
    whatTheAgentDoes: [
      'Finds businesses matching your ideal customer profile',
      'Researches each prospect and personalises outreach',
      'Handles first-touch conversations automatically',
      'Books qualified calls onto your calendar',
    ],
    outcome: 'A steady flow of sales conversations — without a full-time SDR salary.',
    note: 'All outreach systems are built with UK GDPR and PECR compliance in mind.',
    subSolutions: [
      {
        slug: 'prospect-research',
        title: 'Prospect Research',
        tagline: 'Ideal-customer discovery on autopilot.',
        problem: 'Building lead lists by hand takes hours — and they go stale fast.',
        capabilities: [
          'Scans for businesses matching your target profile',
          'Enriches every lead with context and contact data',
          'Keeps lists fresh, deduplicated, and CRM-ready',
        ],
        outcome: 'Qualified, researched leads delivered continuously.',
      },
      {
        slug: 'personalised-outreach',
        title: 'Personalised Outreach',
        tagline: 'First-touch messages that don’t read like a robot wrote them.',
        problem: 'Generic mass outreach gets ignored, and personalising by hand doesn’t scale.',
        capabilities: [
          'Writes outreach tailored to each prospect’s business',
          'Runs multi-step follow-up sequences automatically',
          'Built with UK GDPR and PECR compliance in mind',
        ],
        outcome: 'Reply rates of a human, at machine scale.',
      },
      {
        slug: 'call-booking',
        title: 'Call Booking',
        tagline: 'From reply to booked call — no back-and-forth.',
        problem: 'Interested leads go cold in scheduling ping-pong.',
        capabilities: [
          'Handles first-touch conversations end-to-end',
          'Qualifies interest before you spend a minute',
          'Books meetings directly onto your calendar',
        ],
        outcome: 'Your calendar fills itself with qualified calls.',
      },
    ],
  },
  {
    slug: 'marketing-content-agents',
    title: 'Marketing & Content Agents',
    tagline: 'Always-on content — created, adapted, and published without a content team.',
    icon: Megaphone,
    problem:
      'Consistent content drives growth, but nobody has time to produce it week after week.',
    whatTheAgentDoes: [
      'Generates marketing videos and posts from your products or services',
      'Adapts every piece for each platform',
      'Schedules and publishes on a consistent pulse',
      'Can be fully operated by our team on your behalf',
    ],
    outcome: 'An always-on marketing presence — no content team required.',
    subSolutions: [
      {
        slug: 'content-creation',
        title: 'Content Creation',
        tagline: 'Product videos and social posts, generated with hooks that land.',
        problem: 'Producing fresh content every week burns designer and editor hours.',
        capabilities: [
          'Turns product info into marketing videos and posts',
          'Writes hooks and captions tuned to your audience',
          'Keeps output on-brand, week after week',
        ],
        outcome: 'A content pipeline that never runs dry.',
      },
      {
        slug: 'multi-platform-adaptation',
        title: 'Multi-Platform Adaptation',
        tagline: 'One piece of content, every format that matters.',
        problem: 'Reformatting the same content for each channel is pure repetition.',
        capabilities: [
          'Resizes and rewrites per platform automatically',
          'Optimises captions, hashtags, and formats',
          'Keeps a consistent voice across channels',
        ],
        outcome: 'Full channel coverage from a single source.',
      },
      {
        slug: 'auto-scheduling',
        title: 'Auto-Scheduling & Publishing',
        tagline: 'Your channels stay active — without anyone pressing “post”.',
        problem: 'Posting consistently is the first thing that slips when work gets busy.',
        capabilities: [
          'Schedules content on a consistent cadence',
          'Publishes across platforms automatically',
          'Can be fully managed by our operations team',
        ],
        outcome: 'A social presence that runs itself.',
      },
    ],
  },
  {
    slug: 'business-workflow-automation',
    title: 'Business Workflow Automation',
    tagline: 'Somewhere in your ops, a person is doing a robot’s job. We fix that.',
    icon: Workflow,
    problem:
      'Data entry, report building, follow-ups, moving information between systems — human hours spent on robot work.',
    whatTheAgentDoes: [
      'Maps your workflow end-to-end',
      'Builds an AI system that executes it automatically',
      'Connects to the tools you already use',
      'Monitors and refines as your business changes',
    ],
    outcome: 'Processes that run themselves — faster, cheaper, without human error.',
    subSolutions: [
      {
        slug: 'data-entry-reporting',
        title: 'Data Entry & Reporting',
        tagline: 'Spreadsheets that fill themselves, reports that write themselves.',
        problem: 'Copying data between tools and compiling reports eats hours and invites errors.',
        capabilities: [
          'Moves data between systems automatically',
          'Generates recurring reports on schedule',
          'Validates entries so nothing gets missed',
        ],
        outcome: 'Accurate data and reports, zero manual effort.',
      },
      {
        slug: 'follow-up-automation',
        title: 'Follow-Up Automation',
        tagline: 'Every lead, invoice, and task chased — automatically.',
        problem: 'Follow-ups slip through the cracks the moment things get busy.',
        capabilities: [
          'Sends the right follow-up at the right time',
          'Tracks responses and escalates when needed',
          'Works across email, CRM, and messaging tools',
        ],
        outcome: 'Nothing falls through the cracks again.',
      },
      {
        slug: 'app-integrations',
        title: 'App Integrations',
        tagline: 'Your existing tools, finally talking to each other.',
        problem: 'Disconnected tools force people to be the glue between systems.',
        capabilities: [
          'Connects the software you already use',
          'Syncs data in real time across platforms',
          'No rip-and-replace — we build around your stack',
        ],
        outcome: 'One connected system instead of a dozen silos.',
      },
    ],
  },
  {
    slug: 'ai-powered-operations',
    title: 'AI-Powered Operations',
    tagline: 'Not one task — your whole operation, systematised with agents that work together.',
    icon: Network,
    problem: 'It’s not a single bottleneck. Your entire operation runs on manual work.',
    whatTheAgentDoes: [
      'Audits your whole business for automatable processes',
      'Designs an integrated system of AI agents',
      'Rolls out in phases without disrupting operations',
      'Proven on our own rental business — right now',
    ],
    outcome: 'A business that scales without headcount scaling with it.',
    subSolutions: [
      {
        slug: 'operations-audit',
        title: 'Operations Audit',
        tagline: 'Every automatable process in your business, mapped.',
        problem: 'You can’t automate what you haven’t mapped — and most teams never do.',
        capabilities: [
          'Walks your operation end-to-end',
          'Identifies and ranks automation opportunities by impact',
          'Delivers a clear, prioritised roadmap',
        ],
        outcome: 'You know exactly what to automate first, and why.',
      },
      {
        slug: 'integrated-agent-systems',
        title: 'Integrated Agent Systems',
        tagline: 'Agents that hand off to each other, not just single tools.',
        problem: 'Point solutions automate tasks; operations need systems that work together.',
        capabilities: [
          'Builds multiple agents around one operation',
          'Coordinates hand-offs between agents and humans',
          'Scales the system as your business grows',
        ],
        outcome: 'An operation that runs as one connected system.',
      },
      {
        slug: 'monitoring-refinement',
        title: 'Monitoring & Refinement',
        tagline: 'Automation that keeps up as your business changes.',
        problem: 'Set-and-forget automation breaks quietly the moment your process shifts.',
        capabilities: [
          'Monitors every agent’s output and health',
          'Refines workflows as your processes evolve',
          'Ongoing support from a team that runs operations',
        ],
        outcome: 'Systems that stay reliable long after launch.',
      },
    ],
  },
  {
    slug: 'ai-chatbots-support-agents',
    title: 'AI Chatbots & Support Agents',
    tagline: '24/7 conversational agents for support, FAQs, and lead capture.',
    icon: Bot,
    problem: 'Customers expect instant answers. Your team can’t be online around the clock.',
    whatTheAgentDoes: [
      'Answers customer questions instantly, 24/7',
      'Trained on your business — not generic scripts',
      'Captures and qualifies leads while you sleep',
      'Escalates to a human when it matters',
    ],
    outcome: 'Every visitor gets an answer. Every lead gets captured.',
    subSolutions: [
      {
        slug: 'website-chatbots',
        title: 'Website Chatbots',
        tagline: 'Instant answers for every visitor, day and night.',
        problem: 'Visitors with questions leave when nobody answers fast enough.',
        capabilities: [
          'Answers FAQs trained on your real business',
          'Guides visitors to the right product or page',
          'Captures contact details from warm conversations',
        ],
        outcome: 'Fewer lost visitors, more captured leads.',
      },
      {
        slug: 'internal-knowledge-assistants',
        title: 'Internal Knowledge Assistants',
        tagline: 'Your team’s questions, answered from your own docs.',
        problem: 'Teams waste time hunting for answers buried in docs and threads.',
        capabilities: [
          'Indexes your SOPs, docs, and past conversations',
          'Answers staff questions instantly and accurately',
          'Keeps knowledge current as documents change',
        ],
        outcome: 'Institutional knowledge on tap for everyone.',
      },
      {
        slug: 'booking-triage',
        title: 'Booking & Triage Agents',
        tagline: 'Enquiries qualified, routed, and booked automatically.',
        problem: 'Raw enquiries need sorting before they’re worth anyone’s time.',
        capabilities: [
          'Qualifies enquiries with smart questions',
          'Routes each request to the right person or flow',
          'Books appointments straight into calendars',
        ],
        outcome: 'Only qualified, scheduled conversations reach your team.',
      },
    ],
  },
]

export const getSolution = (slug: string): Solution | undefined =>
  solutions.find((solution) => solution.slug === slug)

export const getSubSolution = (
  solutionSlug: string,
  subSlug: string,
): { solution: Solution; subSolution: SubSolution } | undefined => {
  const solution = getSolution(solutionSlug)
  const subSolution = solution?.subSolutions.find((sub) => sub.slug === subSlug)
  return solution && subSolution ? { solution, subSolution } : undefined
}
