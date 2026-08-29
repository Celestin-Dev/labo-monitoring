import { useState } from 'react'
import { Router as RouterIcon, Wifi, Plus, Pencil, Trash2, X, Check, Info } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { LoadingState, ErrorState, EmptyState } from '../components/AsyncState'
import { useDevices } from '../hooks/useDevices'
import { useZones } from '../hooks/useZones'
import { devicesApi } from '../lib/api/devices'
import { formatDateTime } from '../lib/mappers'

function DeviceFormRow({ initial, zones, onCancel, onSaved }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [zoneId, setZoneId] = useState(initial?.zoneId ?? zones[0]?.id ?? '')
  const [ipAddress, setIpAddress] = useState(initial?.ipAddress ?? '')
  const [type, setType] = useState(initial?.type ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    if (!name.trim() || !zoneId) return
    try {
      setSaving(true)
      setError(null)
      const payload = { name: name.trim(), zoneId, ipAddress, type }
      const saved = initial?.id
        ? await devicesApi.update(initial.id, payload)
        : await devicesApi.create(payload)
      onSaved(saved)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="bg-primary-50/40">
      <td className="px-5 py-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom exact saisi sur le portail captif ESP32"
          className="input"
          autoFocus
        />
        {error && <p className="mt-1 text-xs text-status-critical">{error}</p>}
      </td>
      <td className="px-5 py-3">
        <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className="select">
          {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
      </td>
      <td className="px-5 py-3">
        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (ex: ESP32)" className="input" />
      </td>
      <td className="px-5 py-3">
        <input value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} placeholder="IP (optionnel)" className="input" />
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

export default function Appareils() {
  const { devices, loading, error, refresh } = useDevices()
  const { zones } = useZones()
  const zoneNameById = Object.fromEntries(zones.map((z) => [z.id, z.name]))

  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)

  async function handleDelete(id) {
    if (!confirm("Supprimer cet appareil ? Il ne pourra plus envoyer de mesures tant qu'il n'est pas ré-enregistré.")) return
    try {
      await devicesApi.remove(id)
      refresh()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Appareils</h1>
          <p className="mt-1 text-sm text-slate-500">Enregistrez ici chaque appareil avant de le connecter — le nom doit être identique à celui saisi dans le portail captif de l'ESP32.</p>
        </div>
        <button onClick={() => setCreating(true)} disabled={creating || zones.length === 0} className="btn-primary">
          <Plus size={16} /> Nouvel appareil
        </button>
      </div>

      <div className="rounded-lg bg-primary-50 text-primary text-xs font-medium px-4 py-3 flex items-start gap-2.5">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>
          Le backend n'accepte les mesures MQTT que si la zone <strong>et</strong> l'appareil ont été enregistrés ici au préalable,
          avec exactement le même nom que celui configuré via le portail captif de l'ESP32 (insensible à la casse). Tout message
          provenant d'un nom inconnu est rejeté et journalisé côté serveur — rien n'est écrit en base.
        </span>
      </div>

      {zones.length === 0 && !loading && (
        <EmptyState label="Créez d'abord une zone dans Configuration > Zones avant d'ajouter un appareil." />
      )}

      {loading && <LoadingState label="Chargement des appareils..." />}
      {!loading && error && <ErrorState message={error.message} onRetry={refresh} />}

      {!loading && !error && zones.length > 0 && (
        <div className="p-0 overflow-hidden card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left uppercase border-b border-slate-100 text-slate-400">
                  <th className="px-5 py-3">Appareil</th>
                  <th className="px-5 py-3">Zone</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Adresse IP</th>
                  <th className="px-5 py-3">Dernière activité</th>
                  <th className="px-5 py-3 text-right">Statut / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {creating && (
                  <DeviceFormRow
                    zones={zones}
                    onCancel={() => setCreating(false)}
                    onSaved={() => { setCreating(false); refresh() }}
                  />
                )}

                {devices.length === 0 && !creating && (
                  <tr><td colSpan={6}><EmptyState label="Aucun appareil enregistré. Cliquez sur « Nouvel appareil » pour en provisionner un." /></td></tr>
                )}

                {devices.map((d) =>
                  editingId === d.id ? (
                    <DeviceFormRow
                      key={d.id}
                      initial={d}
                      zones={zones}
                      onCancel={() => setEditingId(null)}
                      onSaved={() => { setEditingId(null); refresh() }}
                    />
                  ) : (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary shrink-0">
                            <RouterIcon size={15} />
                          </div>
                          <span className="font-mono font-semibold text-slate-700">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{zoneNameById[d.zoneId] ?? d.zoneId}</td>
                      <td className="px-5 py-3.5 text-slate-600">{d.type || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                          <Wifi size={13} /> {d.ipAddress || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{formatDateTime(d.lastHeartbeat)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <StatusBadge status={d.status} size="sm" />
                          <button onClick={() => setEditingId(d.id)} className="btn-ghost text-xs px-2 py-1.5">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => handleDelete(d.id)} className="btn-ghost text-xs px-2 py-1.5 text-status-critical hover:bg-red-50">
                            <Trash2 size={13} />
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
