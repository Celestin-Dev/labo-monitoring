import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SensorChart from '../components/SensorChart'
import { zones, tempHumiditySeries, coSeries, lightSeries } from '../data/mockData'

const periods = ['1 heure', '24 heures', '7 jours', '30 jours']

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="select">
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  )
}

export default function Monitoring() {
  const [zone, setZone] = useState('Toutes')
  const [period, setPeriod] = useState('24 heures')

  const zoneOptions = ['Toutes', ...zones.map((z) => z.name)]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">Suivi détaillé des capteurs sur la période sélectionnée.</p>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <FilterSelect label="Zone" value={zone} onChange={setZone} options={zoneOptions} />
          </div>
          <div className="w-48">
            <FilterSelect label="Période" value={period} onChange={setPeriod} options={periods} />
          </div>
          <div className="ml-auto text-xs text-slate-400 font-medium pb-2">
            {zone === 'Toutes' ? 'Toutes les zones' : zone} · {period}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title mb-4">Température</h3>
        <SensorChart data={tempHumiditySeries} keys={['temperature']} />
      </div>

      <div className="card">
        <h3 className="section-title mb-4">Humidité</h3>
        <SensorChart data={tempHumiditySeries} keys={['humidity']} />
      </div>

      <div className="card">
        <h3 className="section-title mb-4">CO</h3>
        <SensorChart data={coSeries} keys={['co']} />
      </div>

      <div className="card">
        <h3 className="section-title mb-4">Luminosité</h3>
        <SensorChart data={lightSeries} keys={['light']} />
      </div>
    </div>
  )
}
