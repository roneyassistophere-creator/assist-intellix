'use client'

import type { KeyboardEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

export type FunnelStage = 'name' | 'phone' | 'email' | 'processing' | 'success' | 'error'

export const PROCESSING_STEPS = [
  'Planning your automation',
  'Structuring the workflow',
  'Assigning an agent to contact you',
]

interface RequestFunnelProps {
  stage: FunnelStage
  name: string
  phone: string
  email: string
  onNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onEmailChange: (value: string) => void
  errorMessage: string | null
  processingStepIndex: number
  onContinue: () => void
}

// Pure step content — no recap header, no buttons. `ChatInput` owns the
// surrounding chrome (card shell, static button row) and the slide/resize
// animation this content mounts into.
export function RequestFunnel({
  stage,
  name,
  phone,
  email,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  errorMessage,
  processingStepIndex,
  onContinue,
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
      {isFieldStage && (
        <div className="px-5 pt-4 pb-2">
          <p className="text-[15px] text-white">
            {stage === 'email' && "You'll need your email to request the build."}
            {stage === 'phone' && "What's the best number to reach you?"}
            {stage === 'name' && "Last thing — what's your name?"}
          </p>
          <input
            autoFocus
            type={stage === 'email' ? 'email' : stage === 'phone' ? 'tel' : 'text'}
            value={stage === 'email' ? email : stage === 'phone' ? phone : name}
            onChange={(e) => {
              if (stage === 'email') onEmailChange(e.target.value)
              else if (stage === 'phone') onPhoneChange(e.target.value)
              else onNameChange(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              stage === 'email'
                ? 'you@example.com'
                : stage === 'phone'
                  ? 'Phone number (optional)'
                  : 'Your name'
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
              <span
                className={`text-sm ${i <= processingStepIndex ? 'text-white' : 'text-[#5a5a5f]'}`}
              >
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
    </div>
  )
}
