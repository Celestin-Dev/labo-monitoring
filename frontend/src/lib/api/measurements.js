import { http } from '../http'

export const measurementsApi = {
  list: ({ zoneId, deviceId, limit = 100 } = {}) =>
    http.get('/measurements', { params: { zoneId, deviceId, limit } }).then((r) => r.data),

  latest: ({ zoneId, deviceId } = {}) =>
    http.get('/measurements/latest', { params: { zoneId, deviceId } })
      .then((r) => r.data)
      .catch(() => null),

  /** period: '1h' | '24h' | '7d' | '30d' */
  series: ({ zoneId, period = '24h' } = {}) =>
    http.get('/measurements/series', { params: { zoneId, period } }).then((r) => r.data),
}
