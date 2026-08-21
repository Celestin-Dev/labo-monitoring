import { useCallback, useEffect, useState } from 'react'
import { devicesApi } from '../lib/api/devices'
import { normalizeStatus } from '../lib/status'
import { useRealtimeSubscription } from '../context/RealtimeContext'

export function useDevices(zoneId) {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await devicesApi.list(zoneId)
      setDevices(data)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [zoneId])

  useEffect(() => {
    load()
  }, [load])

  useRealtimeSubscription('/topic/devices', (device) => {
    if (zoneId && device.zoneId !== zoneId) return
    setDevices((prev) => {
      const exists = prev.some((d) => d.id === device.id)
      return exists ? prev.map((d) => (d.id === device.id ? device : d)) : [...prev, device]
    })
  })

  const normalized = devices.map((d) => ({ ...d, status: normalizeStatus(d.status) }))

  return { devices: normalized, loading, error, refresh: load }
}
