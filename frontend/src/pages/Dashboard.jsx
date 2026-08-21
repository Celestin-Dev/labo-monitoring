import { Thermometer, Droplets, Wind, Sun } from 'lucide-react'
import StatCard from '../components/StatCard'
import ZoneStatusList from '../components/ZoneStatusList'
import RecentAlerts from '../components/RecentAlerts'
import SensorChart from '../components/SensorChart'
import { LoadingState, ErrorState } from '../components/AsyncState'
import { useDashboard } from '../hooks/useDashboard'
import { useMeasurementSeries } from '../hooks/useMeasurementSeries'
import { STATUS } from '../lib/status'

const icons = {
  temperature: Thermometer,
  humidity: Droplets,
  co: Wind,
  light: Sun,
}

function statSeverity(key, value) {
  if (value == null) return STATUS.OFFLINE
  if (key === 'temperature' && (value > 28 || value < 10)) return STATUS.WARNING
  if (key === 'co' && value > 15) return STATUS.WARNING
  return STATUS.NORMAL
}

export default function Dashboard() {
  const { globalStats, zones, recentAlerts, loading, error, refresh } = useDashboard()
  const { series, loading: seriesLoading } = useMeasurementSeries({ period: '24h' })

  const statCards = globalStats
    ? [
        { key: 'temperature', label: 'Temp.', value: globalStats.avgTemperature ?? '—', unit: '°C' },
        { key: 'humidity', label: 'Humidité', value: globalStats.avgHumidity ?? '—', unit: '%' },
        { key: 'co', label: 'CO', value: globalStats.avgCo ?? '—', unit: 'ppm' },
        { key: 'light', label: 'Light', value: globalStats.avgLuminosity ?? '—', unit: 'lx' },
      ]
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Vue globale</h1>
        <p className="text-sm text-slate-500 mt-1">Supervision en temps réel des paramètres environnementaux du laboratoire.</p>
      </div>

      {loading && <LoadingState label="Chargement du tableau de bord..." />}
      {!loading && error && <ErrorState message={error.message} onRetry={refresh} />}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <StatCard
                key={stat.key}
                icon={icons[stat.key]}
                label={stat.label}
                value={stat.value}
                unit={stat.unit}
                status={statSeverity(stat.key, stat.value === '—' ? null : stat.value)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="section-title">Température / Humidité</h3>
                <span className="text-xs font-semibold text-slate-400">Dernières 24h</span>
              </div>
              {seriesLoading ? (
                <LoadingState label="Chargement du graphique..." />
              ) : (
                <SensorChart data={series} keys={['temperature', 'humidity']} />
              )}
            </div>

            <ZoneStatusList zones={zones} />
          </div>

          <RecentAlerts alerts={recentAlerts} />
        </>
      )}
    </div>
  )
}
