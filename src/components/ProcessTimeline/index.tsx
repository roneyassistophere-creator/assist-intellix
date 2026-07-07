'use client'

import { Rocket, DraftingCompass, Search, Wrench } from 'lucide-react'

import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'

// Defined here (not in the Server Component that renders this) because the
// icon fields are component references — functions can't cross the Server ->
// Client boundary as serialized props, only as data owned by the client side.
const processTimelineData = [
  {
    id: 1,
    title: 'Audit',
    date: '30 minutes',
    content:
      'A free call. You walk us through your business; we identify the repetitive tasks costing you the most.',
    category: 'Audit',
    icon: Search,
    relatedIds: [2],
    status: 'completed' as const,
    badgeLabel: 'STEP 1',
  },
  {
    id: 2,
    title: 'Blueprint',
    date: '3–5 days',
    content:
      'We map your workflow, design the agent, and set clear expectations. You approve before we build.',
    category: 'Blueprint',
    icon: DraftingCompass,
    relatedIds: [1, 3],
    status: 'completed' as const,
    badgeLabel: 'STEP 2',
  },
  {
    id: 3,
    title: 'Build & Test',
    date: '1–3 weeks',
    content:
      'We build your agent and test it against real scenarios from your business — until it performs in the messy real world.',
    category: 'Build',
    icon: Wrench,
    relatedIds: [2, 4],
    status: 'completed' as const,
    badgeLabel: 'STEP 3',
  },
  {
    id: 4,
    title: 'Launch',
    date: 'Ongoing',
    content:
      'We hand over the keys and train your team — or our operations team runs it for you. Your choice.',
    category: 'Launch',
    icon: Rocket,
    relatedIds: [3],
    status: 'completed' as const,
    badgeLabel: 'STEP 4',
  },
]

export function ProcessTimeline() {
  return <RadialOrbitalTimeline timelineData={processTimelineData} />
}
