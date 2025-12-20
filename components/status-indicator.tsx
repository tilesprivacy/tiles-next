'use client'

import { useEffect, useMemo, useState } from 'react'

type Indicator = 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage'

interface StatusResponse {
  status: {
    indicator: Indicator
    description: string
  }
}

const STATUS_COLORS: Record<Indicator | 'loading', string> = {
  operational: '#20CE68',
  degraded_performance: '#F4C414',
  partial_outage: '#FF8F1F',
  major_outage: '#FF4D4F',
  loading: '#9CA3AF',
}

const STATUS_LABELS: Record<Indicator, string> = {
  operational: 'Tiles status: operational',
  degraded_performance: 'Tiles status: degraded performance',
  partial_outage: 'Tiles status: partial outage',
  major_outage: 'Tiles status: major outage',
}

export function StatusIndicator() {
  const [status, setStatus] = useState<Indicator | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://status.tiles.run/api/v2/status.json')
        const data: StatusResponse = await response.json()
        setStatus(data.status.indicator)
      } catch (error) {
        console.error('Failed to fetch status:', error)
        setStatus('operational')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const color = useMemo(() => {
    if (loading || !status) return STATUS_COLORS.loading
    return STATUS_COLORS[status]
  }, [loading, status])

  const label = useMemo(() => {
    if (loading || !status) return 'Checking Tiles status'
    return STATUS_LABELS[status]
  }, [loading, status])

  return (
    <div className="relative flex h-8 w-8 items-center justify-center" role="status" aria-label={label} aria-live="polite">
      <span
        className="absolute inline-flex h-4 w-4 animate-ping rounded-full opacity-50"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
