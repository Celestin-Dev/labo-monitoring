import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { zones as initialZones } from '../../data/mockData'

export default function ZonesConfig() {
  const [zones, setZones] = useState(initialZones)

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button className="btn-primary">
          <Plus size={16} /> Nouvelle zone
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Capteurs actifs</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{zone.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{zone.description}</td>
                  <td className="px-5 py-3.5 text-slate-500">4 capteurs</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button className="btn-ghost text-xs px-2.5 py-1.5">
                        <Pencil size={14} /> Modifier
                      </button>
                      <button
                        onClick={() => setZones((prev) => prev.filter((z) => z.id !== zone.id))}
                        className="btn-ghost text-xs px-2.5 py-1.5 text-status-critical hover:bg-red-50"
                      >
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
