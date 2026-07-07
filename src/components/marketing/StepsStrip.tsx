import React from 'react'

import { cn } from '@/utilities/ui'

export type Step = {
  title: string
  timeframe: string
  description: string
}

type StepsStripProps = {
  steps: Step[]
  /** Vertical layout with longer descriptions (used on /how-it-works). */
  detailed?: boolean
  className?: string
}

function StepNumber({ index }: { index: number }) {
  return (
    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas-elevated font-mono text-sm text-white ring-1 ring-white/15">
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-full bg-linear-to-br from-brand-teal/40 to-brand-blue/40 opacity-60 blur-[3px]"
      />
      <span className="relative">{index + 1}</span>
    </div>
  )
}

function TimeframeBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-brand-cyan ring-1 ring-brand-blue/20">
      {children}
    </span>
  )
}

export function StepsStrip({ steps, detailed = false, className }: StepsStripProps) {
  if (detailed) {
    return (
      <ol className={cn('mx-auto max-w-3xl', className)}>
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 pb-12 last:pb-0">
            {i < steps.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute left-5 top-10 h-full w-px -translate-x-1/2 bg-linear-to-b from-brand-blue/40 to-white/5"
              />
            )}
            <StepNumber index={i} />
            <div className="pt-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <TimeframeBadge>{step.timeframe}</TimeframeBadge>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ol className={cn('grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6', className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <div className="flex items-center gap-4">
            <StepNumber index={i} />
            {i < steps.length - 1 && (
              <div
                aria-hidden="true"
                className="hidden h-px flex-1 bg-linear-to-r from-brand-blue/40 to-white/5 lg:block"
              />
            )}
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
          <div className="mt-1.5">
            <TimeframeBadge>{step.timeframe}</TimeframeBadge>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-white/60">{step.description}</p>
        </li>
      ))}
    </ol>
  )
}
