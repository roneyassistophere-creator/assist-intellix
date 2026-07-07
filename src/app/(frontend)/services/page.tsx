import { ArrowRight, Check } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { CTABanner } from '@/components/marketing/CTABanner'
import { GlassCard } from '@/components/marketing/GlassCard'
import { Reveal } from '@/components/marketing/Reveal'
import siteConfig from '@/config/site'
import { solutions } from '@/config/solutions'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'
import { cn } from '@/utilities/ui'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('services').catch(() => null)
  return generatePageMeta({ slug: 'services', seoDoc, fallbackTitle: 'Solutions' })
}

export default async function SolutionsPage() {
  const seoDoc = await getPageSEO('services').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? 'Solutions',
              description:
                seoDoc?.meta?.description ??
                `The AI agents and automation systems ${siteConfig.name} builds — lead generation, content, workflows, and full operations.`,
              url: `${siteConfig.url}/services`,
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Solutions', href: '/services' },
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
            What we <span className="text-gradient-brand">build</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            Every business has a different bottleneck. We don&apos;t sell one product — we build
            the agent your business actually needs.
          </p>
        </div>
      </section>

      {/* Solution blocks */}
      <div className="container flex flex-col gap-24 pb-24">
        {solutions.map((solution, index) => {
          const Icon = solution.icon
          const reversed = index % 2 === 1
          return (
            <Reveal key={solution.slug}>
              <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={cn(reversed && 'lg:order-2')}>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-teal/20 to-brand-blue/20 ring-1 ring-white/10">
                    <Icon className="h-6 w-6 text-brand-cyan" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    {solution.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                    {solution.problem}
                  </p>
                  <p className="mt-5 inline-flex items-center rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm text-brand-teal ring-1 ring-brand-teal/20">
                    {solution.outcome}
                  </p>
                  {solution.note && <p className="mt-4 text-xs text-white/40">{solution.note}</p>}
                  <div>
                    <Link
                      href={`/services/${solution.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-teal"
                    >
                      Explore {solution.title}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <GlassCard className={cn(reversed && 'lg:order-1')}>
                  <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                    What the agent does
                  </p>
                  <ul className="space-y-3.5">
                    {solution.whatTheAgentDoes.map((capability) => (
                      <li key={capability} className="flex items-start gap-3 text-sm text-white/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </section>
            </Reveal>
          )
        })}
      </div>

      {/* CTA */}
      <CTABanner
        headline="Not sure which solution fits?"
        subline="That's what the free Automation Audit is for. We'll tell you honestly what's worth automating — and what isn't."
      />
    </div>
  )
}
