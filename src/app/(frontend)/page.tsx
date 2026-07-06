import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { AutomationHero } from '@/heros/AutomationHero'
import { ProcessTimeline } from '@/components/ProcessTimeline'
import { getPageSEO } from '@/utilities/getPageSEO'
import { generatePageMeta } from '@/utilities/generateMeta'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'
import siteConfig from '@/config/site'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('home').catch(() => null)
  return generatePageMeta({ slug: '/', seoDoc, fallbackTitle: siteConfig.seo.defaultTitle })
}

export default async function HomePage() {
  const seoDoc = await getPageSEO('home').catch(() => null)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? siteConfig.seo.defaultTitle,
              description: seoDoc?.meta?.description ?? siteConfig.seo.defaultDescription,
              url: siteConfig.url,
            }),
            breadcrumbSchema([{ name: 'Home', href: '/' }]),
          ]),
        }}
      />

      {/* Hero */}
      <AutomationHero />

      {/* Our process */}
      <ProcessTimeline />

      {/* CTA */}
      <section className="snap-start snap-always scroll-mt-(--header-height,0px) flex min-h-[calc(100dvh-var(--header-height,0px))] flex-col justify-center overflow-y-auto bg-primary px-4 py-24 text-center text-primary-foreground">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-8 opacity-90">
            Let&apos;s talk about your project. Our team is ready to help you reach your goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-6 py-3 font-medium transition-all duration-200 hover:bg-background/90 active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  )
}
