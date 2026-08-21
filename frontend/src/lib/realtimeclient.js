import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'

/**
 * Fine couche autour du client STOMP :
 *  - une seule connexion partagée pour toute l'application
 *  - reconnexion automatique
 *  - API simple : subscribe(topic, callback) -> fonction de désabonnement
 */
class RealtimeClient {
  constructor() {
    this.client = null
    this.connected = false
    this.statusListeners = new Set()
    this.pendingSubscriptions = new Map() // topic -> Set<callback>
    this.activeSubscriptions = new Map() // topic -> stompSubscription
  }

  connect() {
    if (this.client) return

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.connected = true
        this._notifyStatus()
        // Réabonne tous les topics demandés avant/pendant la déconnexion
        for (const topic of this.pendingSubscriptions.keys()) {
          this._subscribeTopic(topic)
        }
      },
      onDisconnect: () => {
        this.connected = false
        this._notifyStatus()
      },
      onWebSocketClose: () => {
        this.connected = false
        this._notifyStatus()
      },
      onStompError: () => {
        this.connected = false
        this._notifyStatus()
      },
    })

    this.client.activate()
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback)
    callback(this.connected)
    return () => this.statusListeners.delete(callback)
  }

  _notifyStatus() {
    this.statusListeners.forEach((cb) => cb(this.connected))
  }

  _subscribeTopic(topic) {
    if (!this.client?.connected) return
    if (this.activeSubscriptions.has(topic)) return

    const sub = this.client.subscribe(topic, (message) => {
      let payload = message.body
      try {
        payload = JSON.parse(message.body)
      } catch {
        // payload non-JSON, on le laisse tel quel
      }
      const callbacks = this.pendingSubscriptions.get(topic)
      callbacks?.forEach((cb) => cb(payload))
    })
    this.activeSubscriptions.set(topic, sub)
  }

  subscribe(topic, callback) {
    if (!this.pendingSubscriptions.has(topic)) {
      this.pendingSubscriptions.set(topic, new Set())
    }
    this.pendingSubscriptions.get(topic).add(callback)

    if (this.client?.connected) {
      this._subscribeTopic(topic)
    }

    return () => {
      const callbacks = this.pendingSubscriptions.get(topic)
      callbacks?.delete(callback)
      if (callbacks && callbacks.size === 0) {
        this.pendingSubscriptions.delete(topic)
        this.activeSubscriptions.get(topic)?.unsubscribe()
        this.activeSubscriptions.delete(topic)
      }
    }
  }
}

export const realtimeClient = new RealtimeClient()