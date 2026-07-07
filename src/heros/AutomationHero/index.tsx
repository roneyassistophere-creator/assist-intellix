'use client'

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { LogoMark } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'

// Tracks Tailwind's `sm` breakpoint (640px) so the lamp glow's animated
// widths can shrink on mobile. Tailwind's responsive classes can't drive
// framer-motion's animate/whileInView targets (those take literal values),
// so this is done in JS. Defaults to the mobile sizing during SSR/first
// paint — the 0.3s animation delay below covers the brief correction on
// desktop before a user would notice.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    setIsDesktop(mql.matches)
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])
  return isDesktop
}

// LAMP GLOW
// Replaces the old ray-arc background with an animated conic-gradient "lamp"
// in the brand blue (#1488fc, same accent the composer/CTAs use). Sits on
// bg-canvas (#0f0f0f) — the same background the section below (FeatureGrid)
// inherits from the page wrapper — so the hero blends into it with no seam.
function LampGlow() {
  const reduceMotion = useReducedMotion()
  const isDesktop = useIsDesktop()
  const lineTransition = reduceMotion
    ? { duration: 0 }
    : { ease: 'easeInOut' as const, delay: 0.3, duration: 0.8 }

  // Every animated size scales down together on mobile, matching roughly the
  // same final-width-to-viewport ratio as desktop (~30-35%), so the glow
  // reads as a small, centered version of the desktop effect — not a bar
  // that blows out edge-to-edge and clips against overflow-hidden.
  const beam = isDesktop ? { from: '8rem', to: '16rem' } : { from: '2rem', to: '4rem' }
  const line = isDesktop ? { from: '15rem', to: '30rem' } : { from: '4rem', to: '8rem' }
  const cone = isDesktop ? { from: '15rem', to: '30rem' } : { from: '4rem', to: '8rem' }
  const coneHeight = isDesktop ? 'h-56' : 'h-24'
  const maskThickness = isDesktop ? 'w-40' : 'w-16'
  const maskThicknessH = isDesktop ? 'h-40' : 'h-16'

  return (
    // inset-0 (not just top-0 + flex-1) so this wrapper actually has a height —
    // flex-1 does nothing on an absolutely-positioned element, so without an
    // explicit height the box collapsed to 0px and overflow-hidden clipped
    // every child inside it to nothing.
    <div className="absolute inset-0 isolate z-0 flex items-start justify-center overflow-hidden">
      <div className="absolute top-0 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

      {/* Main glow */}
      <div className="absolute inset-auto z-50 h-16 w-28 -translate-y-[-30%] rounded-full bg-brand-blue/60 opacity-80 blur-2xl sm:h-36 sm:w-[28rem] sm:blur-3xl" />

      {/* Lamp beam */}
      <m.div
        initial={reduceMotion ? { width: beam.to } : { width: beam.from }}
        viewport={{ once: true }}
        transition={lineTransition}
        whileInView={{ width: beam.to }}
        className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-brand-blue/60 blur-xl sm:blur-2xl"
      />

      {/* Top line */}
      <m.div
        initial={reduceMotion ? { width: line.to } : { width: line.from }}
        viewport={{ once: true }}
        transition={lineTransition}
        whileInView={{ width: line.to }}
        className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-brand-blue/60"
      />

      {/* Left gradient cone */}
      <m.div
        initial={
          reduceMotion ? { opacity: 1, width: cone.to } : { opacity: 0.5, width: cone.from }
        }
        viewport={{ once: true }}
        whileInView={{ opacity: 1, width: cone.to }}
        transition={lineTransition}
        style={{
          backgroundImage:
            'conic-gradient(from 70deg at center top, #1488fc99, transparent, transparent)',
        }}
        className={`absolute inset-auto right-1/2 ${coneHeight} overflow-visible`}
      >
        <div
          className={`absolute bottom-0 left-0 z-20 w-full bg-canvas [mask-image:linear-gradient(to_top,white,transparent)] ${maskThicknessH}`}
        />
        <div
          className={`absolute bottom-0 left-0 z-20 h-full bg-canvas [mask-image:linear-gradient(to_right,white,transparent)] ${maskThickness}`}
        />
      </m.div>

      {/* Right gradient cone */}
      <m.div
        initial={
          reduceMotion ? { opacity: 1, width: cone.to } : { opacity: 0.5, width: cone.from }
        }
        viewport={{ once: true }}
        whileInView={{ opacity: 1, width: cone.to }}
        transition={lineTransition}
        style={{
          backgroundImage:
            'conic-gradient(from 290deg at center top, transparent, transparent, #1488fc99)',
        }}
        className={`absolute inset-auto left-1/2 ${coneHeight}`}
      >
        <div
          className={`absolute bottom-0 right-0 z-20 h-full bg-canvas [mask-image:linear-gradient(to_left,white,transparent)] ${maskThickness}`}
        />
        <div
          className={`absolute bottom-0 right-0 z-20 w-full bg-canvas [mask-image:linear-gradient(to_top,white,transparent)] ${maskThicknessH}`}
        />
      </m.div>
    </div>
  )
}

interface AutomationHeroProps {
  title?: React.ReactNode
  subtitle?: string
}

// The prompt composer is no longer part of the hero — it lives in the global
// `<GlobalComposer />` fixed at the bottom of the viewport site-wide. The hero is
// now just a normal-height intro section (no scroll-snap, no full-viewport sizing).
export function AutomationHero({
  title = 'AI that works for you.',
  subtitle = 'Transform your workflow with intelligent automation. Simple, powerful, reliable.',
}: AutomationHeroProps) {
  const reduceMotion = useReducedMotion()

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative flex min-h-[78svh] w-full flex-col items-center justify-center overflow-hidden bg-canvas px-4 py-24">
        <LampGlow />

        <m.div
          initial={reduceMotion ? { y: 0, opacity: 1 } : { y: 60, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={
            reduceMotion ? { duration: 0 } : { ease: 'easeInOut', delay: 0.3, duration: 0.8 }
          }
          whileInView={{ y: 0, opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <LogoMark className="size-14 sm:size-16 mb-10" />

          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-[600px] text-lg text-[#8a8a8f] md:text-xl">{subtitle}</p>
            )}
            <div className="mt-8 flex gap-4">
              <Button variant="outline" asChild>
                <Link href="#how-it-works">Try Demo</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/contact">Start Free</Link>
              </Button>
            </div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  )
}
