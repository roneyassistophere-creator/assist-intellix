'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// `ssr: false` is only allowed inside a Client Component, so this thin
// wrapper exists purely to let the Server Component homepage defer the
// orbital timeline's JS (timers, IntersectionObserver, custom keyframes)
// off the critical path — it's below the fold, not needed for first paint.
// The loading skeleton matches the orbital's own min-height so there's no
// layout shift when it swaps in.
export const LazyProcessTimeline = dynamic(
  () => import('./index').then((mod) => mod.ProcessTimeline),
  {
    ssr: false,
    loading: () => <div className="min-h-[620px] w-full bg-black sm:min-h-[720px]" />,
  },
)
