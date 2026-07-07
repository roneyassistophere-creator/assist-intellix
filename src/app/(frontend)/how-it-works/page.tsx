import type { Metadata } from 'next'
import React from 'react'

import { CTABanner } from '@/components/marketing/CTABanner'
import { FAQAccordion } from '@/components/marketing/FAQAccordion'
import type { FAQItem } from '@/components/marketing/FAQAccordion'
import { Reveal } from '@/components/marketing/Reveal'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { StepsStrip } from '@/components/marketing/StepsStrip'
import type { Step } from '@/components/marketing/StepsStrip'
import siteConfig from '@/config/site'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema, faqSchema } from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('how-it-works').catch(() => null)
  return generatePageMeta({ slug: 'how-it-works', seoDoc, fallbackTitle: 'How It Works' })
}

const steps: Step[] = [
  {
    title: 'Automation Audit',
    timeframe: '30 min · free',
    description:
      'You walk us through your business; we identify the repetitive tasks costing you the most. You leave with a clear picture of what’s automatable — whether you work with us or not.',
  },
  {
    title: 'Blueprint',
    timeframe: '3–5 days',
    description:
      'We map your chosen workflow in detail — every step, tool, and decision point — then design the agent and the results to expect. You approve before we build anything.',
  },
  {
    title: 'Build & Test',
    timeframe: '1–3 weeks',
    description:
      'We build your agent and test it against real scenarios from your business. You see it working before it goes live — refined until it performs in the messy real world, not just a demo.',
  },
  {
    title: 'Launch — you run it, or we do',
    timeframe: 'Ongoing',
    description:
      'Handover: we train your team and provide ongoing support. Managed: our operations team runs it day-to-day and you just receive the output — leads booked, content published, workflows completed.',
  },
]

const faqs: FAQItem[] = [
  {
    question: 'Do I need to be technical?',
    answer:
      'No — that’s the point. We handle everything technical; you only see results.',
  },
  {
    question: 'Will this work with the tools I already use?',
    answer:
      'Almost certainly. We build around your existing stack rather than forcing you onto new software.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Every build is scoped individually after the audit. You get a fixed quote before we start — no surprise invoices.',
  },
  {
    question: 'What if it breaks or my process changes?',
    answer:
      'Every project includes a support period, and managed clients get ongoing monitoring and updates as standard.',
  },
  {
    question: 'How is this different from ChatGPT or off-the-shelf AI tools?',
    answer:
      'Generic tools wait for you to prompt them. Our agents work autonomously on your specific workflow — connected to your tools, running on a schedule, producing output without a human driving them.',
  },
]

export default async function HowItWorksPage() {
  const seoDoc = await getPageSEO('how-it-works').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? 'How It Works',
              description:
                seoDoc?.meta?.description ??
                `How working with ${siteConfig.name} works — from a free 30-minute audit to an AI agent running your workflow.`,
              url: `${siteConfig.url}/how-it-works`,
            }),
            faqSchema(faqs),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'How It Works', href: '/how-it-works' },
            ]),
          ]),
        }}
      />

      {/* Header */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, #1488fc, transparent)' }}
        />
        <div className="container relative max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            From &ldquo;this takes forever&rdquo; to{' '}
            <span className="text-gradient-brand">&ldquo;this runs itself&rdquo;</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            Four simple steps. No jargon, no 6-month enterprise projects.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="container pb-24">
        <Reveal>
          <StepsStrip steps={steps} detailed />
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container max-w-3xl pb-24">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        </Reveal>
        <Reveal className="mt-10" delay={100}>
          <FAQAccordion items={faqs} />
        </Reveal>
      </section>

      {/* CTA */}
      <CTABanner
        headline="Start with a free audit"
        subline="30 minutes to find out what's worth automating in your business — no obligation."
        primaryLabel="Start With a Free Audit"
      />
    </div>
  )
}
