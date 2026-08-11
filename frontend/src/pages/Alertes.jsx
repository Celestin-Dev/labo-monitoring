import { useMemo, useState } from 'react'
import { ChevronDown, Check, CheckCheck } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { recentAlerts as initialAlerts, zones } from '../data/mockData'

const types = ['Tous', 'Température', 'Humidité', 'CO', 'Sécurité', 'Appareil']
const severities = ['Toutes', 'critical', 'warning', 'normal', 'offline']
const severityLabels = { critical: 'Critical', warning: 'Warning', normal: 'Normal', offline: 'Hors ligne' }

function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function FilterSelect({ label, value, onChange, options, renderLabel }) {
  return (
    <div className="w-full sm:w-40">
      <label className="label">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="select">
          {options.map((opt) => (
            <option key={opt} value={opt}>{renderLabel ? renderLabel(opt) : opt}</option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  )
}

export default function Alertes() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [type, setType] = useState('Tous')
  const [severity, setSeverity] = useState('Toutes')
  const [zone, setZone] = useState('Toutes')
  const [date, setDate] = useState('')

  const zoneOptions = ['Toutes', ...zones.map((z) => z.name)]

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (type !== 'Tous' && a.type !== type) return false
      if (severity !== 'Toutes' && a.severity !== severity) return false
      if (zone !== 'Toutes' && a.zone !== zone) return false
      if (date && !a.date.startsWith(date)) return false
      return true
    })
  }, [alerts, type, severity, zone, date])

  function acknowledge(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
  }
  function resolve(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true, acknowledged: true } : a)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Alertes</h1>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} alerte{filtered.length > 1 ? 's' : ''} correspondant aux filtres.</p>
      </div>

      <div className="card">
        <p className="label mb-3">Filtrer</p>
        <div className="flex flex-wrap gap-4">
          <FilterSelect label="Type" value={type} onChange={setType} options={types} />
          <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={severities} renderLabel={(o) => (o === 'Toutes' ? o : severityLabels[o])} />
          <FilterSelect label="Zone" value={zone} onChange={setZone} options={zoneOptions} />
          <div className="w-full sm:w-44">
            <label className="label">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((alert) => (
          <div key={alert.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <StatusBadge status={alert.severity} />
                <h3 className="text-base font-bold text-slate-900">{alert.title.split(' - ')[1] ?? alert.title}</h3>
                <p className="text-sm text-slate-500">{alert.zone}</p>
                <div className="flex gap-6 text-sm pt-1">
                  <p><span className="text-slate-400">Valeur : </span><span className="data-value text-slate-700">{alert.value}</span></p>
                  <p><span className="text-slate-400">Seuil : </span><span className="data-value text-slate-700">{alert.threshold}</span></p>
                </div>
                <p className="text-xs text-slate-400 font-medium">{formatDate(alert.date)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {alert.resolved ? (
                  <span className="text-xs font-semibold text-status-normal">Résolue</span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => acknowledge(alert.id)}
                      disabled={alert.acknowledged}
                      className="btn-outline text-xs px-3 py-1.5"
                    >
                      <Check size={14} /> {alert.acknowledged ? 'Acquittée' : 'Acquitter'}
                    </button>
                    <button
                      onClick={() => resolve(alert.id)}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      <CheckCheck size={14} /> Résoudre
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card text-center py-12 text-sm text-slate-400">
            Aucune alerte ne correspond à ces filtres.
          </div>
        )}
      </div>
    </div>
  )
}
