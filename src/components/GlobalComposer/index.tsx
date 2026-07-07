'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  ArrowLeft,
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

import { RequestFunnel, type FunnelStage } from '@/heros/AutomationHero/RequestFunnel'
import { automationTools, type AutomationTool } from '@/heros/AutomationHero/tools'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUCCESS_RESET_DELAY_MS = 3000
const MOBILE_MAX_WIDTH = 640

// Allowlist: the persistent prompt bar only appears on the homepage and the
// marketing pages. Everything else (blog, contact, search, legal, admin, and
// any future page) is hidden by default — safest.
function isComposerVisible(pathname: string): boolean {
  if (pathname === '/') return true
  return ['/about', '/services', '/careers'].some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
}

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
        <ChevronDown
          className={`size-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-50 w-[min(320px,calc(100vw-2rem))] max-h-[60vh] overflow-y-auto bg-[#1a1a1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
                    selected.value === tool.value
                      ? 'bg-white/10 text-white'
                      : 'text-[#a0a0a5] hover:bg-white/5 hover:text-white'
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
                  {selected.value === tool.value && (
                    <Check className="size-4 text-blue-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

type Step = 'prompt' | FunnelStage

// COMPOSER — mounted only on allowlisted pages (see GlobalComposer wrapper).
function Composer() {
  const [prompt, setPrompt] = useState('')
  const [selectedTool, setSelectedTool] = useState<AutomationTool>(defaultTool)
  const [attachments, setAttachments] = useState<string[]>([])
  const [wantsPlan, setWantsPlan] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const [stage, setStage] = useState<Step>('prompt')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [processingStepIndex, setProcessingStepIndex] = useState(0)

  const [footerNear, setFooterNear] = useState(false)
  // How far the on-screen keyboard (or bottom browser UI) overlaps the viewport
  // bottom; the composer lifts by exactly this so it rides just above the keyboard.
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFocusedRef = useRef(false)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollLockYRef = useRef<number | null>(null)

  // ── Prompt textarea auto-grow ──────────────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current
    if (el && stage === 'prompt') {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }, [prompt, stage])

  // ── Footer fade ────────────────────────────────────────────────────────────
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(([entry]) => setFooterNear(entry.isIntersecting), {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0,
    })
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  // ── Mobile keyboard handling ────────────────────────────────────────────────
  // While an input is focused: (1) freeze the background page so it doesn't move,
  // and (2) lift the fixed composer above the keyboard. The lift formula is
  // unified across iOS and Android: on Android (interactiveWidget=resizes-content)
  // the layout viewport shrinks so `overlap` ≈ 0 and `bottom:0` already rides up;
  // on iOS the layout viewport stays and `overlap` equals the keyboard height.
  useEffect(() => {
    const vv = window.visualViewport

    const computeOverlap = () => {
      if (!isFocusedRef.current || !vv) return setKeyboardOffset(0)
      const overlap = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
      setKeyboardOffset(overlap)
    }

    const lockScroll = () => {
      if (window.innerWidth >= MOBILE_MAX_WIDTH || scrollLockYRef.current !== null) return
      const y = window.scrollY
      scrollLockYRef.current = y
      const body = document.body
      body.style.position = 'fixed'
      body.style.top = `-${y}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
    }

    const unlockScroll = () => {
      if (scrollLockYRef.current === null) return
      const y = scrollLockYRef.current
      scrollLockYRef.current = null
      const body = document.body
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      window.scrollTo(0, y)
    }

    const handleFocusIn = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current)
        blurTimeoutRef.current = null
      }
      isFocusedRef.current = true
      lockScroll()
      computeOverlap()
    }

    const handleFocusOut = () => {
      // Defer: focus often moves between elements inside the composer (textarea →
      // funnel input, or to a button). Only treat it as a real blur if focus has
      // actually left the composer entirely.
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = setTimeout(() => {
        if (rootRef.current?.contains(document.activeElement)) return
        isFocusedRef.current = false
        unlockScroll()
        setKeyboardOffset(0)
      }, 60)
    }

    const root = rootRef.current
    root?.addEventListener('focusin', handleFocusIn)
    root?.addEventListener('focusout', handleFocusOut)
    vv?.addEventListener('resize', computeOverlap)
    vv?.addEventListener('scroll', computeOverlap)

    return () => {
      root?.removeEventListener('focusin', handleFocusIn)
      root?.removeEventListener('focusout', handleFocusOut)
      vv?.removeEventListener('resize', computeOverlap)
      vv?.removeEventListener('scroll', computeOverlap)
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
      // Restore the page if we unmount mid-focus (e.g. navigation).
      if (scrollLockYRef.current !== null) {
        const y = scrollLockYRef.current
        scrollLockYRef.current = null
        const body = document.body
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.width = ''
        window.scrollTo(0, y)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleAddAttachments = (names: string[]) =>
    setAttachments((prev) => Array.from(new Set([...prev, ...names])))
  const handleRemoveAttachment = (n: string) =>
    setAttachments((prev) => prev.filter((x) => x !== n))

  const resetAll = () => {
    setStage('prompt')
    setPrompt('')
    setSelectedTool(defaultTool)
    setAttachments([])
    setWantsPlan(false)
    setName('')
    setPhone('')
    setEmail('')
    setErrorMessage(null)
  }

  const handleBuildNow = () => {
    if (!prompt.trim()) {
      setShowHint(true)
      textareaRef.current?.focus()
      return
    }
    setShowHint(false)
    setErrorMessage(null)
    setStage('email')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBuildNow()
    }
  }

  // Back through the funnel, preserving already-typed values. email → prompt.
  const handleBack = () => {
    setErrorMessage(null)
    if (stage === 'email') setStage('prompt')
    else if (stage === 'phone') setStage('email')
    else if (stage === 'name') setStage('phone')
    else if (stage === 'error') setStage('name')
  }

  const submitRequest = async () => {
    setStage('processing')
    setProcessingStepIndex(0)
    setErrorMessage(null)

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const submitPromise = fetch('/api/automation-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        prompt,
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
      resetTimeoutRef.current = setTimeout(resetAll, SUCCESS_RESET_DELAY_MS)
    } catch (err) {
      setStage('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again later.',
      )
    }
  }

  // Order is email → phone → name → submit.
  const handleFunnelContinue = () => {
    if (stage === 'email') {
      if (!EMAIL_RE.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.')
        return
      }
      setErrorMessage(null)
      setStage('phone')
    } else if (stage === 'phone') {
      setErrorMessage(null)
      setStage('name')
    } else if (stage === 'name') {
      if (!name.trim()) {
        setErrorMessage('Please enter your name.')
        return
      }
      submitRequest()
    }
  }

  // Keeps the focused funnel input from blurring when a step button is tapped,
  // so the mobile keyboard never dismisses between steps.
  const keepFocus = (e: React.PointerEvent) => e.preventDefault()

  // ── Render ──────────────────────────────────────────────────────────────────
  const promptContent = (
    <>
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value)
          if (showHint) setShowHint(false)
        }}
        onKeyDown={handleKeyDown}
        placeholder="What do you want to automate?"
        className="w-full resize-none bg-transparent text-base md:text-[15px] text-white placeholder-[#5a5a5f] px-4 pt-3.5 pb-2 sm:px-5 sm:pt-5 sm:pb-3 focus:outline-none min-h-[52px] sm:min-h-[76px] max-h-[160px]"
        rows={1}
      />

      {showHint && (
        <p className="px-4 sm:px-5 pb-1 text-xs text-amber-400">
          Describe what you&apos;d like to automate first.
        </p>
      )}

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 sm:px-5 pb-2">
          {attachments.map((n) => (
            <span
              key={n}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#c0c0c5]"
            >
              <Paperclip className="size-3 shrink-0" />
              <span className="max-w-[140px] truncate">{n}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(n)}
                className="text-[#6a6a6f] hover:text-white"
                aria-label={`Remove ${n}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  )

  const buttonRow = (() => {
    if (stage === 'prompt') {
      return (
        <>
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? [])
                if (files.length) handleAddAttachments(files.map((f) => f.name))
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
            <ToolSelector selected={selectedTool} onSelect={setSelectedTool} />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setWantsPlan((p) => !p)}
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
        </>
      )
    }

    if (stage === 'email' || stage === 'phone' || stage === 'name') {
      return (
        <>
          <button
            type="button"
            onPointerDown={keepFocus}
            onClick={handleBack}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#6a6a6f] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
          <button
            type="button"
            onPointerDown={keepFocus}
            onClick={handleFunnelContinue}
            className="flex items-center gap-2 rounded-full bg-[#1488fc] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#1a94ff] active:scale-95"
          >
            {stage === 'name' ? 'Submit' : 'Continue'}
          </button>
        </>
      )
    }

    if (stage === 'error') {
      return (
        <div className="flex w-full items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#6a6a6f] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={submitRequest}
            className="flex items-center gap-2 rounded-full bg-[#1488fc] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#1a94ff] active:scale-95"
          >
            Try again
          </button>
        </div>
      )
    }

    return null // processing | success
  })()

  return (
    <div
      ref={rootRef}
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:px-4 transition-opacity duration-300 ${
        footerNear ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ transform: keyboardOffset ? `translateY(-${keyboardOffset}px)` : undefined }}
    >
      {/* Legibility gradient behind the bar, over page content. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-black/60 to-transparent" />

      <div className="relative w-full max-w-[680px]">
        <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-white/8 to-transparent pointer-events-none" />
        <div className="relative rounded-2xl bg-[#1e1e22] ring-1 ring-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_2px_20px_rgba(0,0,0,0.4)]">
          <div className="relative">
            {stage === 'prompt' ? (
              promptContent
            ) : (
              <RequestFunnel
                stage={stage as FunnelStage}
                name={name}
                phone={phone}
                email={email}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onEmailChange={setEmail}
                errorMessage={errorMessage}
                processingStepIndex={processingStepIndex}
                onContinue={handleFunnelContinue}
              />
            )}
          </div>
          {buttonRow && (
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1 sm:pb-3">
              {buttonRow}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function GlobalComposer() {
  const pathname = usePathname()
  if (!isComposerVisible(pathname)) return null
  return <Composer />
}
