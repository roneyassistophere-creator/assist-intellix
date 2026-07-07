import { Ear, ListChecks, Search } from 'lucide-react'
import type { Metadata } from 'next'
import React from 'react'

import { CalendarEmbed } from '@/components/marketing/CalendarEmbed'
import { GlassCard } from '@/components/marketing/GlassCard'
import { Reveal } from '@/components/marketing/Reveal'
import siteConfig from '@/config/site'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('contact').catch(() => null)
  return generatePageMeta({ slug: 'contact', seoDoc, fallbackTitle: 'Book a Free Automation Audit' })
}

const expectations = [
  {
    icon: Ear,
    title: 'You talk, we listen',
    description: 'Walk us through how your business runs day to day.',
  },
  {
    icon: Search,
    title: 'We find the bottlenecks',
    description: 'We pinpoint the repetitive tasks costing you the most.',
  },
  {
    icon: ListChecks,
    title: 'You get a clear plan',
    description: 'What to automate first — with a fixed-price quote if you want to proceed.',
  },
]

export default async function ContactPage() {
  const seoDoc = await getPageSEO('contact').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? 'Book a Free Automation Audit',
              description:
                seoDoc?.meta?.description ??
                `Book a free 30-minute Automation Audit with ${siteConfig.name}. We'll identify the highest-impact tasks to automate in your business.`,
              url: `${siteConfig.url}/contact`,
              type: 'ContactPage',
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Contact', href: '/contact' },
            ]),
          ]),
        }}
      />

      {/* Header */}
      <section className="relative overflow-hidden px-4 pb-16 pt-24 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, #1488fc, transparent)' }}
        />
        <div className="container relative max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Book your free <span className="text-gradient-brand">Automation Audit</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            30 minutes. No pressure. We&apos;ll find the highest-impact tasks to automate — and
            tell you honestly whether an AI agent is the right fit.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="container pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {expectations.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <GlassCard className="h-full text-center">
                <item.icon className="mx-auto h-6 w-6 text-brand-cyan" />
                <h2 className="mt-4 text-base font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section className="container max-w-3xl pb-8">
        <CalendarEmbed />
      </section>

      {/* Email alternative + reassurance */}
      <section className="container max-w-3xl pb-24 text-center">
        <p className="text-sm text-white/60">
          Prefer email? Reach us at{' '}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-medium text-brand-cyan transition-colors hover:text-brand-teal"
          >
            {siteConfig.contact.email}
          </a>
        </p>
        <p className="mt-4 text-xs text-white/40">
          No obligation. No hard sell. If automation isn&apos;t right for your business yet,
          we&apos;ll tell you that too.
        </p>
      </section>
    </div>
  )
}
