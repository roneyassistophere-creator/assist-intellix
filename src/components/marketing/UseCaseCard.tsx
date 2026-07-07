import React from 'react'

import { cn } from '@/utilities/ui'

import { GlassCard } from './GlassCard'

export type UseCase = {
  title: string
  description: string
  builtFor: string
  replaces: string
  status: 'live' | 'building'
}

function StatusBadge({ status }: { status: UseCase['status'] }) {
  const live = status === 'live'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider ring-1',
        live
          ? 'bg-brand-teal/10 text-brand-teal ring-brand-teal/25'
          : 'bg-brand-blue/10 text-brand-cyan ring-brand-blue/25',
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            live ? 'bg-brand-teal' : 'bg-brand-cyan',
          )}
        />
        <span
          className={cn(
            'relative inline-flex h-1.5 w-1.5 rounded-full',
            live ? 'bg-brand-teal' : 'bg-brand-cyan',
          )}
        />
      </span>
      {live ? 'Live' : 'Build in public'}
    </span>
  )
}

type UseCaseCardProps = {
  useCase: UseCase
  /** Hides the built-for/replaces footer (homepage teaser). */
  compact?: boolean
}

export function UseCaseCard({ useCase, compact = false }: UseCaseCardProps) {
  return (
    <GlassCard glow className="flex h-full flex-col">
      <div>
        <StatusBadge status={useCase.status} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{useCase.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{useCase.description}</p>
      {!compact && (
        <dl className="mt-auto space-y-2.5 border-t border-white/8 pt-5 text-sm">
          <div className="flex gap-2">
            <dt className="shrink-0 font-mono text-xs uppercase tracking-wider text-white/40">
              Built for
            </dt>
            <dd className="text-white/70">{useCase.builtFor}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-mono text-xs uppercase tracking-wider text-white/40">
              Replaces
            </dt>
            <dd className="text-white/70">{useCase.replaces}</dd>
          </div>
        </dl>
      )}
    </GlassCard>
  )
}
