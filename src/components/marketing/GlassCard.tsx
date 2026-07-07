import React from 'react'

import { cn } from '@/utilities/ui'

type GlassCardProps = {
  className?: string
  /** Adds a brand-blue hover glow (use on interactive/linked cards). */
  glow?: boolean
  children: React.ReactNode
}

export function GlassCard({ className, glow = false, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/8 backdrop-blur-sm transition-all duration-300 md:p-8',
        glow && 'hover:shadow-[0_0_30px_rgba(20,136,252,0.15)] hover:ring-white/15',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent"
      />
      {children}
    </div>
  )
}
