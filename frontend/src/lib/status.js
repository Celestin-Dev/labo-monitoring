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

/**
 * Le backend renvoie ses enums en MAJUSCULES (NORMAL, WARNING, CRITICAL, OFFLINE).
 * Le frontend utilise des clés en minuscules pour STATUS_META. Cette fonction
 * fait le pont entre les deux, quel que soit le format reçu.
 */
export function normalizeStatus(value) {
  if (!value) return STATUS.OFFLINE
  if (STATUS[value]) return STATUS[value] // ex: "NORMAL" -> "normal"
  const lower = String(value).toLowerCase()
  return Object.values(STATUS).includes(lower) ? lower : STATUS.OFFLINE
}