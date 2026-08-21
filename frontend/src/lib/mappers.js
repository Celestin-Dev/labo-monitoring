/**
 * Le backend renvoie Measurment avec les champs coRaw / luminosity / timestamp (epoch ms).
 * Les composants de graphique (SensorChart) attendent { time, temperature, humidity, co, light }.
 */
export function toChartPoint(measurement) {
  if (!measurement) return null
  return {
    time: formatHourMinute(measurement.timestamp),
    timestamp: measurement.timestamp,
    temperature: measurement.temperature,
    humidity: measurement.humidity,
    co: measurement.coRaw,
    light: measurement.luminosity,
  }
}

export function toChartSeries(measurements = []) {
  return measurements.map(toChartPoint).filter(Boolean)
}

export function formatHourMinute(epochMillis) {
  if (!epochMillis) return ''
  return new Date(epochMillis).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(value) {
  if (!value) return '—'
  // Alert.timestamp est une chaîne ISO-8601 ; Measurment.timestamp est un epoch (ms)
  const date = typeof value === 'number' ? new Date(value) : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
