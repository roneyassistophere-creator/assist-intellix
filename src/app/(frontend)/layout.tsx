import type { Metadata, Viewport } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { LazyGlobalComposer } from '@/components/GlobalComposer/Lazy'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { jsonLdScript, organizationSchema, websiteSchema } from '@/utilities/jsonld'
import siteConfig from '@/config/site'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript([organizationSchema(siteConfig), websiteSchema(siteConfig)]),
          }}
        />
      </head>
      <body>
        <Providers>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <div id="page-wrapper">
            <Header />
            {children}
            <Footer />
          </div>
          <LazyGlobalComposer />
        </Providers>
      </body>
    </html>
  )
}

// App-like viewport: disable all browser zoom (auto-zoom on input focus,
// double-tap, pinch) so typing never zooms the page; `interactiveWidget:
// 'resizes-content'` makes the on-screen keyboard shrink the layout viewport on
// Android so the fixed bottom composer rides above it natively.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: siteConfig.seo.twitterHandle || undefined,
  },
  verification: {
    google: siteConfig.seo.googleVerification || undefined,
    other: siteConfig.seo.bingVerification
      ? { 'msvalidate.01': siteConfig.seo.bingVerification }
      : undefined,
  },
}
