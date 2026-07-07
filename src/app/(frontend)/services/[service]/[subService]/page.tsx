import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { CTABanner } from '@/components/marketing/CTABanner'
import { GlassCard } from '@/components/marketing/GlassCard'
import { Reveal } from '@/components/marketing/Reveal'
import { SolutionCard } from '@/components/marketing/SolutionCard'
import siteConfig from '@/config/site'
import { getSubSolution, solutions } from '@/config/solutions'
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
  params: Promise<{ service: string; subService: string }>
}

export function generateStaticParams() {
  return solutions.flatMap((solution) =>
    solution.subSolutions.map((sub) => ({ service: solution.slug, subService: sub.slug })),
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { service, subService } = await params
  const match = getSubSolution(service, subService)
  const seoDoc = await getPageSEO(`services/${service}/${subService}`).catch(() => null)
  return generatePageMeta({
    slug: `services/${service}/${subService}`,
    seoDoc,
    fallbackTitle: match?.subSolution.title ?? 'Solutions',
  })
}

export default async function SubSolutionPage({ params }: Args) {
  const { service, subService } = await params
  const match = getSubSolution(service, subService)
  if (!match) notFound()

  const { solution, subSolution } = match
  const seoDoc = await getPageSEO(`services/${service}/${subService}`).catch(() => null)
  const siblings = solution.subSolutions.filter((sub) => sub.slug !== subSolution.slug)
  const url = `${siteConfig.url}/services/${solution.slug}/${subSolution.slug}`

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? subSolution.title,
              description: seoDoc?.meta?.description ?? subSolution.tagline,
              url,
            }),
            servicePageSchema({
              name: subSolution.title,
              description: subSolution.tagline,
              url,
              providerName: siteConfig.name,
              siteUrl: siteConfig.url,
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Solutions', href: '/services' },
              { name: solution.title, href: `/services/${solution.slug}` },
              { name: subSolution.title, href: `/services/${solution.slug}/${subSolution.slug}` },
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
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
            {solution.title}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {subSolution.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">{subSolution.tagline}</p>
        </div>
      </section>

      {/* Problem + capabilities */}
      <section className="container max-w-4xl pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                The problem
              </p>
              <p className="text-sm leading-relaxed text-white/75 md:text-base">
                {subSolution.problem}
              </p>
              <p className="mt-6 inline-flex items-center rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm text-brand-teal ring-1 ring-brand-teal/20">
                {subSolution.outcome}
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={100}>
            <GlassCard className="h-full">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                What it does
              </p>
              <ul className="space-y-3.5">
                {subSolution.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3 text-sm text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                    {capability}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Siblings */}
      <section className="container pb-24">
        <Reveal>
          <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Also part of {solution.title}
          </p>
        </Reveal>
        <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
          {siblings.map((sub, i) => (
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
        headline={`Could ${subSolution.title.toLowerCase()} work for your business?`}
        subline="Book a free 30-minute audit and find out — no obligation, no pressure."
      />
    </div>
  )
}
