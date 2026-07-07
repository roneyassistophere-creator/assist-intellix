import type { Metadata } from 'next'
import React from 'react'

import siteConfig from '@/config/site'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('terms').catch(() => null)
  return generatePageMeta({ slug: 'terms', seoDoc, fallbackTitle: 'Terms of Service' })
}

export default async function TermsPage() {
  const seoDoc = await getPageSEO('terms').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? 'Terms of Service',
              description:
                seoDoc?.meta?.description ?? `Terms of service for ${siteConfig.name}.`,
              url: `${siteConfig.url}/terms`,
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Terms of Service', href: '/terms' },
            ]),
          ]),
        }}
      />

      <section className="container max-w-3xl py-24">
        <div className="prose prose-invert max-w-none">
          <h1>Terms of Service</h1>
          <p className="lead">
            These terms govern your use of the {siteConfig.name} website and services.
          </p>

          <h2>Services</h2>
          <p>
            {siteConfig.name} builds custom AI agents and automation systems. Every engagement is
            scoped individually: after a free Automation Audit, you receive a written proposal
            with a fixed quote before any work begins.
          </p>

          <h2>Proposals and payment</h2>
          <ul>
            <li>Quotes are fixed for the scope agreed in the blueprint you approve.</li>
            <li>Changes to scope are agreed and priced before implementation.</li>
            <li>Every project includes a support period, stated in your proposal.</li>
          </ul>

          <h2>Your responsibilities</h2>
          <p>
            You confirm you have the right to grant us access to the tools, data, and accounts
            connected to your automation, and that your use of our systems complies with the laws
            that apply to your business.
          </p>

          <h2>Liability</h2>
          <p>
            We build and test every system against real scenarios before launch. Our liability for
            any claim arising from an engagement is limited to the fees paid for that engagement.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{' '}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>
        </div>
      </section>
    </div>
  )
}
