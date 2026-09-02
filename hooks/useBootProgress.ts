'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { animate, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'

const MILESTONES = {
  mount: { target: 0, log: 'MOUNT /boot ... OK' },
  dom: { target: 25, log: 'DOMContentLoaded ... OK' },
  fonts: { target: 60, log: 'FONTS READY ... OK' },
  load: { target: 90, log: 'LOAD COMPLETE ... OK' },
  ready: { target: 100, log: 'READY' },
} as const

type MilestoneKey = keyof typeof MILESTONES

export function useBootProgress(minDisplayMs: number) {
  const progress = useMotionValue(0)
  const [percent, setPercent] = useState(0)
  const [reached, setReached] = useState<Set<MilestoneKey>>(new Set(['mount']))
  const [logs, setLogs] = useState<string[]>([MILESTONES.mount.log])
  const [minDisplayDone, setMinDisplayDone] = useState(false)
  const completeRef = useRef(false)

  useMotionValueEvent(progress, 'change', (latest) => {
    setPercent(Math.round(latest))
  })

  const progressText = useTransform(progress, (latest) =>
    String(Math.round(latest)).padStart(3, '0')
  )

  const reach = useCallback(
    (key: MilestoneKey) => {
      setReached((prev) => {
        if (prev.has(key)) return prev
        const next = new Set(prev)
        next.add(key)
        const target = MILESTONES[key].target
        const current = progress.get()
        if (target > current) {
          animate(progress, target, { duration: 0.45, ease: 'easeOut' })
        }
        setLogs((logsPrev) =>
          logsPrev.includes(MILESTONES[key].log) ? logsPrev : [...logsPrev, MILESTONES[key].log]
        )
        return next
      })
    },
    [progress]
  )

  const markComplete = useCallback(() => {
    if (completeRef.current) return
    completeRef.current = true
    reach('ready')
  }, [reach])

  // After hydration, apply milestones that already fired before the component mounted.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (typeof document === 'undefined') return
      if (document.readyState !== 'loading') reach('dom')
      if (document.readyState === 'complete') reach('load')
    })
    return () => cancelAnimationFrame(raf)
  }, [reach])

  // DOMContentLoaded listener (only if it has not already fired).
  useEffect(() => {
    if (document.readyState !== 'loading') return
    const handler = () => reach('dom')
    document.addEventListener('DOMContentLoaded', handler, { once: true })
    return () => document.removeEventListener('DOMContentLoaded', handler)
  }, [reach])

  // document.fonts.ready promise.
  useEffect(() => {
    let cancelled = false
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) reach('fonts')
      })
    }
    return () => {
      cancelled = true
    }
  }, [reach])

  // window load listener (only if it has not already fired).
  useEffect(() => {
    if (document.readyState === 'complete') return
    const handler = () => reach('load')
    window.addEventListener('load', handler, { once: true })
    return () => window.removeEventListener('load', handler)
  }, [reach])

  useEffect(() => {
    const timer = window.setTimeout(() => setMinDisplayDone(true), minDisplayMs)
    return () => window.clearTimeout(timer)
  }, [minDisplayMs])

  // Exit is gated by the first-paint-critical milestone only; fonts and load
  // are tracked for progress but must not delay the reveal past the budget.
  const isReady = useMemo(
    () => reached.has('dom') && minDisplayDone,
    [reached, minDisplayDone]
  )

  return { progress, percent, progressText, logs, isReady, markComplete }
}
