'use client'

import { useEffect, useMemo, useState } from 'react'

type Indicator = 'none' | 'minor' | 'major' | 'critical' | 'maintenance'

interface StatusResponse {
  status: {
    indicator: string
    description: string
  }
}

const STATUS_COLORS: Record<Indicator | 'loading', string> = {
  none: '#2ccf7f',
  minor: '#f4c414',
  major: '#ff8f1f',
  critical: '#ff4d4f',
  maintenance: '#3b82f6',
  loading: '#9CA3AF',
}

const STATUS_LABELS: Record<Indicator, string> = {
  none: 'Tiles status: operational',
  minor: 'Tiles status: minor issue',
  major: 'Tiles status: major issue',
  critical: 'Tiles status: critical outage',
  maintenance: 'Tiles status: under maintenance',
}

const isKnownIndicator = (value: string): value is Indicator => value in STATUS_LABELS

export function StatusIndicator() {
  const [status, setStatus] = useState<Indicator | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://status.tiles.run/api/v2/status.json')
        const data: StatusResponse = await response.json()
        if (isKnownIndicator(data.status.indicator)) {
          setStatus(data.status.indicator)
        } else {
          setStatus(null)
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
        setStatus(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const color = useMemo(() => {
    if (status) return STATUS_COLORS[status]
    return STATUS_COLORS.none
  }, [status])

  const label = useMemo(() => {
    if (status) return STATUS_LABELS[status]
    if (loading) return 'Checking Tiles status'
    return STATUS_LABELS.none
  }, [loading, status])

  return (
    <a
      href="https://status.tiles.run"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-8 w-8 items-center justify-center"
      aria-label={`${label}. View full status page`}
      role="status"
      aria-live="polite"
    >
      <span
        className="absolute inline-flex h-4 w-4 animate-ping rounded-full opacity-50 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.08)] transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: color }}
      />
    </a>
  )
}
