import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Monitoring from './pages/Monitoring'
import Zones from './pages/Zones'
import Produits from './pages/Produits'
import Alertes from './pages/Alertes'
import Evenements from './pages/Evenements'
import Historique from './pages/Historique'
import Appareils from './pages/Appareils'
import ConfigurationLayout from './pages/configuration/ConfigurationLayout'
import Regles from './pages/configuration/Regles'
import ZonesConfig from './pages/configuration/ZonesConfig'
import Utilisateurs from './pages/configuration/Utilisateurs'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/alertes" element={<Alertes />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/historique" element={<Historique />} />
        <Route path="/appareils" element={<Appareils />} />
        <Route path="/configuration" element={<ConfigurationLayout />}>
          <Route index element={<Regles />} />
          <Route path="regles" element={<Regles />} />
          <Route path="zones" element={<ZonesConfig />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
        </Route>
      </Route>
    </Routes>
  )
}
