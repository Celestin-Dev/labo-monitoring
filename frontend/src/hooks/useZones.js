import { useCallback, useEffect, useState } from 'react'
import { zonesApi } from '../lib/api/zones'
import { normalizeStatus } from '../lib/status'
import { useRealtimeSubscription } from '../context/RealtimeContext'

/**
 * Charge les zones + la dernière mesure de chacune, puis les tient à jour
 * en temps réel via /topic/zones (changement de statut) et
 * /topic/measurements (nouvelles valeurs capteur).
 */
export function useZones() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const list = await zonesApi.list()
      const withMeasurements = await Promise.all(
        list.map(async (zone) => {
          const measurement = await zonesApi.latestMeasurement(zone.id)
          return {
            id: zone.id,
            name: zone.name,
            description: zone.description,
            status: normalizeStatus(zone.status),
            temperature: measurement?.temperature ?? null,
            humidity: measurement?.humidity ?? null,
            co: measurement?.coRaw ?? null,
            light: measurement?.luminosity ?? null,
          }
        }),
      )
      setZones(withMeasurements)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useRealtimeSubscription('/topic/zones', (zone) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zone.id ? { ...z, status: normalizeStatus(zone.status), name: zone.name, description: zone.description } : z)),
    )
  })

  useRealtimeSubscription('/topic/measurements', (measurement) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === measurement.zoneId
          ? { ...z, temperature: measurement.temperature, humidity: measurement.humidity, co: measurement.coRaw, light: measurement.luminosity }
          : z,
      ),
    )
  })

  return { zones, loading, error, refresh: load }
}
