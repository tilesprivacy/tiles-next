'use client'

import { useEffect, useState } from 'react'

interface StatusResponse {
  status: {
    indicator: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage'
    description: string
  }
}

export function StatusIndicator() {
  const [status, setStatus] = useState<'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://status.tiles.run/api/v2/status.json')
        const data: StatusResponse = await response.json()
        setStatus(data.status.indicator)
      } catch (error) {
        console.error('Failed to fetch status:', error)
        setStatus('operational') // Default to operational on error
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // Refresh every 60 seconds
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const getColor = () => {
    if (loading) return 'bg-gray-400'
    switch (status) {
      case 'operational':
        return 'bg-green-500'
      case 'degraded_performance':
        return 'bg-yellow-500'
      case 'partial_outage':
        return 'bg-orange-500'
      case 'major_outage':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  return <div className={`h-2 w-2 rounded-full ${getColor()}`} />
}
