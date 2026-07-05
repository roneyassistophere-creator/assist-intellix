'use client'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Bot,
  Check,
  ChevronDown,
  Cog,
  Database,
  Lightbulb,
  Mail,
  MessageSquare,
  Paperclip,
  Plus,
  SendHorizontal,
  Workflow,
  X,
} from 'lucide-react'

import { LogoMark } from '@/components/Logo/Logo'
import { RequestFunnel, type FunnelStage } from './RequestFunnel'
import { automationTools, type AutomationTool } from './tools'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUCCESS_RESET_DELAY_MS = 3000

const toolIcons: Record<string, React.ReactNode> = {
  'workflow-automation': <Workflow className="size-4 text-blue-400" />,
  'ai-chatbots': <MessageSquare className="size-4 text-emerald-400" />,
  'crm-automation': <Database className="size-4 text-purple-400" />,
  'custom-ai-agents': <Bot className="size-4 text-amber-400" />,
  rpa: <Cog className="size-4 text-cyan-400" />,
  'email-marketing-automation': <Mail className="size-4 text-pink-400" />,
}

const defaultTool = automationTools.find((tool) => tool.popular) ?? automationTools[0]

// TOOL SELECTOR
function ToolSelector({
  selected,
  onSelect,
}: {
  selected: AutomationTool
  onSelect: (tool: AutomationTool) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (tool: AutomationTool) => {
    onSelect(tool)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-[#8a8a8f] hover:text-white hover:bg-white/5 active:scale-95"
      >
        {toolIcons[selected.value]}
        <span className="max-w-[90px] truncate sm:max-w-none">{selected.label}</span>
        <ChevronDown className={`size-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-50 w-[min(320px,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto bg-[#1a1a1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-1.5">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#5a5a5f]">
                What do you want to automate?
              </div>
              {automationTools.map((tool) => (
                <button
                  type="button"
                  key={tool.value}
                  onClick={() => handleSelect(tool)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${
                    selected.value === tool.value ? 'bg-white/10 text-white' : 'text-[#a0a0a5] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex-shrink-0">{toolIcons[tool.value]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{tool.label}</span>
                      {tool.popular && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-blue-500/20 text-blue-300">
                          Most Requested
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#6a6a6f]">{tool.description}</span>
                  </div>
                  {selected.value === tool.value && <Check className="size-4 text-blue-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// CHAT INPUT
function ChatInput({
  value,
  onChange,
  selectedTool,
  onToolChange,
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  wantsPlan,
  onTogglePlan,
  onSuccess,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  selectedTool: AutomationTool
  onToolChange: (tool: AutomationTool) => void
  attachments: string[]
  onAddAttachments: (names: string[]) => void
  onRemoveAttachment: (name: string) => void
  wantsPlan: boolean
  onTogglePlan: () => void
  onSuccess: () => void
  placeholder: string
}) {
  const [showHint, setShowHint] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 'prompt' = the normal textarea/toolbar view; anything else = a step of the
  // inline contact-detail funnel that replaces it once "Build now" is clicked.
  const [stage, setStage] = useState<'prompt' | FunnelStage>('prompt')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [processingStepIndex, setProcessingStepIndex] = useState(0)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea && stage === 'prompt') {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [value, stage])

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  const handleBuildNow = () => {
    if (!value.trim()) {
      setShowHint(true)
      textareaRef.current?.focus()
      return
    }
    setShowHint(false)
    setErrorMessage(null)
    setStage('name')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBuildNow()
    }
  }

  // Full reset — used only after a successful submission auto-closes the funnel.
  // Going "back" during the funnel must NOT clear already-entered values (see
  // handleBack below); this is deliberately the only path that does.
  const resetFunnel = () => {
    setStage('prompt')
    setName('')
    setPhone('')
    setEmail('')
    setErrorMessage(null)
  }

  // Steps back exactly one stage, preserving whatever was already typed in the
  // other fields — e.g. going from "email" back to "phone" to fix a typo doesn't
  // lose the email or name already entered.
  const handleBack = () => {
    setErrorMessage(null)
    if (stage === 'name') setStage('prompt')
    else if (stage === 'phone') setStage('name')
    else if (stage === 'email') setStage('phone')
    else if (stage === 'error') setStage('email')
  }

  const submitRequest = async () => {
    setStage('processing')
    setProcessingStepIndex(0)
    setErrorMessage(null)

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    // Fire the real request immediately, in parallel with the staged animation
    // below — the animation's own pacing provides a minimum duration so the
    // steps don't flash by instantly on a fast connection, while still only
    // reporting success once the request has actually completed.
    const submitPromise = fetch('/api/automation-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        prompt: value,
        tool: selectedTool.value,
        attachments,
        wantsPlan,
      }),
    }).then(async (res) => {
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Something went wrong. Please try again later.')
      }
    })

    try {
      await wait(1000)
      setProcessingStepIndex(1)
      await wait(1000)
      setProcessingStepIndex(2)
      await submitPromise
      await wait(500)
      setStage('success')
      resetTimeoutRef.current = setTimeout(() => {
        onSuccess()
        resetFunnel()
      }, SUCCESS_RESET_DELAY_MS)
    } catch (err) {
      setStage('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again later.')
    }
  }

  const handleFunnelContinue = () => {
    if (stage === 'name') {
      if (!name.trim()) {
        setErrorMessage('Please enter your name.')
        return
      }
      setErrorMessage(null)
      setStage('phone')
    } else if (stage === 'phone') {
      setErrorMessage(null)
      setStage('email')
    } else if (stage === 'email') {
      if (!EMAIL_RE.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.')
        return
      }
      submitRequest()
    }
  }

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      <div className="absolute -inset-[1px] rounded-2xl bg-linear-to-b from-white/[0.08] to-transparent pointer-events-none" />
      <div className="relative rounded-2xl bg-[#1e1e22] ring-1 ring-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_2px_20px_rgba(0,0,0,0.4)]">
        {stage === 'prompt' ? (
          <>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
                if (showHint) setShowHint(false)
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full resize-none bg-transparent text-[15px] text-white placeholder-[#5a5a5f] px-5 pt-5 pb-3 focus:outline-none min-h-[80px] max-h-[200px]"
              style={{ height: '80px' }}
            />

            {showHint && (
              <p className="px-5 pb-1 text-xs text-amber-400">
                Describe what you&apos;d like to automate first.
              </p>
            )}

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-5 pb-2">
                {attachments.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#c0c0c5]"
                  >
                    <Paperclip className="size-3 shrink-0" />
                    <span className="max-w-[140px] truncate">{name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(name)}
                      className="text-[#6a6a6f] hover:text-white"
                      aria-label={`Remove ${name}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    if (files.length) onAddAttachments(files.map((file) => file.name))
                    e.target.value = ''
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center size-8 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-[#8a8a8f] hover:text-white transition-all duration-200 active:scale-95"
                  aria-label="Add context"
                >
                  <Plus className="size-4" />
                </button>
                <ToolSelector selected={selectedTool} onSelect={onToolChange} />
              </div>

              <div className="flex-1" />

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onTogglePlan}
                  aria-label="Request an implementation plan"
                  aria-pressed={wantsPlan}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    wantsPlan
                      ? 'bg-blue-500/15 text-blue-300'
                      : 'text-[#6a6a6f] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Lightbulb className="size-4" />
                  <span className="hidden sm:inline">Plan</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuildNow}
                  aria-label="Build now"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#1488fc] hover:bg-[#1a94ff] text-white transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(20,136,252,0.3)]"
                >
                  <span className="hidden sm:inline">Build now</span>
                  <SendHorizontal className="size-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <RequestFunnel
            stage={stage}
            promptPreview={value}
            toolLabel={selectedTool.label}
            attachments={attachments}
            wantsPlan={wantsPlan}
            name={name}
            phone={phone}
            email={email}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            errorMessage={errorMessage}
            processingStepIndex={processingStepIndex}
            onContinue={handleFunnelContinue}
            onBack={handleBack}
            onRetry={submitRequest}
          />
        )}
      </div>
    </div>
  )
}

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
            background:
              'radial-gradient(43.89% 25.74% at 50.02% 97.24%, #111114 0%, #0f0f0f 100%)',
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

