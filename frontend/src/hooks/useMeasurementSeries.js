import { useCallback, useEffect, useState } from 'react'
import { measurementsApi } from '../lib/api/measurements'
import { toChartSeries, toChartPoint } from '../lib/mappers'
import { useRealtimeSubscription } from '../context/RealtimeContext'

/**
 * Série temporelle pour les graphiques Monitoring / Historique / Dashboard.
 * zoneId: undefined => toutes zones confondues. period: '1h' | '24h' | '7d' | '30d'.
 */
export function useMeasurementSeries({ zoneId, period = '24h', maxPoints = 200 } = {}) {
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await measurementsApi.series({ zoneId, period })
      setSeries(toChartSeries(data))
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [zoneId, period])

  useEffect(() => {
    load()
  }, [load])

  useRealtimeSubscription(
    '/topic/measurements',
    (measurement) => {
      if (zoneId && measurement.zoneId !== zoneId) return
      setSeries((prev) => [...prev, toChartPoint(measurement)].slice(-maxPoints))
    },
    [zoneId],
  )

  return { series, loading, error, refresh: load }
}
