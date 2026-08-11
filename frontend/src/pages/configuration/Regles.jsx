import { useState } from 'react'
import { Check, Save } from 'lucide-react'
import { rules as initialRules } from '../../data/mockData'

const parameters = ['Température', 'Humidité', 'CO', 'Luminosité']

export default function Regles() {
  const [rules, setRules] = useState(initialRules)
  const [selectedId, setSelectedId] = useState(initialRules[0]?.id)
  const [saved, setSaved] = useState(false)

  const selected = rules.find((r) => r.id === selectedId)

  function update(field, value) {
    setRules((prev) => prev.map((r) => (r.id === selectedId ? { ...r, [field]: value } : r)))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Règles configurées</h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {rules.map((rule) => (
            <li key={rule.id}>
              <button
                onClick={() => setSelectedId(rule.id)}
                className={`w-full text-left px-5 py-3.5 transition-colors ${
                  rule.id === selectedId ? 'bg-primary-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${rule.id === selectedId ? 'text-primary' : 'text-slate-700'}`}>
                    {rule.name}
                  </p>
                  <span className={`h-2 w-2 rounded-full ${rule.enabled ? 'bg-status-normal' : 'bg-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{rule.parameter} · {rule.zone}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <div className="lg:col-span-2 card">
          <h3 className="section-title mb-5">Règle : {selected.name}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="label">Paramètre</label>
              <select
                value={selected.parameter}
                onChange={(e) => update('parameter', e.target.value)}
                className="select sm:max-w-xs"
              >
                {parameters.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Warning maximum</label>
              <input
                type="number"
                value={selected.warningMax}
                onChange={(e) => update('warningMax', +e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Critical maximum</label>
              <input
                type="number"
                value={selected.criticalMax}
                onChange={(e) => update('criticalMax', +e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Warning minimum</label>
              <input
                type="number"
                value={selected.warningMin}
                onChange={(e) => update('warningMin', +e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Critical minimum</label>
              <input
                type="number"
                value={selected.criticalMin}
                onChange={(e) => update('criticalMin', +e.target.value)}
                className="input"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2.5 pt-1">
              <input
                id="enabled"
                type="checkbox"
                checked={selected.enabled}
                onChange={(e) => update('enabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-slate-700">Activée</label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
            <button onClick={handleSave} className="btn-primary">
              <Save size={16} /> ENREGISTRER
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
