import { Info } from 'lucide-react'
import { LoadingState, ErrorState, EmptyState } from '../components/AsyncState'
import { useAlerts } from '../hooks/useAlerts'
import { useZones } from '../hooks/useZones'
import { useDevices } from '../hooks/useDevices'
import { normalizeStatus } from '../lib/status'
import { formatDateTime } from '../lib/mappers'

const typeStyles = {
  critical: 'bg-status-critical/10 text-status-critical',
  warning: 'bg-status-warning/10 text-status-warning',
  normal: 'bg-status-normal/10 text-status-normal',
  offline: 'bg-status-offline/10 text-status-offline',
}

const typeLabelFr = {
  TEMPERATURE: 'Température', HUMIDITY: 'Humidité', CO: 'CO', LUMINOSITY: 'Luminosité',
  MOTION: 'Mouvement', FIRE: 'Feu', PRODUCT_THRESHOLD: 'Produit', DEVICE_OFFLINE: 'Appareil',
}

/**
 * Le backend n'expose pas encore d'API dédiée "Événements" (journal d'accès,
 * maintenance, etc.). En attendant, cette page reconstitue un journal
 * chronologique à partir du flux d'alertes, qui est déjà temps réel.
 */
export default function Evenements() {
  const { alerts, loading, error, refresh } = useAlerts({})
  const { zones } = useZones()
  const { devices } = useDevices()
  const zoneNameById = Object.fromEntries(zones.map((z) => [z.id, z.name]))
  const deviceNameById = Object.fromEntries(devices.map((d) => [d.id, d.name]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Événements</h1>
        <p className="text-sm text-slate-500 mt-1">Journal chronologique dérivé du flux d'alertes système.</p>
      </div>

      <div className="rounded-lg bg-primary-50 text-primary text-xs font-medium px-4 py-3 flex items-start gap-2.5">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>
          Cette page affiche actuellement les événements système (alertes) en temps réel. Un journal
          dédié aux accès badge / interventions de maintenance nécessitera une API backend supplémentaire.
        </span>
      </div>

      {loading && <LoadingState label="Chargement des événements..." />}
      {!loading && error && <ErrorState message={error.message} onRetry={refresh} />}
      {!loading && !error && alerts.length === 0 && <EmptyState label="Aucun événement enregistré." />}

      {!loading && !error && alerts.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Zone</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono text-xs">{formatDateTime(alert.timestamp)}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">{zoneNameById[alert.zoneId] ?? alert.zoneId}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${typeStyles[normalizeStatus(alert.severity)] ?? 'bg-slate-100 text-slate-600'}`}>
                        {typeLabelFr[alert.type] ?? alert.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{alert.message}</td>
                    <td className="px-5 py-3.5 text-slate-500">{deviceNameById[alert.deviceId] ?? 'Système'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
