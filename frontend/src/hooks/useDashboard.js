import { useCallback, useEffect, useState } from 'react'
import { dashboardApi } from '../lib/api/dashboard'
import { normalizeStatus } from '../lib/status'
import { useRealtimeSubscription } from '../context/RealtimeContext'

const POLL_INTERVAL_MS = 20000

export function useDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      const overview = await dashboardApi.overview()
      setData(overview)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    // Filet de sécurité : les stats agrégées (moyennes) sont recalculées côté
    // backend à la demande, donc on les rafraîchit périodiquement en plus du temps réel.
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [load])

  // Nouvelle alerte -> l'ajoute en tête de la liste "alertes récentes"
  useRealtimeSubscription('/topic/alerts', (alert) => {
    setData((prev) => {
      if (!prev) return prev
      const withoutDuplicate = prev.recentAlerts.filter((a) => a.id !== alert.id)
      return { ...prev, recentAlerts: [alert, ...withoutDuplicate].slice(0, 4) }
    })
  })

  // Changement de statut de zone -> reflété immédiatement dans la liste des zones
  useRealtimeSubscription('/topic/zones', (zone) => {
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        zones: prev.zones.map((z) => (z.id === zone.id ? { ...z, status: zone.status } : z)),
      }
    })
  })

  const zones = (data?.zones ?? []).map((z) => ({ ...z, status: normalizeStatus(z.status) }))

  return {
    globalStats: data?.globalStats ?? null,
    zones,
    recentAlerts: data?.recentAlerts ?? [],
    systemStatus: data?.systemStatus ?? 'OFFLINE',
    loading,
    error,
    refresh: load,
  }
}