// MAIN AUTOMATION HERO COMPONENT
interface AutomationHeroProps {
  title?: React.ReactNode
  subtitle?: string
  placeholder?: string
}

export function AutomationHero({
  title,
  subtitle = "Describe the workflow you want to automate and we'll build it for you.",
  placeholder = 'What do you want to automate?',
}: AutomationHeroProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedTool, setSelectedTool] = useState<AutomationTool>(defaultTool)
  const [attachments, setAttachments] = useState<string[]>([])
  const [wantsPlan, setWantsPlan] = useState(false)
  const [docked, setDocked] = useState(false)
  const [footerNear, setFooterNear] = useState(false)
  const [topPx, setTopPx] = useState<number | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)
  const dockedRef = useRef(docked)

  // Scope full-page scroll-snap to this (homepage) page only.
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('snap-y', 'snap-mandatory')

    // The sticky header occupies real document-flow space before the hero, and has
    // no scroll-snap-align of its own, so the hero's natural snap-rest point sits at
    // scrollY = headerHeight, not 0 — the browser snaps the hero's raw top edge to
    // the viewport's top edge regardless. (scroll-padding-top is the CSS-spec answer
    // to this, but Chromium does not honor it when the snap container is the root
    // <html> element — confirmed empirically: it's present in computed style but the
    // snap-alignment math ignores it.) So instead of fighting that snap target, each
    // section's height is shrunk to exactly `100dvh - headerHeight` via this CSS
    // variable, so that whatever the snap math lands on, the section fills exactly
    // the remaining space below the sticky header with no gap and no cutoff.
    const updateHeaderHeightVar = () => {
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      html.style.setProperty('--header-height', `${headerHeight}px`)
    }
    updateHeaderHeightVar()
    window.addEventListener('resize', updateHeaderHeightVar)

    return () => {
      html.classList.remove('snap-y', 'snap-mandatory')
      html.style.removeProperty('--header-height')
      window.removeEventListener('resize', updateHeaderHeightVar)
    }
  }, [])

  const recomputeTop = useCallback(() => {
    if (dockedRef.current) {
      const height = composerRef.current?.getBoundingClientRect().height ?? 0
      setTopPx(window.innerHeight - height)
    } else {
      // Compute the anchor's resting position from a scroll-invariant offset rather
      // than its live getBoundingClientRect().top. The anchor's position *within*
      // the hero never changes with scroll position — but the anchor's raw
      // viewport-relative top does, so measuring it directly is only correct if we
      // happen to measure while the hero is fully at rest. When scrolling back up,
      // `docked` flips false the instant the anchor starts re-entering (much
      // earlier than the snap has settled), so a live reading grabs a mid-scroll
      // value and nothing ever corrects it afterward — the composer ends up
      // stranded above (or below) where it should rest. The offset relative to the
      // hero's own box cancels out the current scroll position entirely, so this
      // gives the true resting value no matter when it's called. The hero's own
      // resting viewport position is headerHeight (via scroll-mt-* on each section
      // aligning the hero's snap point so it rests right below the sticky header,
      // not at viewport y=0) and must be added back in, since `position: fixed` +
      // `top` is measured from the true viewport top, not from the hero's own box.
      const anchorRect = anchorRef.current?.getBoundingClientRect()
      const heroRect = heroRef.current?.getBoundingClientRect()
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      if (anchorRect && heroRect) {
        setTopPx(anchorRect.top - heroRect.top + headerHeight)
      }
    }
  }, [])

  // Sync the ref and recompute together, synchronously, in the same layout effect.
  // These must not be split across a layout effect + a passive effect: React always
  // runs every useLayoutEffect before any useEffect, so if the ref sync lived in a
  // separate useEffect, recomputeTop() here would read the *previous* docked value
  // every time (one render behind) — it would use the embedded-position formula for
  // an extra tick right after docking, landing the composer off-screen instead of at
  // the viewport bottom, since nothing was left to correct it on a later frame.
  useLayoutEffect(() => {
    dockedRef.current = docked
    recomputeTop()
  }, [docked, recomputeTop])

  // Recompute on viewport-shape changes only. `docked` is already a discrete two-state
  // value driven entirely by the anchor's IntersectionObserver below, and mandatory
  // scroll-snap means there's no in-between resting state worth tracking live during
  // scroll — doing so would fight the `top` CSS transition (a continuously-reassigned
  // target never lets the transition converge, then the docked flip jumps the rest of
  // the way), which is what caused the previous "rises, then independently drops" glitch.
  useEffect(() => {
    let rafId: number | null = null
    const schedule = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null
          recomputeTop()
        })
      }
    }
    window.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)
    return () => {
      window.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [recomputeTop])

  // Keep the docked position accurate as the composer's own height changes
  // (textarea growth, attachment chips, hint text).
  useEffect(() => {
    const el = composerRef.current
    if (!el) return
    const observer = new ResizeObserver(() => recomputeTop())
    observer.observe(el)
    return () => observer.disconnect()
  }, [recomputeTop])

  // docked = the hero's embedded composer anchor has scrolled out of view.
  useEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setDocked(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // footerNear = the footer has genuinely scrolled into view. Since snap sections are
  // stacked with zero gap, the footer's top edge sits exactly at the viewport bottom
  // whenever the previous section is at rest — a positive rootMargin (meant to detect
  // "approaching") would false-fire the whole time that section is being viewed. A
  // negative bottom margin requires the footer to have actually scrolled ~100px into
  // the real viewport (i.e. the CTA->Footer snap transition is genuinely underway).
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(([entry]) => setFooterNear(entry.isIntersecting), {
      rootMargin: '0px 0px -100px 0px',
      threshold: 0,
    })
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  const handleAddAttachments = (names: string[]) => {
    setAttachments((prev) => Array.from(new Set([...prev, ...names])))
  }

  const handleRemoveAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((n) => n !== name))
  }

  const handleSuccess = () => {
    setPrompt('')
    setSelectedTool(defaultTool)
    setAttachments([])
    setWantsPlan(false)
  }

  return (
    <>
      <div
        ref={heroRef}
        className="snap-start snap-always scroll-mt-(--header-height,0px) relative flex flex-col items-center justify-center min-h-[calc(100dvh-var(--header-height,0px))] w-full overflow-hidden bg-[#0f0f0f]"
      >
        <RayBackground />

        <style>{`
          @keyframes hero-logo-breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.12); }
          }
        `}</style>
        <div className="absolute top-[70px]">
          <LogoMark
            className="size-14 sm:size-16"
            style={{ animation: 'hero-logo-breathe 6s ease-in-out infinite' }}
          />
        </div>

        <div className="absolute top-[66%] left-1/2 sm:top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full h-full overflow-hidden px-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-1">
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

          {/* Invisible spacer reserving the composer's footprint so the headline stays
              centered; the real composer renders in a single fixed instance below. */}
          <div
            ref={anchorRef}
            aria-hidden="true"
            className="h-[156px] w-full max-w-[700px] mb-6 sm:mb-8 mt-2"
          />
        </div>
      </div>

      <div
        ref={composerRef}
        className={`fixed inset-x-0 top-[50%] z-40 flex justify-center px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] ${
          footerNear ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        style={{
          top: topPx ?? undefined,
          transitionProperty: 'top, opacity',
          transitionDuration: '500ms, 300ms',
          transitionTimingFunction: 'ease-out',
        }}
      >
        {docked && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-black/50 to-transparent" />
        )}
        <div className="w-full max-w-[700px]">
          <ChatInput
            value={prompt}
            onChange={setPrompt}
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            attachments={attachments}
            onAddAttachments={handleAddAttachments}
            onRemoveAttachment={handleRemoveAttachment}
            wantsPlan={wantsPlan}
            onTogglePlan={() => setWantsPlan((prev) => !prev)}
            onSuccess={handleSuccess}
            placeholder={placeholder}
          />
        </div>
      </div>
    </>
  )
}
