import { useState } from 'react'
import { Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useRealtimeStatus } from '../context/RealtimeContext'

export default function Topbar({ onMenuClick }) {
  const [open, setOpen] = useState(false)
  const { connected } = useRealtimeStatus()

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b shrink-0 border-slate-200 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg lg:hidden text-slate-600 hover:bg-slate-100"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>
        <div className={`hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 ${connected ? 'bg-status-normal/10' : 'bg-status-critical/10'}`}>
          <span className="relative flex w-2 h-2">
            {connected && <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-status-normal" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? 'bg-status-normal' : 'bg-status-critical'}`} />
          </span>
          <span className={`text-xs font-semibold ${connected ? 'text-status-normal' : 'text-status-critical'}`}>
            {connected ? 'System Online' : 'Backend déconnecté'}
          </span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-primary">
            A
          </div>
          <span className="hidden text-sm font-semibold sm:block text-slate-700">Admin</span>
          <ChevronDown size={16} className="text-slate-400" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-panel border border-slate-200 py-1.5 z-20">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Admin Système</p>
                <p className="text-xs text-slate-500">admin@labmonitor.mg</p>
              </div>
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <User size={15} /> Mon profil
              </button>
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Settings size={15} /> Paramètres
              </button>
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-status-critical hover:bg-red-50">
                <LogOut size={15} /> Déconnexion
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}