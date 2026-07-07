import React from 'react'

import siteConfig from '@/config/site'

import { AuditRequestForm } from './AuditRequestForm'

/**
 * Renders the booking calendar (Calendly / Cal.com) when
 * `siteConfig.booking.calendarUrl` is set; otherwise falls back to the
 * audit request form wired to /api/automation-requests.
 */
export function CalendarEmbed() {
  const url = siteConfig.booking.calendarUrl

  if (!url) return <AuditRequestForm />

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-white/10">
      <iframe
        src={url}
        title="Book your free Automation Audit"
        className="h-[680px] w-full border-0"
        loading="lazy"
      />
    </div>
  )
}
