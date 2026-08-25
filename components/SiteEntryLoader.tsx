'use client'

import { useEffect, useState } from 'react'
import { CoreSpinLoader } from '@/components/ui/core-spin-loader'

const MIN_DISPLAY_MS = 1500
const FADE_OUT_MS = 400

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

    // The page is interactive once the DOM is parsed (readyState 'interactive').
    // Waiting for 'complete' delays until every image/font/stylesheet finishes,
    // which makes the entry loader feel stuck. Exit as soon as the user can
    // actually interact with the page.
    if (document.readyState !== 'loading') {
      beginExit()
    } else {
      document.addEventListener('DOMContentLoaded', beginExit, { once: true })
    }

    // Never leave the overlay mounted if hydration or load handlers fail.
    const forceHide = window.setTimeout(() => setPhase('hidden'), 3000)

    return () => {
      document.removeEventListener('DOMContentLoaded', beginExit)
      window.clearTimeout(forceHide)
    }
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
