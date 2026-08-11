import { useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import SensorChart from '../components/SensorChart'
import { tempHumiditySeries, zones } from '../data/mockData'

export default function Historique() {
  const [zone, setZone] = useState('Toutes')
  const zoneOptions = ['Toutes', ...zones.map((z) => z.name)]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Historique</h1>
          <p className="text-sm text-slate-500 mt-1">Consultez et exportez l'historique des mesures enregistrées.</p>
        </div>
        <button className="btn-outline">
          <Download size={16} /> Exporter (CSV)
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <label className="label">Zone</label>
            <div className="relative">
              <select value={zone} onChange={(e) => setZone(e.target.value)} className="select">
                {zoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="w-44">
            <label className="label">Du</label>
            <input type="date" className="input" defaultValue="2026-08-04" />
          </div>
          <div className="w-44">
            <label className="label">Au</label>
            <input type="date" className="input" defaultValue="2026-08-11" />
          </div>
          <button className="btn-primary">Appliquer</button>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title mb-4">Évolution Température / Humidité</h3>
        <SensorChart data={tempHumiditySeries} keys={['temperature', 'humidity']} height={320} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Heure</th>
                <th className="px-5 py-3">Température (°C)</th>
                <th className="px-5 py-3">Humidité (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tempHumiditySeries.slice(0, 10).map((row) => (
                <tr key={row.time} className="hover:bg-slate-50">
                  <td className="px-5 py-2.5 font-mono text-xs text-slate-500">{row.time}</td>
                  <td className="px-5 py-2.5 data-value text-slate-700">{row.temperature}</td>
                  <td className="px-5 py-2.5 data-value text-slate-700">{row.humidity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
