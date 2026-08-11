import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { users as initialUsers } from '../../data/mockData'

export default function Utilisateurs() {
  const [users, setUsers] = useState(initialUsers)

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button className="btn-primary">
          <Plus size={16} /> Nouvel utilisateur
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Rôle</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-700">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.role}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                      u.status === 'Actif' ? 'bg-status-normal/10 text-status-normal' : 'bg-status-offline/10 text-status-offline'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button className="btn-ghost text-xs px-2.5 py-1.5">
                        <Pencil size={14} /> Modifier
                      </button>
                      <button
                        onClick={() => setUsers((prev) => prev.filter((x) => x.id !== u.id))}
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
