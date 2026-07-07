import React from 'react'

import { LogoMark } from '@/components/Logo/Logo'

// RAY BACKGROUND
function RayBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[4000px] h-[1800px] sm:w-[6000px]"
        style={{
          background: `radial-gradient(circle at center 800px, rgba(20, 136, 252, 0.8) 0%, rgba(20, 136, 252, 0.35) 14%, rgba(20, 136, 252, 0.18) 18%, rgba(20, 136, 252, 0.08) 22%, rgba(17, 17, 20, 0.2) 25%)`,
        }}
      />
      <div
        className="absolute top-[175px] left-1/2 w-[1600px] h-[1600px] sm:top-1/2 sm:w-[3043px] sm:h-[2865px]"
        style={{ transform: 'translate(-50%) rotate(180deg)' }}
      >
        <div
          className="absolute w-full h-full rounded-full -mt-[13px]"
          style={{
            background: 'radial-gradient(43.89% 25.74% at 50.02% 97.24%, #111114 0%, #0f0f0f 100%)',
            border: '16px solid white',
            transform: 'rotate(180deg)',
            zIndex: 5,
          }}
        />
        <div
          className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[11px]"
          style={{ border: '23px solid #b7d7f6', transform: 'rotate(180deg)', zIndex: 4 }}
        />
        <div
          className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[8px]"
          style={{ border: '23px solid #8fc1f2', transform: 'rotate(180deg)', zIndex: 3 }}
        />
        <div
          className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[4px]"
          style={{ border: '23px solid #64acf6', transform: 'rotate(180deg)', zIndex: 2 }}
        />
        <div
          className="absolute w-full h-full rounded-full bg-[#0f0f0f]"
          style={{
            border: '20px solid #1172e2',
            boxShadow: '0 -15px 24.8px rgba(17, 114, 226, 0.6)',
            transform: 'rotate(180deg)',
            zIndex: 1,
          }}
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent sm:h-48" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent sm:h-64" />
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
  title,
  subtitle = "Describe the workflow you want to automate and we'll build it for you.",
}: AutomationHeroProps) {
  return (
    <section className="relative flex min-h-[78svh] w-full flex-col items-center justify-center overflow-hidden bg-[#0f0f0f] px-4 py-24">
      <RayBackground />

      {/* Lift the content above the RayBackground's horizon arc (which sits at the
          vertical center on desktop) so the headline clears the glow line. */}
      <div className="relative z-10 flex flex-col items-center sm:-translate-y-28">
        <LogoMark className="size-14 sm:size-16 mb-10" />

        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-2">
            {title ?? (
              <>
                What will you{' '}
                <span className="bg-linear-to-b from-[#4da5fc] via-[#4da5fc] to-white bg-clip-text text-transparent italic">
                  automate
                </span>{' '}
                today?
              </>
            )}
          </h1>
          <p className="text-base sm:text-lg text-[#8a8a8f]">{subtitle}</p>
        </div>
      </div>
    </section>
  )
}
