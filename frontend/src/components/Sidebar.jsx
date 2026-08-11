import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  MapPinned,
  FlaskConical,
  BellRing,
  ListTree,
  History,
  Router,
  Settings,
  FlaskConical as FlaskIcon,
  Thermometer,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/monitoring', label: 'Monitoring', icon: Activity },
  { to: '/zones', label: 'Zones', icon: MapPinned },
  { to: '/produits', label: 'Produits', icon: FlaskConical },
  { to: '/alertes', label: 'Alertes', icon: BellRing },
  { to: '/evenements', label: 'Événements', icon: ListTree },
  { to: '/historique', label: 'Historique', icon: History },
  { to: '/appareils', label: 'Appareils', icon: Router },
  { to: '/configuration', label: 'Configuration', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-primary-950 text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <FlaskIcon size={18} strokeWidth={2.5} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-extrabold tracking-tight text-sm">LAB MONITOR</p>
            <p className="text-[10px] text-primary-200/70 font-medium tracking-wide">SUPERVISION LABORATOIRE</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scroll-thin px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-[11px] text-primary-200/70 font-medium">
            <Thermometer size={14} />
            <span>v1.0.0 · Environnement démo</span>
          </div>
        </div>
      </aside>
    </>
  )
}
