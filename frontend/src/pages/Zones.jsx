import { Thermometer, Droplets, Wind } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { LoadingState, ErrorState, EmptyState } from '../components/AsyncState'
import { useZones } from '../hooks/useZones'
import { STATUS } from '../lib/status'

function ZoneCard({ zone }) {
  const offline = zone.status === STATUS.OFFLINE || zone.temperature == null

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">{zone.name}</h3>
          <p className="text-sm text-slate-400">{zone.description}</p>
        </div>
        <StatusBadge status={zone.status} />
      </div>

      {offline ? (
        <div className="py-6 text-center text-sm text-slate-400 font-medium">
          Aucune donnée — capteurs hors ligne
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <Thermometer size={16} className="mx-auto text-primary mb-1.5" />
            <p className="data-value text-sm text-slate-800">{zone.temperature}°C</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <Droplets size={16} className="mx-auto text-secondary mb-1.5" />
            <p className="data-value text-sm text-slate-800">{zone.humidity}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <Wind size={16} className="mx-auto text-amber-500 mb-1.5" />
            <p className="data-value text-sm text-slate-800">{zone.co} ppm</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Zones() {
  const { zones, loading, error, refresh } = useZones()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Zones</h1>
        <p className="text-sm text-slate-500 mt-1">Aperçu de l'état environnemental de chaque zone du laboratoire.</p>
      </div>

      {loading && <LoadingState label="Chargement des zones..." />}
      {!loading && error && <ErrorState message={error.message} onRetry={refresh} />}
      {!loading && !error && zones.length === 0 && <EmptyState label="Aucune zone configurée pour le moment." />}

      {!loading && !error && zones.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      )}
    </div>
  )
}
