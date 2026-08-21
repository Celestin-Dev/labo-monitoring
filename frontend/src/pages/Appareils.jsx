import { Router as RouterIcon, Wifi } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { LoadingState, ErrorState, EmptyState } from '../components/AsyncState'
import { useDevices } from '../hooks/useDevices'
import { useZones } from '../hooks/useZones'
import { formatDateTime } from '../lib/mappers'

export default function Appareils() {
  const { devices, loading, error, refresh } = useDevices()
  const { zones } = useZones()
  const zoneNameById = Object.fromEntries(zones.map((z) => [z.id, z.name]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Appareils</h1>
        <p className="text-sm text-slate-500 mt-1">Inventaire et état des capteurs et passerelles connectés (auto-enregistrés via MQTT).</p>
      </div>

      {loading && <LoadingState label="Chargement des appareils..." />}
      {!loading && error && <ErrorState message={error.message} onRetry={refresh} />}
      {!loading && !error && devices.length === 0 && (
        <EmptyState label="Aucun appareil détecté pour le moment — ils apparaissent automatiquement dès leur première mesure MQTT." />
      )}

      {!loading && !error && devices.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Appareil</th>
                  <th className="px-5 py-3">Zone</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Adresse IP</th>
                  <th className="px-5 py-3">Dernière activité</th>
                  <th className="px-5 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {devices.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                          <RouterIcon size={15} />
                        </div>
                        <span className="font-semibold text-slate-700">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{zoneNameById[d.zoneId] ?? d.zoneId}</td>
                    <td className="px-5 py-3.5 text-slate-600">{d.type || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                        <Wifi size={13} /> {d.ipAddress || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{formatDateTime(d.lastHeartbeat)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={d.status} size="sm" /></td>
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
