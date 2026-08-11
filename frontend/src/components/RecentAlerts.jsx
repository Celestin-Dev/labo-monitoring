import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { StatusDot } from './StatusBadge'

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function RecentAlerts({ alerts }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Alertes récentes</h3>
        <Link to="/alertes" className="text-xs font-semibold text-primary hover:underline">
          Voir tout
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <Link
              to="/alertes"
              className="flex items-center justify-between gap-3 py-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <StatusDot status={alert.severity} className="shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{alert.title}</p>
                  <p className="text-xs text-slate-400">{formatTime(alert.date)}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0 group-hover:text-slate-500 transition-colors" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
