import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { CTABanner } from '@/components/marketing/CTABanner'
import { Reveal } from '@/components/marketing/Reveal'
import { UseCaseCard } from '@/components/marketing/UseCaseCard'
import siteConfig from '@/config/site'
import { useCases } from '@/config/use-cases'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('use-cases').catch(() => null)
  return generatePageMeta({ slug: 'use-cases', seoDoc, fallbackTitle: 'Use Cases' })
}

export default async function UseCasesPage() {
  const seoDoc = await getPageSEO('use-cases').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? 'Use Cases',
              description:
                seoDoc?.meta?.description ??
                `Real AI agents built by ${siteConfig.name} — including the ones running inside our own business right now.`,
              url: `${siteConfig.url}/use-cases`,
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Use Cases', href: '/use-cases' },
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
            Real agents, doing <span className="text-gradient-brand">real work</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            We believe in showing, not telling. These are agents we&apos;ve built — including the
            ones running inside our own business right now.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="container pb-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {useCases.map((useCase, i) => (
            <Reveal key={useCase.title} delay={i * 100}>
              <UseCaseCard useCase={useCase} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Build in public */}
      <section className="container max-w-3xl pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-canvas-soft px-6 py-12 text-center ring-1 ring-white/10 md:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, #50e6d5, transparent)' }}
            />
            <p className="relative mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-teal">
              Build in public
            </p>
            <h2 className="relative text-xl font-semibold tracking-tight text-white md:text-2xl">
              Everything we prove in our own business becomes a playbook for yours
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
              We&apos;re rebuilding our short-term rental company to run on AI agents, end-to-end —
              and documenting what we automate, how, what breaks, and what it saves.
            </p>
            <Link
              href="/blog"
              className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-teal"
            >
              Follow the build
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <CTABanner
        headline="Your business has a use case. Let's find it."
        subline="A free 30-minute audit to identify the highest-impact tasks to automate."
      />
    </div>
  )
}
