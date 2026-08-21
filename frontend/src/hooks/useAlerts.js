import { useCallback, useEffect, useState } from 'react'
import { alertsApi } from '../lib/api/alerts'
import { useRealtimeSubscription } from '../context/RealtimeContext'

export function useAlerts(filters = {}) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filters)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await alertsApi.search(filters)
      setAlerts(data)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  useEffect(() => {
    load()
  }, [load])

  // Nouvelle alerte, ou mise à jour (acquittement/résolution) -> merge dans la liste courante
  useRealtimeSubscription('/topic/alerts', (alert) => {
    setAlerts((prev) => {
      const exists = prev.some((a) => a.id === alert.id)
      if (exists) {
        return prev.map((a) => (a.id === alert.id ? alert : a))
      }
      return [alert, ...prev]
    })
  })

  const acknowledge = useCallback(async (id) => {
    const updated = await alertsApi.acknowledge(id)
    setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)))
    return updated
  }, [])

  const resolve = useCallback(async (id) => {
    const updated = await alertsApi.resolve(id)
    setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)))
    return updated
  }, [])

  return { alerts, loading, error, refresh: load, acknowledge, resolve }
}
