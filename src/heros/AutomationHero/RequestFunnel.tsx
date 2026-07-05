'use client'

import type { KeyboardEvent } from 'react'
import { ArrowLeft, CheckCircle2, Lightbulb, Loader2, Paperclip } from 'lucide-react'

export type FunnelStage = 'name' | 'phone' | 'email' | 'processing' | 'success' | 'error'

export const PROCESSING_STEPS = [
  'Planning your automation',
  'Structuring the workflow',
  'Assigning an agent to contact you',
]

interface RequestFunnelProps {
  stage: FunnelStage
  promptPreview: string
  toolLabel: string
  attachments: string[]
  wantsPlan: boolean
  name: string
  phone: string
  email: string
  onNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onEmailChange: (value: string) => void
  errorMessage: string | null
  processingStepIndex: number
  onContinue: () => void
  onBack: () => void
  onRetry: () => void
}

export function RequestFunnel({
  stage,
  promptPreview,
  toolLabel,
  attachments,
  wantsPlan,
  name,
  phone,
  email,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  errorMessage,
  processingStepIndex,
  onContinue,
  onBack,
  onRetry,
}: RequestFunnelProps) {
  const isFieldStage = stage === 'name' || stage === 'phone' || stage === 'email'

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onContinue()
    }
  }

  return (
    <div className="flex flex-col">
      {/* Keeps the original prompt visible, like a message already sent in the chat. */}
      <div className="border-b border-white/5 px-5 pt-4 pb-3">
        <p className="text-[10px] font-medium tracking-wide text-[#5a5a5f] uppercase">{toolLabel}</p>
        <p className="mt-1 line-clamp-2 text-sm text-[#8a8a8f]">{promptPreview}</p>
        {(attachments.length > 0 || wantsPlan) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {wantsPlan && (
              <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[11px] text-blue-300">
                <Lightbulb className="size-3" />
                Plan requested
              </span>
            )}
            {attachments.map((a) => (
              <span
                key={a}
                className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-[#c0c0c5]"
              >
                <Paperclip className="size-3" />
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {isFieldStage && (
        <div className="px-5 pt-4 pb-2">
          <p className="text-[15px] text-white">
            {stage === 'name' && "Great — what's your name?"}
            {stage === 'phone' &&
              `Thanks${name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}! What's the best number to reach you?`}
            {stage === 'email' && "Last thing — what's your email address?"}
          </p>
          <input
            autoFocus
            type={stage === 'email' ? 'email' : stage === 'phone' ? 'tel' : 'text'}
            value={stage === 'name' ? name : stage === 'phone' ? phone : email}
            onChange={(e) => {
              if (stage === 'name') onNameChange(e.target.value)
              else if (stage === 'phone') onPhoneChange(e.target.value)
              else onEmailChange(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              stage === 'name'
                ? 'Your name'
                : stage === 'phone'
                  ? 'Phone number (optional)'
                  : 'you@example.com'
            }
            className="mt-3 w-full border-b border-white/10 bg-transparent pb-2 text-[15px] text-white placeholder-[#5a5a5f] focus:border-blue-400 focus:outline-none"
          />
          {errorMessage && <p className="mt-2 text-xs text-red-400">{errorMessage}</p>}
        </div>
      )}

      {stage === 'processing' && (
        <div className="flex flex-col gap-3 px-5 py-6">
          {PROCESSING_STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              {i < processingStepIndex ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              ) : i === processingStepIndex ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-blue-400" />
              ) : (
                <div className="size-4 shrink-0 rounded-full border border-white/15" />
              )}
              <span className={`text-sm ${i <= processingStepIndex ? 'text-white' : 'text-[#5a5a5f]'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {stage === 'success' && (
        <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
          <CheckCircle2 className="size-10 text-emerald-400" />
          <p className="font-semibold text-white">Automation request submitted!</p>
          <p className="text-sm text-[#8a8a8f]">Someone will contact you ASAP.</p>
        </div>
      )}

      {stage === 'error' && (
        <div className="flex flex-col items-center gap-2 px-5 py-6 text-center">
          <p className="text-sm text-red-400">
            {errorMessage || 'Something went wrong. Please try again.'}
          </p>
        </div>
      )}

      {isFieldStage && (
        <div className="flex items-center justify-between px-3 pt-1 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#6a6a6f] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-2 rounded-full bg-[#1488fc] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#1a94ff] active:scale-95"
          >
            {stage === 'email' ? 'Submit' : 'Continue'}
          </button>
        </div>
      )}

      {stage === 'error' && (
        <div className="flex items-center justify-center gap-2 px-3 pt-1 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#6a6a6f] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 rounded-full bg-[#1488fc] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#1a94ff] active:scale-95"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
