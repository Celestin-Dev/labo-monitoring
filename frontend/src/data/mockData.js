// Données simulées pour la supervision du laboratoire.
// À remplacer par des appels API / WebSocket vers le backend de supervision.

export const STATUS = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
  OFFLINE: 'offline',
}

export const STATUS_META = {
  [STATUS.NORMAL]: { label: 'Normal', dot: 'bg-status-normal', text: 'text-status-normal', bg: 'bg-status-normal/10', ring: 'ring-status-normal/30' },
  [STATUS.WARNING]: { label: 'Warning', dot: 'bg-status-warning', text: 'text-status-warning', bg: 'bg-status-warning/10', ring: 'ring-status-warning/30' },
  [STATUS.CRITICAL]: { label: 'Critical', dot: 'bg-status-critical', text: 'text-status-critical', bg: 'bg-status-critical/10', ring: 'ring-status-critical/30' },
  [STATUS.OFFLINE]: { label: 'Hors ligne', dot: 'bg-status-offline', text: 'text-status-offline', bg: 'bg-status-offline/10', ring: 'ring-status-offline/30' },
}

export const zones = [
  { id: 'zoneA', name: 'Zone A', description: 'Stockage', status: STATUS.NORMAL, temperature: 21.4, humidity: 54, co: 6, light: 110 },
  { id: 'zoneB', name: 'Zone B', description: 'Stockage chimique', status: STATUS.WARNING, temperature: 28.4, humidity: 61, co: 12, light: 95 },
  { id: 'zoneC', name: 'Zone C', description: 'Salle d\'analyse', status: STATUS.CRITICAL, temperature: 31.4, humidity: 66, co: 18, light: 140 },
  { id: 'zoneD', name: 'Zone D', description: 'Chambre froide', status: STATUS.NORMAL, temperature: 4.2, humidity: 38, co: 2, light: 60 },
  { id: 'zoneE', name: 'Zone E', description: 'Salle des serveurs', status: STATUS.OFFLINE, temperature: null, humidity: null, co: null, light: null },
]

export const globalStats = [
  { key: 'temperature', label: 'Temp.', value: 24.5, unit: '°C', status: STATUS.NORMAL },
  { key: 'humidity', label: 'Humidité', value: 54.2, unit: '%', status: STATUS.NORMAL },
  { key: 'co', label: 'CO', value: 7, unit: 'ppm', status: STATUS.NORMAL },
  { key: 'light', label: 'Light', value: 120, unit: 'lx', status: STATUS.NORMAL },
]

// Série temporelle sur 24h (toutes les heures) pour le graphique du dashboard
export const tempHumiditySeries = Array.from({ length: 24 }).map((_, i) => {
  const hour = `${String(i).padStart(2, '0')}:00`
  const base = 22 + Math.sin(i / 3) * 3
  return {
    time: hour,
    temperature: +(base + Math.random() * 1.2).toFixed(1),
    humidity: +(50 + Math.cos(i / 4) * 8 + Math.random() * 2).toFixed(1),
  }
})

export const coSeries = Array.from({ length: 24 }).map((_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  co: +(5 + Math.sin(i / 5) * 3 + Math.random() * 2).toFixed(1),
}))

export const lightSeries = Array.from({ length: 24 }).map((_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  light: Math.round(100 + Math.sin(i / 6) * 40 + Math.random() * 10),
}))

export const recentAlerts = [
  { id: 'al-1', severity: STATUS.CRITICAL, title: 'Zone C - Température critique', zone: 'Zone C', value: '31.4 °C', threshold: '30 °C', date: '2026-08-11T08:32:00', type: 'Température', acknowledged: false, resolved: false },
  { id: 'al-2', severity: STATUS.WARNING, title: 'Zone B - Mouvement nocturne', zone: 'Zone B', value: '—', threshold: '—', date: '2026-08-11T02:14:00', type: 'Sécurité', acknowledged: true, resolved: false },
  { id: 'al-3', severity: STATUS.WARNING, title: 'Zone B - Humidité élevée', zone: 'Zone B', value: '61 %', threshold: '60 %', date: '2026-08-10T19:05:00', type: 'Humidité', acknowledged: false, resolved: false },
  { id: 'al-4', severity: STATUS.CRITICAL, title: 'Zone A - Température élevée', zone: 'Zone A', value: '31.4 °C', threshold: '30 °C', date: '2026-08-11T08:32:00', type: 'Température', acknowledged: false, resolved: false },
  { id: 'al-5', severity: STATUS.OFFLINE, title: 'Zone E - Capteur hors ligne', zone: 'Zone E', value: '—', threshold: '—', date: '2026-08-10T14:47:00', type: 'Appareil', acknowledged: true, resolved: true },
  { id: 'al-6', severity: STATUS.NORMAL, title: 'Zone D - Retour à la normale', zone: 'Zone D', value: '4.2 °C', threshold: '5 °C', date: '2026-08-10T11:02:00', type: 'Température', acknowledged: true, resolved: true },
]

