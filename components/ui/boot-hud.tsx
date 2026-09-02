'use client'

type BootHudProps = {
  logs: string[]
  percent: number
}

export function BootHud({ logs, percent }: BootHudProps) {
  const visibleLogs = logs.slice(-4)

  return (
    <div className="boot-hud" aria-hidden="true">
      <span className="boot-bracket boot-bracket--tl">┌</span>
      <span className="boot-bracket boot-bracket--tr">┐</span>
      <span className="boot-bracket boot-bracket--bl">└</span>
      <span className="boot-bracket boot-bracket--br">┘</span>

      <div className="boot-logs">
        {visibleLogs.map((line) => (
          <span key={line} className="boot-log-line">
            {line}
          </span>
        ))}
      </div>

      <div className="boot-percent">
        <span className="boot-percent-value">{String(percent).padStart(3, '0')}</span>
        <span className="boot-percent-unit">%</span>
      </div>
    </div>
  )
}
