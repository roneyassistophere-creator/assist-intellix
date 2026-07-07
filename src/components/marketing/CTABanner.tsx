import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

import { brandButtonClasses, ghostButtonClasses } from './styles'

type CTABannerProps = {
  headline: string
  subline?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  className?: string
}

export function CTABanner({
  headline,
  subline,
  primaryLabel = 'Book a Free Automation Audit',
  primaryHref = '/contact',
  secondaryLabel,
  secondaryHref,
  className,
}: CTABannerProps) {
  return (
    <section className={cn('container pb-24', className)}>
      <div className="relative overflow-hidden rounded-3xl bg-canvas-soft px-6 py-16 text-center ring-1 ring-white/10 md:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, #1488fc, transparent)' }}
        />
        <h2 className="relative mx-auto max-w-2xl text-2xl font-semibold tracking-tight text-white md:text-4xl">
          {headline}
        </h2>
        {subline && <p className="relative mx-auto mt-4 max-w-xl text-white/60">{subline}</p>}
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={primaryHref} className={brandButtonClasses}>
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} className={ghostButtonClasses}>
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
