import type { Metadata } from 'next'
import React from 'react'

import siteConfig from '@/config/site'
import { generatePageMeta } from '@/utilities/generateMeta'
import { getPageSEO } from '@/utilities/getPageSEO'
import { jsonLdScript, webPageSchema, breadcrumbSchema } from '@/utilities/jsonld'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const seoDoc = await getPageSEO('privacy').catch(() => null)
  return generatePageMeta({ slug: 'privacy', seoDoc, fallbackTitle: 'Privacy Policy' })
}

export default async function PrivacyPage() {
  const seoDoc = await getPageSEO('privacy').catch(() => null)

  return (
    <div className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            webPageSchema({
              name: seoDoc?.meta?.title ?? 'Privacy Policy',
              description: seoDoc?.meta?.description ?? `How ${siteConfig.name} handles your data.`,
              url: `${siteConfig.url}/privacy`,
            }),
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Privacy Policy', href: '/privacy' },
            ]),
          ]),
        }}
      />

      <section className="container max-w-3xl py-24">
        <div className="prose prose-invert max-w-none">
          <h1>Privacy Policy</h1>
          <p className="lead">
            {siteConfig.name} ({siteConfig.affiliation.toLowerCase()}) respects your privacy. This
            policy explains what we collect, why, and your rights under UK GDPR.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Contact details you give us</strong> — name, email address, and phone number
              when you submit an automation request or book an audit call.
            </li>
            <li>
              <strong>Request details</strong> — the description of what you&apos;d like to
              automate, so we can prepare for your audit.
            </li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To respond to your enquiry and schedule your Automation Audit.</li>
            <li>To prepare recommendations relevant to your business.</li>
            <li>We do not sell your data or share it with third parties for marketing.</li>
          </ul>

          <h2>Outreach and lead generation</h2>
          <p>
            Where we contact businesses on behalf of clients, our outreach systems are designed
            with UK GDPR and PECR compliance in mind — business contact data only, with a clear
            way to opt out of further contact.
          </p>

          <h2>Storage and retention</h2>
          <p>
            Submissions are stored securely and kept only as long as needed to handle your enquiry
            and any resulting engagement. You can ask us to delete your data at any time.
          </p>

          <h2>Your rights</h2>
          <p>
            Under UK GDPR you can request access to, correction of, or deletion of your personal
            data. To exercise any of these rights, email{' '}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Reach us at{' '}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>
        </div>
      </section>
    </div>
  )
}
