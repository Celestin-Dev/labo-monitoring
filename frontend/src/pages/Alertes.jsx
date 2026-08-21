import { useMemo, useState } from 'react'
import { ChevronDown, Check, CheckCheck } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { LoadingState, ErrorState, EmptyState } from '../components/AsyncState'
import { useAlerts } from '../hooks/useAlerts'
import { useZones } from '../hooks/useZones'
import { normalizeStatus } from '../lib/status'
import { formatDateTime } from '../lib/mappers'

const typeOptions = [
  { value: '', label: 'Tous' },
  { value: 'TEMPERATURE', label: 'Température' },
  { value: 'HUMIDITY', label: 'Humidité' },
  { value: 'CO', label: 'CO' },
  { value: 'LUMINOSITY', label: 'Luminosité' },
  { value: 'MOTION', label: 'Mouvement' },
  { value: 'FIRE', label: 'Feu' },
  { value: 'PRODUCT_THRESHOLD', label: 'Produit' },
  { value: 'DEVICE_OFFLINE', label: 'Appareil hors ligne' },
]

const severityOptions = [
  { value: '', label: 'Toutes' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'OFFLINE', label: 'Hors ligne' },
]

const typeLabel = (value) => typeOptions.find((t) => t.value === value)?.label ?? value

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="w-full sm:w-44">
      <label className="label">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="select">
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  )
}

export default function Alertes() {
  const [type, setType] = useState('')
  const [severity, setSeverity] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [date, setDate] = useState('')

  const { zones } = useZones()

  const filters = useMemo(() => {
    const f = {}
    if (type) f.type = type
    if (severity) f.severity = severity
    if (zoneId) f.zoneId = zoneId
    if (date) {
      f.from = `${date}T00:00:00.000Z`
      f.to = `${date}T23:59:59.999Z`
    }
    return f
  }, [type, severity, zoneId, date])

  const { alerts, loading, error, refresh, acknowledge, resolve } = useAlerts(filters)

  const zoneOptions = [{ value: '', label: 'Toutes' }, ...zones.map((z) => ({ value: z.id, label: z.name }))]

  async function handleAcknowledge(id) {
    try {
      await acknowledge(id)
    } catch (e) {
      // silencieux : l'UI reste cohérente, l'utilisateur peut réessayer
      console.error(e)
    }
  }

  async function handleResolve(id) {
    try {
      await resolve(id)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Alertes</h1>
        <p className="text-sm text-slate-500 mt-1">
          {loading ? 'Chargement...' : `${alerts.length} alerte${alerts.length > 1 ? 's' : ''} correspondant aux filtres.`}
        </p>
      </div>

      <div className="card">
        <p className="label mb-3">Filtrer</p>
        <div className="flex flex-wrap gap-4">
          <FilterSelect label="Type" value={type} onChange={setType} options={typeOptions} />
          <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={severityOptions} />
          <FilterSelect label="Zone" value={zoneId} onChange={setZoneId} options={zoneOptions} />
          <div className="w-full sm:w-44">
            <label className="label">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </div>
        </div>
      </div>

      {error && <ErrorState message={error.message} onRetry={refresh} />}
      {!error && loading && <LoadingState label="Chargement des alertes..." />}

      {!error && !loading && (
        <div className="space-y-4">
          {alerts.length === 0 && <EmptyState label="Aucune alerte ne correspond à ces filtres." />}

          {alerts.map((alert) => (
            <div key={alert.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={normalizeStatus(alert.severity)} />
                    <span className="text-xs font-semibold text-slate-400">{typeLabel(alert.type)}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{alert.message}</h3>
                  <p className="text-sm text-slate-500">{alert.zoneId}</p>
                  <div className="flex gap-6 text-sm pt-1">
                    <p><span className="text-slate-400">Valeur : </span><span className="data-value text-slate-700">{alert.value ?? '—'}</span></p>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{formatDateTime(alert.timestamp)}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {alert.resolved ? (
                    <span className="text-xs font-semibold text-status-normal">Résolue</span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={alert.acknowledged}
                        className="btn-outline text-xs px-3 py-1.5"
                      >
                        <Check size={14} /> {alert.acknowledged ? 'Acquittée' : 'Acquitter'}
                      </button>
                      <button onClick={() => handleResolve(alert.id)} className="btn-primary text-xs px-3 py-1.5">
                        <CheckCheck size={14} /> Résoudre
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
