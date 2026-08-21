import { http } from '../http'

export const thresholdsApi = {
  list: () => http.get('/thresholds').then((r) => r.data),
  get: (id) => http.get(`/thresholds/${id}`).then((r) => r.data),
  getByZone: (zoneId) =>
    http.get(`/thresholds/zone/${zoneId}`).then((r) => r.data).catch(() => null),
  create: (payload) => http.post('/thresholds', payload).then((r) => r.data),
  update: (id, payload) => http.put(`/thresholds/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/thresholds/${id}`),
}