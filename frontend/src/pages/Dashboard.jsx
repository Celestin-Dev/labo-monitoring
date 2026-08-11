import { Thermometer, Droplets, Wind, Sun } from 'lucide-react'
import StatCard from '../components/StatCard'
import ZoneStatusList from '../components/ZoneStatusList'
import RecentAlerts from '../components/RecentAlerts'
import SensorChart from '../components/SensorChart'
import { globalStats, zones, recentAlerts, tempHumiditySeries } from '../data/mockData'

const icons = {
  temperature: Thermometer,
  humidity: Droplets,
  co: Wind,
  light: Sun,
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Vue globale</h1>
        <p className="text-sm text-slate-500 mt-1">Supervision en temps réel des paramètres environnementaux du laboratoire.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {globalStats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={icons[stat.key]}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
            status={stat.status}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="section-title">Température / Humidité</h3>
            <span className="text-xs font-semibold text-slate-400">Dernières 24h</span>
          </div>
          <SensorChart data={tempHumiditySeries} keys={['temperature', 'humidity']} />
        </div>

        <ZoneStatusList zones={zones} />
      </div>

      <RecentAlerts alerts={recentAlerts.slice(0, 4)} />
    </div>
  )
}
