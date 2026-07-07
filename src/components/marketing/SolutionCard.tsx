import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { GlassCard } from './GlassCard'

type SolutionCardProps = {
  icon: LucideIcon
  title: string
  tagline: string
  href: string
}

export function SolutionCard({ icon: Icon, title, tagline, href }: SolutionCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <GlassCard glow className="flex h-full flex-col">
        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-teal/20 to-brand-blue/20 ring-1 ring-white/10">
          <Icon className="h-5 w-5 text-brand-cyan" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{tagline}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-brand-cyan">
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </GlassCard>
    </Link>
  )
}
