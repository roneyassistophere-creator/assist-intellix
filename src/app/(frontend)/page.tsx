import { ArrowRight, Handshake, KeyRound } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { CTABanner } from '@/components/marketing/CTABanner'
import { GlassCard } from '@/components/marketing/GlassCard'
import { Reveal } from '@/components/marketing/Reveal'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { SolutionCard } from '@/components/marketing/SolutionCard'
import { StatCard } from '@/components/marketing/StatCard'
import { UseCaseCard } from '@/components/marketing/UseCaseCard'
import { brandButtonClasses, ghostButtonClasses } from '@/components/marketing/styles'
import { ProcessTimeline } from '@/components/ProcessTimeline'
import siteConfig from '@/config/site'
import { solutions } from '@/config/solutions'
import { useCases } from '@/config/use-cases'
import { AutomationHero } from '@/heros/AutomationHero'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('home').catch(() => null)
  // No fallbackTitle: buildTitle then uses seo.defaultTitle untemplated,
  // avoiding "Assist Intellix — … | Assist Intellix" duplication.
  return generatePageMeta({ slug: '/', seoDoc })
}

export default async function HomePage() {
  const seoDoc = await getPageSEO('home').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? siteConfig.seo.defaultTitle,
              description: seoDoc?.meta?.description ?? siteConfig.seo.defaultDescription,
              url: siteConfig.url,
            }),
            breadcrumbSchema([{ name: 'Home', href: '/' }]),
          ]),
        }}
      />

      {/* Hero */}
      <AutomationHero />

      {/* Value proposition */}
      <section className="container py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Your team stuck on repetitive tasks?{' '}
            <span className="text-gradient-brand">Our AI agents handle it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            We build custom AI agents that take over the manual work eating your team&apos;s time —
            so they can focus on what actually grows your business.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className={brandButtonClasses}>
              Book a Free Automation Audit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#how-it-works" className={ghostButtonClasses}>
              See How It Works
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Problem */}
      <section className="container pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="The problem"
            title="What is manual work really costing you?"
            subtitle="Copying data between tools. Chasing leads. Sending the same emails. None of it needs a human."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Reveal>
            <StatCard
              value="10+ hrs"
              label="lost per employee, every week"
              sub="on tasks that follow the same pattern"
            />
          </Reveal>
          <Reveal delay={100}>
            <StatCard
              value="100%"
              label="of manual processes carry error risk"
              sub="typos, delays, and things that get missed"
            />
          </Reveal>
          <Reveal delay={200}>
            <StatCard
              value="0"
              label="new hires needed"
              sub="build the work into a system once — and let it run"
            />
          </Reveal>
        </div>
      </section>

      {/* Solutions */}
      <section className="container pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="The solution"
            title="AI agents built for your business"
            subtitle="No software subscriptions. Custom agents around your workflows, your tools, and your goals."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {solutions.slice(0, 3).map((solution, i) => (
            <Reveal key={solution.slug} delay={i * 100}>
              <SolutionCard
                icon={solution.icon}
                title={solution.title}
                tagline={solution.tagline}
                href={`/services/${solution.slug}`}
              />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-teal"
          >
            View all solutions
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </section>

      {/* Differentiator */}
      <section className="container pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="Your choice"
            title="Fully managed, or fully yours"
            subtitle="Most AI agencies hand you a tool and disappear. We don't."
          />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal>
            <GlassCard glow className="h-full">
              <Handshake className="h-6 w-6 text-brand-cyan" />
              <h3 className="mt-4 text-lg font-semibold text-white">Done-For-You</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Our operations team runs your agents for you. You get the results — leads, content,
                completed workflows — without touching the tech.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={100}>
            <GlassCard glow className="h-full">
              <KeyRound className="h-6 w-6 text-brand-teal" />
              <h3 className="mt-4 text-lg font-semibold text-white">Done-With-You</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                We build the system, train your team, and hand over the keys. You own it, you run
                it — with our support always on call.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Proof */}
      <section className="container pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-canvas-soft px-6 py-14 ring-1 ring-white/10 md:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, #50e6d5, transparent)' }}
            />
            <div className="relative max-w-2xl">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-teal">
                Proof, not promises
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                We automate our own business first
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
                Assist Intellix was born inside a real operations-heavy business — a short-term
                rental company we&apos;ve run for years. Every agent we sell was built to solve our
                own problems first, and we&apos;re documenting the whole journey publicly.
              </p>
              <Link
                href="/use-cases"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-teal"
              >
                Follow the build
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 pb-24">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title={
                <>
                  From &ldquo;this takes forever&rdquo; to{' '}
                  <span className="text-gradient-brand">&ldquo;this runs itself&rdquo;</span>
                </>
              }
              subtitle="Four simple steps. No jargon, no 6-month enterprise projects."
            />
          </Reveal>
        </div>
        <ProcessTimeline />
        <div className="container text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-teal"
          >
            See the full process
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Use cases */}
      <section className="container pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="Use cases"
            title="Real agents, doing real work"
            subtitle="Including the ones running inside our own business right now."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {useCases.map((useCase, i) => (
            <Reveal key={useCase.title} delay={i * 100}>
              <UseCaseCard useCase={useCase} compact />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-teal"
          >
            Explore all use cases
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </section>

      {/* Final CTA */}
      <CTABanner
        headline="Find out what you could automate"
        subline="A free 30-minute audit. We'll identify the 2–3 highest-impact tasks to automate — no obligation, no pressure."
        primaryLabel="Book My Free Audit"
      />
    </div>
  )
}
