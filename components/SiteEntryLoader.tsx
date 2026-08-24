'use client'

import { useEffect, useState } from 'react'
import { CoreSpinLoader } from '@/components/ui/core-spin-loader'

const MIN_DISPLAY_MS = 1400
const FADE_OUT_MS = 500

type LoaderPhase = 'visible' | 'exiting' | 'hidden'

export function SiteEntryLoader() {
  const [phase, setPhase] = useState<LoaderPhase>('visible')

  useEffect(() => {
    const startedAt = Date.now()

    const beginExit = () => {
      const elapsed = Date.now() - startedAt
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed)
      window.setTimeout(() => setPhase('exiting'), delay)
    }

    if (document.readyState === 'complete') {
      beginExit()
      return
    }

    window.addEventListener('load', beginExit, { once: true })
    return () => window.removeEventListener('load', beginExit)
  }, [])

  useEffect(() => {
    if (phase !== 'exiting') {
      return
    }

    const timer = window.setTimeout(() => setPhase('hidden'), FADE_OUT_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'hidden') {
    return null
  }

  return (
    <div
      className={`site-entry-loader ${phase === 'exiting' ? 'site-entry-loader--exiting' : ''}`}
      aria-busy={phase === 'visible'}
      aria-live="polite"
      aria-label="Loading site"
    >
      <CoreSpinLoader />
    </div>
  )
}
