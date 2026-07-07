import { Home, Layers, Users, BookOpen, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { solutions } from './solutions'

export type NavGrandchild = {
  label: string
  href: string
}

export type NavChild = {
  label: string
  href: string
  children?: NavGrandchild[]
}

export type NavLink = {
  label: string
  href: string
  external?: boolean
  icon?: LucideIcon
  children?: NavChild[]
}

export type FooterLinkGroup = {
  heading: string
  links: { label: string; href: string }[]
}

export type SocialLink = {
  platform: string
  href: string
  icon: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'youtube'
}

export type SiteConfig = {
  name: string
  tagline: string
  description: string
  url: string
  logo: {
    text: string
    imagePath?: string
  }
  seo: {
    titleTemplate: string
    defaultTitle: string
    defaultDescription: string
    defaultOgImage: string
    twitterHandle: string
    googleVerification: string
    bingVerification: string
  }
  nav: NavLink[]
  footerLinks: FooterLinkGroup[]
  booking: {
    /** Calendly / Cal.com embed URL; empty string = fall back to the audit form. */
    calendarUrl: string
  }
  /** Group affiliation line rendered in the footer and on the About page. */
  affiliation: string
  contact: {
    email: string
    phone?: string
    address?: string
  }
  social: SocialLink[]
  org: {
    legalName: string
    foundingYear: number
    areaServed: string
  }
}

const siteConfig: SiteConfig = {
  // ─── Identity ──────────────────────────────────────────────────────────────
  name: 'Assist Intellix',
  tagline: 'Custom AI agents that take repetitive work off your plate.',
  description:
    'Assist Intellix builds custom AI agents and automation systems that take over manual, repetitive tasks — so your team can focus on the work that grows your business.',
  url: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',

  // ─── Logo ──────────────────────────────────────────────────────────────────
  logo: {
    text: 'Assist Intellix',
    // imagePath: '/logo.svg',
  },

  // ─── SEO defaults ──────────────────────────────────────────────────────────
  seo: {
    titleTemplate: '%s | Assist Intellix',
    defaultTitle: 'Assist Intellix — Custom AI Agents & Automation',
    defaultDescription:
      'Custom AI agents and automation systems that take over manual, repetitive work — lead generation, content, and business workflows that run themselves.',
    defaultOgImage: '/website-template-OG.webp',
    twitterHandle: '@assistintellix',
    googleVerification: process.env.GOOGLE_SITE_VERIFICATION ?? '',
    bingVerification: process.env.BING_SITE_VERIFICATION ?? '',
  },

  // ─── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { label: 'Home', href: '/', icon: Home },
    {
      label: 'Solutions',
      href: '/services',
      icon: Layers,
      // Generated from solutions.ts so nav and routes can never drift apart.
      children: solutions.map((solution) => ({
        label: solution.title,
        href: `/services/${solution.slug}`,
        children: solution.subSolutions.map((sub) => ({
          label: sub.title,
          href: `/services/${solution.slug}/${sub.slug}`,
        })),
      })),
    },
    { label: 'About', href: '/about', icon: Users },
    { label: 'Blog', href: '/blog', icon: BookOpen },
    { label: 'Contact', href: '/contact', icon: Mail },
  ],

  // ─── Footer links ──────────────────────────────────────────────────────────
  footerLinks: [
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Solutions', href: '/services' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      heading: 'Explore',
      links: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Use Cases', href: '/use-cases' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ],

  // ─── Booking ───────────────────────────────────────────────────────────────
  booking: {
    calendarUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? '',
  },

  // ─── Group ─────────────────────────────────────────────────────────────────
  affiliation: 'An Assistophere company',

  // ─── Contact ───────────────────────────────────────────────────────────────
  contact: {
    email: 'intellix.assistophere@gmail.com',
  },

  // ─── Social ────────────────────────────────────────────────────────────────
  social: [
    { platform: 'Twitter / X', href: 'https://twitter.com/assistintellix', icon: 'twitter' },
    { platform: 'LinkedIn', href: 'https://linkedin.com/company/assistintellix', icon: 'linkedin' },
    { platform: 'GitHub', href: 'https://github.com/assistintellix', icon: 'github' },
  ],

  // ─── Organization (used for JSON-LD structured data) ───────────────────────
  org: {
    legalName: 'Assist Intellix LLC',
    foundingYear: 2020,
    areaServed: 'Worldwide',
  },
}

export default siteConfig
