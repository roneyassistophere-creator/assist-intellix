import React from 'react'

import { GlassCard } from './GlassCard'

type StatCardProps = {
  value: string
  label: string
  sub?: string
}

export function StatCard({ value, label, sub }: StatCardProps) {
  return (
    <GlassCard glow className="text-center">
      <p className="text-gradient-brand text-4xl font-semibold tracking-tight md:text-5xl">
        {value}
      </p>
      <p className="mt-3 text-sm font-medium text-white">{label}</p>
      {sub && <p className="mt-1.5 text-xs leading-relaxed text-white/50">{sub}</p>}
    </GlassCard>
  )
}
