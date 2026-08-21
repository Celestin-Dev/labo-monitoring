import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import SensorChart from '../components/SensorChart'
import { LoadingState, ErrorState, EmptyState } from '../components/AsyncState'
import { useZones } from '../hooks/useZones'
import { useMeasurementSeries } from '../hooks/useMeasurementSeries'
import { measurementsApi } from '../lib/api/measurements'
import { formatDateTime } from '../lib/mappers'

const periods = [
  { value: '1h', label: '1 heure' },
  { value: '24h', label: '24 heures' },
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
]

function downloadCsv(series, zoneLabel) {
  const header = 'heure,temperature_c,humidite_pct,co_ppm,luminosite_lx\n'
  const rows = series
    .map((r) => [r.time, r.temperature, r.humidity, r.co, r.light].join(','))
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `historique_${zoneLabel}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Historique() {
  const { zones } = useZones()
  const [zoneId, setZoneId] = useState('')
  const [period, setPeriod] = useState('24h')
  const [recent, setRecent] = useState([])
  const [recentLoading, setRecentLoading] = useState(false)

  const { series, loading, error, refresh } = useMeasurementSeries({ zoneId: zoneId || undefined, period })

  const zoneOptions = [{ value: '', label: 'Toutes' }, ...zones.map((z) => ({ value: z.id, label: z.name }))]
  const selectedZoneLabel = zoneId ? (zones.find((z) => z.id === zoneId)?.name ?? zoneId) : 'toutes-zones'

  useEffect(() => {
    let cancelled = false
    async function loadRecent() {
      if (!zoneId) {
        setRecent([])
        return
      }
      try {
        setRecentLoading(true)
        const data = await measurementsApi.list({ zoneId, limit: 10 })
        if (!cancelled) setRecent(data)
      } catch {
        if (!cancelled) setRecent([])
      } finally {
        if (!cancelled) setRecentLoading(false)
      }
    }
    loadRecent()
    return () => { cancelled = true }
  }, [zoneId])

  const canExport = useMemo(() => series.length > 0, [series])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Historique</h1>
          <p className="text-sm text-slate-500 mt-1">Consultez et exportez l'historique des mesures enregistrées.</p>
        </div>
        <button onClick={() => downloadCsv(series, selectedZoneLabel)} disabled={!canExport} className="btn-outline">
          <Download size={16} /> Exporter (CSV)
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <label className="label">Zone</label>
            <div className="relative">
              <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className="select">
                {zoneOptions.map((z) => <option key={z.value} value={z.value}>{z.label}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="w-48">
            <label className="label">Période</label>
            <div className="relative">
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="select">
                {periods.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error.message} onRetry={refresh} />}
      {!error && loading && <LoadingState label="Chargement de l'historique..." />}

      {!error && !loading && (
        <>
          <div className="card">
            <h3 className="section-title mb-4">Évolution Température / Humidité</h3>
            {series.length === 0 ? (
              <EmptyState label="Aucune mesure sur cette période." />
            ) : (
              <SensorChart data={series} keys={['temperature', 'humidity']} height={320} />
            )}
          </div>

          {zoneId && (
            <div className="card p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Dernières mesures brutes — {selectedZoneLabel}</h3>
              </div>
              {recentLoading ? (
                <LoadingState label="Chargement..." />
              ) : recent.length === 0 ? (
                <EmptyState label="Aucune mesure récente." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <th className="px-5 py-3">Horodatage</th>
                        <th className="px-5 py-3">Température (°C)</th>
                        <th className="px-5 py-3">Humidité (%)</th>
                        <th className="px-5 py-3">CO (ppm)</th>
                        <th className="px-5 py-3">Luminosité (lx)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recent.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-5 py-2.5 font-mono text-xs text-slate-500">{formatDateTime(m.timestamp)}</td>
                          <td className="px-5 py-2.5 data-value text-slate-700">{m.temperature}</td>
                          <td className="px-5 py-2.5 data-value text-slate-700">{m.humidity}</td>
                          <td className="px-5 py-2.5 data-value text-slate-700">{m.coRaw}</td>
                          <td className="px-5 py-2.5 data-value text-slate-700">{m.luminosity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
