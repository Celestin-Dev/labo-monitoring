import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/configuration/regles', label: 'Règles' },
  { to: '/configuration/zones', label: 'Zones' },
  { to: '/configuration/utilisateurs', label: 'Utilisateurs' },
]

export default function ConfigurationLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">Gérez les règles de seuils, les zones et les accès utilisateurs.</p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Outlet />
    </div>
  )
}
