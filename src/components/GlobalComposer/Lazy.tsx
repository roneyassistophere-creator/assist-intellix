'use client'

import dynamic from 'next/dynamic'

// `ssr: false` is only allowed inside a Client Component, so this thin
// wrapper exists purely to let the Server Component root layout defer the
// composer's JS off the critical path.
export const LazyGlobalComposer = dynamic(
  () => import('./index').then((mod) => mod.GlobalComposer),
  { ssr: false },
)
