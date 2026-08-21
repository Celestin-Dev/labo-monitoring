import { Link } from 'react-router-dom'
import { StatusDot } from './StatusBadge'
import { STATUS_META } from '../lib/status'
import { EmptyState } from './AsyncState'

export default function ZoneStatusList({ zones }) {
  return (
    <div className="card h-full">
      <h3 className="section-title mb-4">État des zones</h3>
      {zones.length === 0 ? (
        <EmptyState label="Aucune zone configurée." />
      ) : (
      <ul className="space-y-1">
        {zones.map((zone) => {
          const meta = STATUS_META[zone.status]
          return (
            <li key={zone.id}>
              <Link
                to="/zones"
                className="flex items-center justify-between rounded-lg px-2.5 py-2.5 -mx-2.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <StatusDot status={zone.status} />
                  <span className="text-sm font-semibold text-slate-700">{zone.name}</span>
                  <span className="text-xs text-slate-400">{zone.description}</span>
                </div>
                <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      )}
    </div>
  )
}
