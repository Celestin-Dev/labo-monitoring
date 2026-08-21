import { useCallback, useEffect, useState } from 'react'
import { productsApi } from '../lib/api/products'

export function useProducts(zoneId) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await productsApi.list(zoneId)
      setProducts(data)
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

  return { products, loading, error, refresh: load }
}