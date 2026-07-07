import { Shield, TrendingUp, Users, Workflow, Zap } from 'lucide-react'
import React from 'react'

import { GlassCard } from './GlassCard'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

/**
 * Bento-style trust grid shown right after the hero. Content mirrors the
 * client doc's recurring themes (always-on agents, existing-stack fit,
 * launch speed, UK GDPR/PECR compliance, Done-For-You vs Done-With-You) so
 * it doesn't duplicate the longer Problem/Solutions/Differentiator sections
 * further down the page — this is the fast, scannable version.
 */
export function FeatureGrid() {
  return (
    <section className="container pb-24">
      <Reveal>
        <SectionHeading
          eyebrow="Why Assist Intellix"
          title="Built for how businesses actually run"
          subtitle="Not a generic tool. A system shaped around your stack, your compliance needs, and your timeline."
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-6 gap-5">
        {/* Big stat tile */}
        <Reveal className="col-span-full lg:col-span-2">
          <GlassCard glow className="relative flex h-full flex-col items-center justify-center overflow-hidden text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ background: 'radial-gradient(closest-side, rgba(20,136,252,0.25), transparent)' }}
            />
            <div className="relative">
              <Zap className="mx-auto h-6 w-6 text-brand-cyan" />
              <p className="text-gradient-brand mt-3 text-5xl font-semibold tracking-tight">24/7</p>
              <h3 className="mt-3 text-lg font-semibold text-white">Always-on agents</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Working while your team sleeps — no shifts, no burnout, no missed lead.
              </p>
            </div>
          </GlassCard>
        </Reveal>

        {/* Integrations tile */}
        <Reveal delay={80} className="col-span-full sm:col-span-3 lg:col-span-2">
          <GlassCard glow className="flex h-full flex-col items-center text-center">
            <div className="relative flex size-24 items-center justify-center rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
              <Workflow className="size-7 text-brand-cyan" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-white">Works with your stack</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              No rip-and-replace. We connect to the tools you already use.
            </p>
          </GlassCard>
        </Reveal>

        {/* Build-speed tile */}
        <Reveal delay={160} className="col-span-full sm:col-span-3 lg:col-span-2">
          <GlassCard glow className="flex h-full flex-col items-center text-center">
            <div className="flex h-16 items-center">
              <svg viewBox="0 0 120 48" className="h-12 w-28 text-brand-teal" fill="none">
                <polyline
                  points="2,40 25,30 45,34 65,16 88,20 118,4"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mt-4 flex items-center gap-1.5 text-lg font-semibold text-white">
              <TrendingUp className="h-4 w-4 text-brand-cyan" />
              1–3 weeks to launch
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Built fast, tested against real scenarios — not just a demo.
            </p>
          </GlassCard>
        </Reveal>

        {/* Compliance split tile */}
        <Reveal className="col-span-full lg:col-span-3">
          <GlassCard glow className="grid h-full gap-6 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-teal/20 to-brand-blue/20 ring-1 ring-white/10">
                <Shield className="h-5 w-5 text-brand-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Compliant by default</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Outreach systems built with UK GDPR and PECR compliance in mind, from day one.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-canvas-elevated/60 p-4 font-mono text-xs ring-1 ring-white/5">
              <p className="text-white/60">agent.compliance_check()</p>
              <p className="mt-2 text-brand-teal">✓ gdpr: compliant</p>
              <p className="mt-1.5 text-brand-teal">✓ pecr: opt-out ready</p>
              <p className="mt-1.5 text-brand-teal">✓ data: encrypted</p>
            </div>
          </GlassCard>
        </Reveal>

        {/* Managed / support split tile */}
        <Reveal delay={80} className="col-span-full lg:col-span-3">
          <GlassCard glow className="grid h-full gap-6 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-teal/20 to-brand-blue/20 ring-1 ring-white/10">
                <Users className="h-5 w-5 text-brand-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Fully managed, or fully yours</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Our operations team can run it for you — or hand you the keys. Your choice.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <span className="rounded-full bg-brand-teal/10 px-4 py-1.5 text-xs font-medium text-brand-teal ring-1 ring-brand-teal/20">
                Done-For-You
              </span>
              <span className="rounded-full bg-brand-blue/10 px-4 py-1.5 text-xs font-medium text-brand-cyan ring-1 ring-brand-blue/20">
                Done-With-You
              </span>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}
