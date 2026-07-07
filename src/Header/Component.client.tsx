'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { MobileMenu } from './MobileMenu'

export const HeaderClient: React.FC = () => {
  const [heroTheme, setHeroTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  // Reset hero-override whenever we navigate
  useEffect(() => {
    setHeaderTheme(null)
    setHeroTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Apply hero-override only when a page explicitly requests it
  useEffect(() => {
    setHeroTheme(headerTheme ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-white/10 bg-canvas/80 backdrop-blur-sm"
      {...(heroTheme ? { 'data-theme': heroTheme } : {})}
    >
      <div className="container py-4 flex justify-between items-center">
        <Link href="/">
          <Logo loading="eager" priority="high" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <HeaderNav />
          </div>
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-brand-blue px-5 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(20,136,252,0.3)] transition-all hover:bg-[#1a94ff] active:scale-95"
          >
            Book a Call
          </Link>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
