'use client'

type BootReducedProps = {
  logs: string[]
  percent: number
}

export function BootReduced({ logs, percent }: BootReducedProps) {
  const lastLog = logs[logs.length - 1] ?? 'Loading'

  return (
    <div className="boot-reduced">
      <div className="boot-reduced-brand">IMOGEN INOCENTES.</div>

      <div className="boot-reduced-track" aria-hidden="true">
        <div
          className="boot-reduced-fill"
          style={{ width: `${percent}%`, transition: 'width 400ms ease-out' }}
        />
      </div>

      <div className="boot-reduced-meta">
        <span className="boot-reduced-log">{lastLog}</span>
        <span className="boot-reduced-percent">{String(percent).padStart(3, '0')}%</span>
      </div>
    </div>
  )
}
