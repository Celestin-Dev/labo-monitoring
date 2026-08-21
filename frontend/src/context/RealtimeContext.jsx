import { createContext, useContext, useEffect, useState } from 'react'
import { realtimeClient } from '../lib/realtimeClient'

const RealtimeContext = createContext({ connected: false })

export function RealtimeProvider({ children }) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    realtimeClient.connect()
    const unsubscribe = realtimeClient.onStatusChange(setConnected)
    return unsubscribe
  }, [])

  return (
    <RealtimeContext.Provider value={{ connected }}>
      {children}
    </RealtimeContext.Provider>
  )
}

/** Statut global de la connexion temps réel (utilisé par le Topbar). */
export function useRealtimeStatus() {
  return useContext(RealtimeContext)
}

/**
 * S'abonne à un topic STOMP tant que le composant est monté.
 * `callback` doit être stable (useCallback) ou défini inline sans dépendances
 * changeantes pour éviter les re-abonnements inutiles.
 */
export function useRealtimeSubscription(topic, callback, deps = []) {
  useEffect(() => {
    if (!topic) return undefined
    const unsubscribe = realtimeClient.subscribe(topic, callback)
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, ...deps])
}
