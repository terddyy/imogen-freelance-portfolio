'use client'

import { useEffect, useRef, useState } from 'react'
import * as motion from 'motion/react-client'
import { BootCore } from '@/components/ui/boot-core'
import { BootHud } from '@/components/ui/boot-hud'
import { BootReduced } from '@/components/ui/boot-reduced'
import { useBootProgress } from '@/hooks/useBootProgress'

const MIN_DISPLAY_MS = 1400
const EXIT_DURATION_MS = 400
const FORCE_EXIT_START_MS = 2600
const FORCE_HIDDEN_MS = 3000

type LoaderPhase = 'visible' | 'exiting' | 'hidden'

export function SiteEntryLoader() {
  const [phase, setPhase] = useState<LoaderPhase>('visible')
  const [canvasFailed, setCanvasFailed] = useState(false)
  const phaseRef = useRef<LoaderPhase>('visible')
  const { percent, logs, isReady, markComplete } = useBootProgress(MIN_DISPLAY_MS)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    if (phaseRef.current === 'visible' && isReady) {
      markComplete()
      setPhase('exiting')
    }
  }, [isReady, markComplete])

  useEffect(() => {
    const forceExit = window.setTimeout(() => {
      if (phaseRef.current === 'visible') {
        markComplete()
        setPhase('exiting')
      }
    }, FORCE_EXIT_START_MS)

    const forceHide = window.setTimeout(() => {
      setPhase('hidden')
    }, FORCE_HIDDEN_MS)

    return () => {
      window.clearTimeout(forceExit)
      window.clearTimeout(forceHide)
    }
  }, [markComplete])

  useEffect(() => {
    if (phase !== 'exiting') return
    const timer = window.setTimeout(() => setPhase('hidden'), EXIT_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'hidden') return null

  const isExiting = phase === 'exiting'

  return (
    <div
      className="site-entry-loader"
      aria-busy={!isExiting}
      aria-hidden={isExiting}
      aria-live="polite"
      aria-label="Loading site"
    >
      <div
        className="boot-stage"
        style={{ display: canvasFailed ? 'none' : undefined }}
      >
        <motion.div
          className="boot-content"
          initial={false}
          animate={
            isExiting
              ? { opacity: 0, scale: 0.96 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <BootCore isExiting={isExiting} onCanvasFail={() => setCanvasFailed(true)} />
          <BootHud logs={logs} percent={percent} />
        </motion.div>

        <motion.div
          className="boot-panel boot-panel-top"
          initial={false}
          animate={isExiting ? { y: '-100%' } : { y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="boot-panel boot-panel-bottom"
          initial={false}
          animate={isExiting ? { y: '100%' } : { y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="boot-flash"
          initial={false}
          animate={isExiting ? { opacity: [0, 0.25, 0] } : { opacity: 0 }}
          transition={{ duration: 0.3, times: [0, 0.5, 1], ease: 'easeOut' }}
        />
      </div>

      <div
        className="boot-stage-reduced"
        style={{ display: canvasFailed ? 'flex' : undefined }}
      >
        <motion.div
          className="boot-reduced-wrapper"
          initial={false}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <BootReduced logs={logs} percent={percent} />
        </motion.div>
      </div>
    </div>
  )
}
