import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { CTABanner } from '@/components/marketing/CTABanner'
import { GlassCard } from '@/components/marketing/GlassCard'
import { Reveal } from '@/components/marketing/Reveal'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { SolutionCard } from '@/components/marketing/SolutionCard'
import siteConfig from '@/config/site'
import { getSolution, solutions } from '@/config/solutions'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import {
  jsonLdScript,
  webPageSchema,
  breadcrumbSchema,
  servicePageSchema,
} from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 3600

type Args = {
  params: Promise<{ service: string }>
}

export function generateStaticParams() {
  return solutions.map((solution) => ({ service: solution.slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { service } = await params
  const solution = getSolution(service)
  const seoDoc = await getPageSEO(`services/${service}`).catch(() => null)
  return generatePageMeta({
    slug: `services/${service}`,
    seoDoc,
    fallbackTitle: solution?.title ?? 'Solutions',
  })
}

export default async function SolutionPage({ params }: Args) {
  const { service } = await params
  const solution = getSolution(service)
  if (!solution) notFound()

  const seoDoc = await getPageSEO(`services/${service}`).catch(() => null)
  const Icon = solution.icon

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? solution.title,
              description: seoDoc?.meta?.description ?? solution.tagline,
              url: `${siteConfig.url}/services/${solution.slug}`,
            }),
            servicePageSchema({
              name: solution.title,
              description: solution.tagline,
              url: `${siteConfig.url}/services/${solution.slug}`,
              providerName: siteConfig.name,
              siteUrl: siteConfig.url,
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Solutions', href: '/services' },
              { name: solution.title, href: `/services/${solution.slug}` },
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
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-teal/20 to-brand-blue/20 ring-1 ring-white/10">
            <Icon className="h-7 w-7 text-brand-cyan" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {solution.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">{solution.tagline}</p>
        </div>
      </section>

      {/* Problem + what the agent does */}
      <section className="container max-w-4xl pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                The problem
              </p>
              <p className="text-sm leading-relaxed text-white/75 md:text-base">
                {solution.problem}
              </p>
              <p className="mt-6 inline-flex items-center rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm text-brand-teal ring-1 ring-brand-teal/20">
                {solution.outcome}
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={100}>
            <GlassCard className="h-full">
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
          </Reveal>
        </div>
        {solution.note && (
          <p className="mt-6 text-center text-xs text-white/40">{solution.note}</p>
        )}
      </section>

      {/* Sub-solutions */}
      <section className="container pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="Inside this solution"
            title="Three ways we apply it"
            subtitle="Each one can stand alone — or work together as a system."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {solution.subSolutions.map((sub, i) => (
            <Reveal key={sub.slug} delay={i * 100}>
              <SolutionCard
                icon={solution.icon}
                title={sub.title}
                tagline={sub.tagline}
                href={`/services/${solution.slug}/${sub.slug}`}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        headline={`See what ${solution.title.toLowerCase()} could do for you`}
        subline="A free 30-minute audit — we'll tell you honestly whether this is the right fit."
      />
    </div>
  )
}
