import { useEffect, useMemo, useState } from 'react'
import { Check, Save } from 'lucide-react'
import { LoadingState, ErrorState, EmptyState } from '../../components/AsyncState'
import { useThresholds } from '../../hooks/useThresholds'
import { useZones } from '../../hooks/useZones'

const emptyThreshold = (zoneId) => ({
  zoneId,
  minTemperature: 15,
  maxTemperature: 28,
  minHumidity: 30,
  maxHumidity: 65,
  coMax: 15,
  luminosityMax: 500,
  enabled: true,
})

export default function Regles() {
  const { zones, loading: zonesLoading } = useZones()
  const { thresholds, loading, error, refresh, save } = useThresholds()

  const [selectedZoneId, setSelectedZoneId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!selectedZoneId && zones.length > 0) {
      setSelectedZoneId(zones[0].id)
    }
  }, [zones, selectedZoneId])

  const thresholdByZone = useMemo(
    () => Object.fromEntries(thresholds.map((t) => [t.zoneId, t])),
    [thresholds],
  )

  useEffect(() => {
    if (!selectedZoneId) return
    const existing = thresholdByZone[selectedZoneId]
    setDraft(existing ? { ...existing } : emptyThreshold(selectedZoneId))
    setSaved(false)
  }, [selectedZoneId, thresholdByZone])

  function update(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave() {
    try {
      setSaving(true)
      const updated = await save(draft)
      setDraft(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (zonesLoading || loading) return <LoadingState label="Chargement des règles..." />
  if (error) return <ErrorState message={error.message} onRetry={refresh} />
  if (zones.length === 0) return <EmptyState label="Créez d'abord une zone dans l'onglet Zones." />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Zones</h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {zones.map((zone) => {
            const configured = Boolean(thresholdByZone[zone.id])
            return (
              <li key={zone.id}>
                <button
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`w-full text-left px-5 py-3.5 transition-colors ${
                    zone.id === selectedZoneId ? 'bg-primary-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold ${zone.id === selectedZoneId ? 'text-primary' : 'text-slate-700'}`}>
                      {zone.name}
                    </p>
                    <span className={`h-2 w-2 rounded-full ${configured ? 'bg-status-normal' : 'bg-slate-300'}`} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {configured ? 'Règle configurée' : 'Aucune règle — valeurs par défaut'}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {draft && (
        <div className="lg:col-span-2 card">
          <h3 className="section-title mb-5">
            Règle : {zones.find((z) => z.id === selectedZoneId)?.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Température min. (°C)</label>
              <input type="number" value={draft.minTemperature} onChange={(e) => update('minTemperature', +e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Température max. (°C)</label>
              <input type="number" value={draft.maxTemperature} onChange={(e) => update('maxTemperature', +e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Humidité min. (%)</label>
              <input type="number" value={draft.minHumidity} onChange={(e) => update('minHumidity', +e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Humidité max. (%)</label>
              <input type="number" value={draft.maxHumidity} onChange={(e) => update('maxHumidity', +e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">CO maximum (ppm)</label>
              <input type="number" value={draft.coMax} onChange={(e) => update('coMax', +e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Luminosité maximum (lx)</label>
              <input type="number" value={draft.luminosityMax} onChange={(e) => update('luminosityMax', +e.target.value)} className="input" />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2.5 pt-1">
              <input
                id="enabled"
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => update('enabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-slate-700">Activée</label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save size={16} /> {saving ? 'ENREGISTREMENT...' : 'ENREGISTRER'}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-status-normal">
                <Check size={16} /> Modifications enregistrées
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
