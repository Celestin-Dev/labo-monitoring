import { BatteryMedium, Router as RouterIcon } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { devices } from '../data/mockData'

function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

function batteryColor(pct) {
  if (pct === 0) return 'text-slate-300'
  if (pct < 30) return 'text-status-critical'
  if (pct < 60) return 'text-status-warning'
  return 'text-status-normal'
}

export default function Appareils() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Appareils</h1>
        <p className="text-sm text-slate-500 mt-1">Inventaire et état des capteurs et passerelles connectés.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Appareil</th>
                <th className="px-5 py-3">Zone</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Batterie</th>
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
                  <td className="px-5 py-3.5 text-slate-600">{d.zone}</td>
                  <td className="px-5 py-3.5 text-slate-600">{d.type}</td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1.5 font-mono font-semibold ${batteryColor(d.battery)}`}>
                      <BatteryMedium size={15} /> {d.battery}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{formatDate(d.lastSeen)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={d.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
