import { events } from '../data/mockData'

const typeStyles = {
  Alerte: 'bg-status-critical/10 text-status-critical',
  Accès: 'bg-primary-50 text-primary',
  Sécurité: 'bg-status-warning/10 text-status-warning',
  Maintenance: 'bg-secondary/10 text-secondary',
  Appareil: 'bg-status-offline/10 text-status-offline',
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Evenements() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Événements</h1>
        <p className="text-sm text-slate-500 mt-1">Journal chronologique des événements du système et du personnel.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Zone</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Acteur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono text-xs">{formatDate(ev.date)}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">{ev.zone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${typeStyles[ev.type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{ev.description}</td>
                  <td className="px-5 py-3.5 text-slate-500">{ev.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
