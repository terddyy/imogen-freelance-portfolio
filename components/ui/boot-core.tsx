'use client'

import { useEffect, useRef, useState } from 'react'

const PHI = (1 + Math.sqrt(5)) / 2

const ICOSA_RAW = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
]

const OCTA_RAW = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
]

function normalize([x, y, z]: readonly number[]) {
  const r = Math.hypot(x, y, z) || 1
  return [x / r, y / r, z / r]
}

function buildEdges(vertices: readonly number[][], threshold: number) {
  const edges: [number, number][] = []
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dx = vertices[i][0] - vertices[j][0]
      const dy = vertices[i][1] - vertices[j][1]
      const dz = vertices[i][2] - vertices[j][2]
      const d = Math.hypot(dx, dy, dz)
      if (d > 0.1 && d < threshold) {
        edges.push([i, j])
      }
    }
  }
  return edges
}

const ICOSA_VERTICES = ICOSA_RAW.map(normalize)
const ICOSA_EDGES = buildEdges(ICOSA_VERTICES, 1.35)
const OCTA_VERTICES = OCTA_RAW.map(normalize)
const OCTA_EDGES = buildEdges(OCTA_VERTICES, 1.55)

function rotationMatrix(angleX: number, angleY: number) {
  const cx = Math.cos(angleX)
  const sx = Math.sin(angleX)
  const cy = Math.cos(angleY)
  const sy = Math.sin(angleY)

  const rx = [
    [1, 0, 0],
    [0, cx, -sx],
    [0, sx, cx],
  ]
  const ry = [
    [cy, 0, sy],
    [0, 1, 0],
    [-sy, 0, cy],
  ]

  return [
    [
      rx[0][0] * ry[0][0] + rx[0][1] * ry[1][0] + rx[0][2] * ry[2][0],
      rx[0][0] * ry[0][1] + rx[0][1] * ry[1][1] + rx[0][2] * ry[2][1],
      rx[0][0] * ry[0][2] + rx[0][1] * ry[1][2] + rx[0][2] * ry[2][2],
    ],
    [
      rx[1][0] * ry[0][0] + rx[1][1] * ry[1][0] + rx[1][2] * ry[2][0],
      rx[1][0] * ry[0][1] + rx[1][1] * ry[1][1] + rx[1][2] * ry[2][1],
      rx[1][0] * ry[0][2] + rx[1][1] * ry[1][2] + rx[1][2] * ry[2][2],
    ],
    [
      rx[2][0] * ry[0][0] + rx[2][1] * ry[1][0] + rx[2][2] * ry[2][0],
      rx[2][0] * ry[0][1] + rx[2][1] * ry[1][1] + rx[2][2] * ry[2][1],
      rx[2][0] * ry[0][2] + rx[2][1] * ry[1][2] + rx[2][2] * ry[2][2],
    ],
  ]
}

function project(
  vertex: readonly number[],
  matrix: number[][],
  focal: number,
  distance: number
) {
  const x =
    vertex[0] * matrix[0][0] + vertex[1] * matrix[0][1] + vertex[2] * matrix[0][2]
  const y =
    vertex[0] * matrix[1][0] + vertex[1] * matrix[1][1] + vertex[2] * matrix[1][2]
  const z =
    vertex[0] * matrix[2][0] + vertex[1] * matrix[2][1] + vertex[2] * matrix[2][2]
  const scale = focal / (focal + z + distance)
  return { x: x * scale, y: y * scale, z }
}

