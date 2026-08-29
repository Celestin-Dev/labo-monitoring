// Données de démonstration restantes.
// Toutes les autres entités (zones, appareils, mesures, alertes, produits,
// règles de seuils, dashboard) proviennent désormais de l'API réelle du
// backend Spring Boot (voir src/lib/api/) + du flux temps réel WebSocket
// (voir src/context/RealtimeContext.jsx et src/hooks/).
//
// Les utilisateurs restent mockés car le backend n'expose pas encore d'API
// Utilisateurs/Authentification (voir src/pages/configuration/Utilisateurs.jsx).

export const users = [
  { id: 'u-1', name: 'Admin Système', email: 'admin@labmonitor.mg', role: 'Administrateur', status: 'Actif' },
  { id: 'u-2', name: 'J. Rakoto', email: 'j.rakoto@labmonitor.mg', role: 'Technicien', status: 'Actif' },
  { id: 'u-3', name: 'H. Andria', email: 'h.andria@labmonitor.mg', role: 'Technicien', status: 'Actif' },
  { id: 'u-4', name: 'M. Rasoa', email: 'm.rasoa@labmonitor.mg', role: 'Observateur', status: 'Inactif' },
]
