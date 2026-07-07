import type { UseCase } from '@/components/marketing/UseCaseCard'

/** Shared by the homepage teaser and the /use-cases page. */
export const useCases: UseCase[] = [
  {
    title: 'The Lead Generation Agent',
    description:
      'Finds local businesses that fit a target profile, builds a personalised demo, reaches out, and books interested prospects onto a sales calendar.',
    builtFor: 'Service businesses that need consistent sales conversations',
    replaces: 'A prospecting VA or SDR doing 15+ hours of manual work a week',
    status: 'live',
  },
  {
    title: 'The Marketing Video Agent',
    description:
      'Turns product information into marketing videos, then uploads and publishes them on schedule. Can run entirely on a client’s behalf.',
    builtFor: 'Businesses that need consistent content without a content team',
    replaces: 'A video editor plus a social media manager',
    status: 'live',
  },
  {
    title: 'Systematising an Entire Business',
    description:
      'We’re rebuilding our own short-term rental company — guest messaging, listings, pricing, reporting — to run on AI agents, and documenting every step publicly.',
    builtFor: 'Proof that this works at company scale',
    replaces: 'Hours of daily manual operations across a whole company',
    status: 'building',
  },
]