export const chemicalProducts = [
  { id: 'p-1', name: 'Produit A', ref: 'PROD-001', zone: 'A', tempMin: 15, tempMax: 20, humidityMax: 60, level: 'CRITIQUE' },
  { id: 'p-2', name: 'Produit B', ref: 'PROD-002', zone: 'B', tempMin: 10, tempMax: 25, humidityMax: 65, level: 'ÉLEVÉ' },
  { id: 'p-3', name: 'Produit C', ref: 'PROD-003', zone: 'A', tempMin: 5, tempMax: 15, humidityMax: 50, level: 'MODÉRÉ' },
  { id: 'p-4', name: 'Produit D', ref: 'PROD-004', zone: 'D', tempMin: 2, tempMax: 8, humidityMax: 45, level: 'FAIBLE' },
]

export const events = [
  { id: 'ev-1', date: '2026-08-11T08:32:00', zone: 'Zone C', type: 'Alerte', description: 'Seuil critique de température dépassé', actor: 'Système' },
  { id: 'ev-2', date: '2026-08-11T08:20:00', zone: 'Zone A', type: 'Accès', description: 'Badge #4521 - Entrée', actor: 'J. Rakoto' },
  { id: 'ev-3', date: '2026-08-11T02:14:00', zone: 'Zone B', type: 'Sécurité', description: 'Mouvement détecté hors horaires', actor: 'Capteur PIR-02' },
  { id: 'ev-4', date: '2026-08-10T19:05:00', zone: 'Zone B', type: 'Alerte', description: 'Humidité au-delà du seuil warning', actor: 'Système' },
  { id: 'ev-5', date: '2026-08-10T17:40:00', zone: 'Zone A', type: 'Maintenance', description: 'Calibration capteur température', actor: 'Tech. H. Andria' },
  { id: 'ev-6', date: '2026-08-10T14:47:00', zone: 'Zone E', type: 'Appareil', description: 'Perte de connexion capteur CO', actor: 'Système' },
]

export const devices = [
  { id: 'dev-1', name: 'Capteur TEMP-A1', zone: 'Zone A', type: 'Température', status: STATUS.NORMAL, battery: 92, lastSeen: '2026-08-11T09:00:00' },
  { id: 'dev-2', name: 'Capteur HUM-A1', zone: 'Zone A', type: 'Humidité', status: STATUS.NORMAL, battery: 88, lastSeen: '2026-08-11T09:00:00' },
  { id: 'dev-3', name: 'Capteur TEMP-B1', zone: 'Zone B', type: 'Température', status: STATUS.WARNING, battery: 64, lastSeen: '2026-08-11T08:58:00' },
  { id: 'dev-4', name: 'Capteur CO-C1', zone: 'Zone C', type: 'CO', status: STATUS.CRITICAL, battery: 45, lastSeen: '2026-08-11T08:59:00' },
  { id: 'dev-5', name: 'Capteur LUX-D1', zone: 'Zone D', type: 'Luminosité', status: STATUS.NORMAL, battery: 100, lastSeen: '2026-08-11T09:00:00' },
  { id: 'dev-6', name: 'Passerelle IoT-E', zone: 'Zone E', type: 'Passerelle', status: STATUS.OFFLINE, battery: 0, lastSeen: '2026-08-10T14:47:00' },
]

export const rules = [
  { id: 'r-1', name: 'Température Zone A', zone: 'Zone A', parameter: 'Température', warningMax: 28, criticalMax: 30, warningMin: 15, criticalMin: 10, enabled: true },
  { id: 'r-2', name: 'Humidité Zone A', zone: 'Zone A', parameter: 'Humidité', warningMax: 65, criticalMax: 75, warningMin: 30, criticalMin: 20, enabled: true },
  { id: 'r-3', name: 'Température Zone B', zone: 'Zone B', parameter: 'Température', warningMax: 26, criticalMax: 30, warningMin: 12, criticalMin: 8, enabled: true },
  { id: 'r-4', name: 'CO Zone C', zone: 'Zone C', parameter: 'CO', warningMax: 15, criticalMax: 25, warningMin: 0, criticalMin: 0, enabled: false },
]

export const users = [
  { id: 'u-1', name: 'Admin Système', email: 'admin@labmonitor.mg', role: 'Administrateur', status: 'Actif' },
  { id: 'u-2', name: 'J. Rakoto', email: 'j.rakoto@labmonitor.mg', role: 'Technicien', status: 'Actif' },
  { id: 'u-3', name: 'H. Andria', email: 'h.andria@labmonitor.mg', role: 'Technicien', status: 'Actif' },
  { id: 'u-4', name: 'M. Rasoa', email: 'm.rasoa@labmonitor.mg', role: 'Observateur', status: 'Inactif' },
]

export const zoneMonitoringSeries = (zoneId) => {
  const seed = zoneId?.charCodeAt(zoneId.length - 1) || 1
  return Array.from({ length: 24 }).map((_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    temperature: +(20 + Math.sin((i + seed) / 3) * 4 + Math.random()).toFixed(1),
    humidity: +(50 + Math.cos((i + seed) / 4) * 10 + Math.random() * 2).toFixed(1),
    co: +(5 + Math.sin((i + seed) / 5) * 4 + Math.random()).toFixed(1),
  }))
}
