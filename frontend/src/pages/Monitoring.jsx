import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SensorChart from '../components/SensorChart'
import { LoadingState, ErrorState } from '../components/AsyncState'
import { useZones } from '../hooks/useZones'
import { useMeasurementSeries } from '../hooks/useMeasurementSeries'

const periods = [
  { value: '1h', label: '1 heure' },
  { value: '24h', label: '24 heures' },
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
]

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
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

export default function Monitoring() {
  const { zones } = useZones()
  const [zoneId, setZoneId] = useState('')
  const [period, setPeriod] = useState('24h')

  const { series, loading, error, refresh } = useMeasurementSeries({ zoneId: zoneId || undefined, period })

  const zoneOptions = [{ value: '', label: 'Toutes' }, ...zones.map((z) => ({ value: z.id, label: z.name }))]
  const selectedZoneName = zoneId ? zones.find((z) => z.id === zoneId)?.name ?? zoneId : 'Toutes les zones'
  const periodLabel = periods.find((p) => p.value === period)?.label

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">Suivi détaillé des capteurs sur la période sélectionnée.</p>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <FilterSelect label="Zone" value={zoneId} onChange={setZoneId} options={zoneOptions} />
          </div>
          <div className="w-48">
            <FilterSelect label="Période" value={period} onChange={setPeriod} options={periods} />
          </div>
          <div className="ml-auto text-xs text-slate-400 font-medium pb-2">
            {selectedZoneName} · {periodLabel}
          </div>
        </div>
      </div>

      {error && <ErrorState message={error.message} onRetry={refresh} />}

      {!error && loading && <LoadingState label="Chargement des mesures..." />}

      {!error && !loading && (
        <>
          <div className="card">
            <h3 className="section-title mb-4">Température</h3>
            <SensorChart data={series} keys={['temperature']} />
          </div>

          <div className="card">
            <h3 className="section-title mb-4">Humidité</h3>
            <SensorChart data={series} keys={['humidity']} />
          </div>

          <div className="card">
            <h3 className="section-title mb-4">CO</h3>
            <SensorChart data={series} keys={['co']} />
          </div>

          <div className="card">
            <h3 className="section-title mb-4">Luminosité</h3>
            <SensorChart data={series} keys={['light']} />
          </div>
        </>
      )}
    </div>
  )
}
