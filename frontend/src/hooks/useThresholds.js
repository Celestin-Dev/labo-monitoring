import { useCallback, useEffect, useState } from 'react'
import { thresholdsApi } from '../lib/api/thresholds'

export function useThresholds() {
  const [thresholds, setThresholds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await thresholdsApi.list()
      setThresholds(data)
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

  const save = useCallback(async (threshold) => {
    const updated = threshold.id
      ? await thresholdsApi.update(threshold.id, threshold)
      : await thresholdsApi.create(threshold)
    setThresholds((prev) => {
      const exists = prev.some((t) => t.id === updated.id)
      return exists ? prev.map((t) => (t.id === updated.id ? updated : t)) : [...prev, updated]
    })
    return updated
  }, [])

  return { thresholds, loading, error, refresh: load, save }
}