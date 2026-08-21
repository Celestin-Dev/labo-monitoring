import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { LoadingState, ErrorState, EmptyState } from '../../components/AsyncState'
import { useZones } from '../../hooks/useZones'
import { zonesApi } from '../../lib/api/zones'

function ZoneFormRow({ initial, onCancel, onSaved }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    try {
      setSaving(true)
      const saved = initial?.id
        ? await zonesApi.update(initial.id, { name, description })
        : await zonesApi.create({ name, description })
      onSaved(saved)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="bg-primary-50/40">
      <td className="px-5 py-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la zone" className="input" autoFocus />
      </td>
      <td className="px-5 py-3">
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input" />
      </td>
      <td className="px-5 py-3 text-slate-400">—</td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary text-xs px-2.5 py-1.5">
            <Check size={14} /> {saving ? '...' : 'Valider'}
          </button>
          <button onClick={onCancel} className="btn-ghost text-xs px-2.5 py-1.5">
            <X size={14} /> Annuler
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function ZonesConfig() {
  const { zones, loading, error, refresh } = useZones()
  const [editingId, setEditingId] = useState(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(id) {
    if (!confirm('Supprimer cette zone ? Cette action est irréversible.')) return
    try {
      await zonesApi.remove(id)
      refresh()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setCreating(true)} disabled={creating} className="btn-primary">
          <Plus size={16} /> Nouvelle zone
        </button>
      </div>

      {loading && <LoadingState label="Chargement des zones..." />}
      {!loading && error && <ErrorState message={error.message} onRetry={refresh} />}

      {!loading && !error && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Nom</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Statut actuel</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {creating && (
                  <ZoneFormRow
                    onCancel={() => setCreating(false)}
                    onSaved={() => { setCreating(false); refresh() }}
                  />
                )}

                {zones.length === 0 && !creating && (
                  <tr><td colSpan={4}><EmptyState label="Aucune zone. Cliquez sur « Nouvelle zone » pour commencer." /></td></tr>
                )}

                {zones.map((zone) =>
                  editingId === zone.id ? (
                    <ZoneFormRow
                      key={zone.id}
                      initial={zone}
                      onCancel={() => setEditingId(null)}
                      onSaved={() => { setEditingId(null); refresh() }}
                    />
                  ) : (
                    <tr key={zone.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{zone.name}</td>
                      <td className="px-5 py-3.5 text-slate-500">{zone.description}</td>
                      <td className="px-5 py-3.5 text-slate-500 capitalize">{zone.status}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingId(zone.id)} className="btn-ghost text-xs px-2.5 py-1.5">
                            <Pencil size={14} /> Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(zone.id)}
                            className="btn-ghost text-xs px-2.5 py-1.5 text-status-critical hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
