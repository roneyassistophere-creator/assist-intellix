'use client'

import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

import { automationTools } from '@/heros/AutomationHero/tools'

import { GlassCard } from './GlassCard'
import { brandButtonClasses } from './styles'

const inputClasses =
  'w-full rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/60'

export function AuditRequestForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/automation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone') || undefined,
          prompt: data.get('prompt'),
          tool: data.get('tool'),
          source: 'audit-form',
        }),
      })
      const json = await res.json().catch(() => null)

      if (res.ok && json?.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(json?.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <GlassCard className="text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-teal" />
        <h3 className="mt-4 text-lg font-semibold text-white">Request received</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
          We&apos;ll reply within one business day to schedule your free 30-minute Automation
          Audit.
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="audit-name" className="mb-1.5 block text-xs font-medium text-white/60">
              Name
            </label>
            <input
              id="audit-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="audit-email" className="mb-1.5 block text-xs font-medium text-white/60">
              Email
            </label>
            <input
              id="audit-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="audit-phone" className="mb-1.5 block text-xs font-medium text-white/60">
              Phone <span className="text-white/35">(optional)</span>
            </label>
            <input
              id="audit-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+44 …"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="audit-tool" className="mb-1.5 block text-xs font-medium text-white/60">
              What fits best?
            </label>
            <select
              id="audit-tool"
              name="tool"
              defaultValue="custom-ai-agents"
              className={inputClasses}
            >
              {automationTools.map((tool) => (
                <option key={tool.value} value={tool.value} className="bg-canvas-elevated">
                  {tool.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="audit-prompt" className="mb-1.5 block text-xs font-medium text-white/60">
            What would you like to automate?
          </label>
          <textarea
            id="audit-prompt"
            name="prompt"
            required
            rows={4}
            placeholder="Tell us about the repetitive work eating your team's time…"
            className={inputClasses}
          />
        </div>

        {status === 'error' && <p className="text-sm text-red-400">{errorMessage}</p>}

        <button type="submit" disabled={status === 'submitting'} className={brandButtonClasses}>
          {status === 'submitting' ? (
            <>
              Sending
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Request my free audit
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </GlassCard>
  )
}
