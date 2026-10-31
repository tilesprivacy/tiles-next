import type { ReactNode } from 'react'

export function TilekitEndpoint({
  method,
  path,
  title,
  children,
}: {
  method: 'GET' | 'POST' | 'PUT'
  path: string
  title: string
  children: ReactNode
}) {
  return (
    <details className="tilekit-endpoint">
      <summary>
        <span className="tilekit-method" data-method={method}>{method}</span>
        <code>{path}</code>
        <span className="tilekit-endpoint-title">{title}</span>
        <span className="tilekit-endpoint-toggle" aria-hidden="true">+</span>
      </summary>
      {children}
    </details>
  )
}