function getCssColor(name: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    }
  }
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function isColorDark(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

type BootCoreProps = {
  isExiting?: boolean
  onCanvasFail?: () => void
}

export function BootCore({ isExiting = false, onCanvasFail }: BootCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const isExitingRef = useRef(isExiting)
  const snapRef = useRef(false)
  const exitSpeedRef = useRef(1)
  const rotationRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    isExitingRef.current = isExiting
    if (isExiting) {
      exitSpeedRef.current = 2.8
      const timer = window.setTimeout(() => {
        snapRef.current = true
      }, 220)
      return () => window.clearTimeout(timer)
    }
    exitSpeedRef.current = 1
    snapRef.current = false
  }, [isExiting])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleReducedChange = (event: MediaQueryListEvent) => {
      setFailed(event.matches)
    }
    query.addEventListener('change', handleReducedChange)
    return () => query.removeEventListener('change', handleReducedChange)
  }, [])

  useEffect(() => {
    if (failed) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      const raf = requestAnimationFrame(() => {
        setFailed(true)
        onCanvasFail?.()
      })
      return () => cancelAnimationFrame(raf)
    }

    let raf = 0
    let running = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const cssWidth = rect.width
      const cssHeight = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      canvas.width = Math.max(1, Math.floor(cssWidth * dpr))
      canvas.height = Math.max(1, Math.floor(cssHeight * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        running = false
        if (raf) cancelAnimationFrame(raf)
      } else {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const cssWidth = rect.width
      const cssHeight = rect.height
      const cx = cssWidth / 2
      const cy = cssHeight / 2
      const baseScale = Math.min(cssWidth, cssHeight) * 0.38
      const accentColor = getCssColor('--green', '#ffb200')
      const coreColor = getCssColor('--cyan', '#0090ff')
      const dark = isColorDark(accentColor)
      const vertexRadius = 2.25

      ctx.clearRect(0, 0, cssWidth, cssHeight)

      // Outer icosahedron
      const matrix = rotationMatrix(rotationRef.current.x, rotationRef.current.y)
      const projected = ICOSA_VERTICES.map((v) => project(v, matrix, 600, 3.2))

      ctx.lineWidth = 1
      ctx.strokeStyle = accentColor
      ctx.globalAlpha = 0.38
      ctx.beginPath()
      for (const [a, b] of ICOSA_EDGES) {
        ctx.moveTo(cx + projected[a].x * baseScale, cy + projected[a].y * baseScale)
        ctx.lineTo(cx + projected[b].x * baseScale, cy + projected[b].y * baseScale)
      }
      ctx.stroke()

      // Inner counter-rotating core
      const innerMatrix = rotationMatrix(-rotationRef.current.x * 1.4, -rotationRef.current.y * 1.2)
      const innerScale = baseScale * 0.42
      const innerProjected = OCTA_VERTICES.map((v) => project(v, innerMatrix, 500, 2.4))

      ctx.strokeStyle = coreColor
      ctx.globalAlpha = 0.25
      ctx.beginPath()
      for (const [a, b] of OCTA_EDGES) {
        ctx.moveTo(cx + innerProjected[a].x * innerScale, cy + innerProjected[a].y * innerScale)
        ctx.lineTo(cx + innerProjected[b].x * innerScale, cy + innerProjected[b].y * innerScale)
      }
      ctx.stroke()

      // Vertices with glow
      ctx.globalAlpha = 1
      ctx.fillStyle = accentColor
      ctx.shadowColor = dark ? accentColor : accentColor
      ctx.shadowBlur = 8
      for (const p of projected) {
        ctx.beginPath()
        ctx.arc(cx + p.x * baseScale, cy + p.y * baseScale, vertexRadius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    const loop = () => {
      if (!running || document.hidden) return

      if (!snapRef.current) {
        rotationRef.current.x += 0.0042 * exitSpeedRef.current
        rotationRef.current.y += 0.0065 * exitSpeedRef.current
      } else {
        // Ease toward a front-facing lock-in orientation.
        const targetX = 0.18
        const targetY = 0.32
        rotationRef.current.x += (targetX - rotationRef.current.x) * 0.18
        rotationRef.current.y += (targetY - rotationRef.current.y) * 0.18
      }

      draw()
      raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)
    raf = requestAnimationFrame(loop)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [failed, onCanvasFail])

  if (failed) return null

  return <canvas ref={canvasRef} className="boot-core" width={280} height={280} aria-hidden="true" />
}
