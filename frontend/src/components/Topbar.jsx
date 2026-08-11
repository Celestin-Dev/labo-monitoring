import { useState } from 'react'
import { Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'

export default function Topbar({ onMenuClick }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-status-normal/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-normal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-normal" />
          </span>
          <span className="text-xs font-semibold text-status-normal">System Online</span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            A
          </div>
          <span className="hidden sm:block text-sm font-semibold text-slate-700">Admin</span>
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
