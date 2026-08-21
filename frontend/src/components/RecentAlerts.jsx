import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { StatusDot } from './StatusBadge'
import { normalizeStatus } from '../lib/status'
import { formatDateTime } from '../lib/mappers'
import { EmptyState } from './AsyncState'

export default function RecentAlerts({ alerts }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Alertes récentes</h3>
        <Link to="/alertes" className="text-xs font-semibold text-primary hover:underline">
          Voir tout
        </Link>
      </div>

      {alerts.length === 0 ? (
        <EmptyState label="Aucune alerte récente." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <Link to="/alertes" className="flex items-center justify-between gap-3 py-3 group">
                <div className="flex items-center min-w-0 gap-3">
                  <StatusDot status={normalizeStatus(alert.severity)} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-800">
                      {alert.zoneId ? `${alert.zoneId} — ` : ''}{alert.message}
                    </p>
                    <p className="text-xs text-slate-400">{formatDateTime(alert.timestamp)}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="transition-colors text-slate-300 shrink-0 group-hover:text-slate-500" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}