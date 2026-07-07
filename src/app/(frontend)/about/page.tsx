import { Eye, Settings2, Users } from 'lucide-react'
import type { Metadata } from 'next'
import React from 'react'

import { CTABanner } from '@/components/marketing/CTABanner'
import { GlassCard } from '@/components/marketing/GlassCard'
import { Reveal } from '@/components/marketing/Reveal'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import siteConfig from '@/config/site'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('about').catch(() => null)
  return generatePageMeta({ slug: 'about', seoDoc, fallbackTitle: 'About' })
}

const differentiators = [
  {
    icon: Users,
    title: 'Operators, not just developers',
    description:
      'We’ve run real teams and real workflows. Our agents survive contact with actual business operations — not just demos.',
  },
  {
    icon: Settings2,
    title: 'Managed automation',
    description:
      'Our operations team can run your agents for you. Most agencies can’t offer this — they’ve never run operations. We have, for years.',
  },
  {
    icon: Eye,
    title: 'We build in public',
    description:
      'We’re systematising our own business with AI agents and showing our work. Watch exactly what our systems do before you buy one.',
  },
]

export default async function AboutPage() {
  const seoDoc = await getPageSEO('about').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? 'About',
              description:
                seoDoc?.meta?.description ??
                `${siteConfig.name} automates businesses because we run one — AI agents born inside a real operations-heavy company.`,
              url: `${siteConfig.url}/about`,
              type: 'AboutPage',
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
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
            We automate businesses <span className="text-gradient-brand">because we run one</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="container max-w-2xl pb-24">
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-white/70">
            <p>
              Most AI agencies started with the technology and went looking for problems.{' '}
              <span className="font-medium text-white">We went the other way.</span>
            </p>
            <p>
              For over five years, we&apos;ve run an operations-heavy business in the short-term
              rental industry — daily operations, guest communication, listings, and a distributed
              team. We know exactly what it feels like when growth is capped by how many hours your
              team can work.
            </p>
            <p>
              So we built AI agents to fix our own bottlenecks. They worked. Then other business
              owners started asking how we did it.
            </p>
            <p className="font-medium text-white">
              That&apos;s {siteConfig.name}: the AI systems we wished existed when we were buried
              in manual work — now built for businesses like yours.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Differentiators */}
      <section className="container pb-24">
        <Reveal>
          <SectionHeading eyebrow="What makes us different" title="Built by people who run operations" />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {differentiators.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <GlassCard glow className="h-full">
                <item.icon className="h-6 w-6 text-brand-cyan" />
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Assistophere */}
      <section className="container max-w-3xl pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-canvas-soft px-6 py-12 text-center ring-1 ring-white/10 md:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, #50e6d5, transparent)' }}
            />
            <p className="relative mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-teal">
              {siteConfig.affiliation}
            </p>
            <h2 className="relative text-xl font-semibold tracking-tight text-white md:text-2xl">
              Part of the Assistophere group
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
              Alongside Assist Growth (business growth services) and our short-term rental
              operations division. One team, multiple ways to help your business grow.
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <CTABanner
        headline="Work with us"
        subline="Start with a free 30-minute Automation Audit — we'll tell you honestly what's worth automating."
      />
    </div>
  )
}
