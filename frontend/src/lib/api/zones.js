import { http } from '../http'

export const zonesApi = {
  list: () => http.get('/zones').then((r) => r.data),
  get: (id) => http.get(`/zones/${id}`).then((r) => r.data),
  latestMeasurement: (id) =>
    http.get(`/zones/${id}/latest-measurement`).then((r) => r.data).catch(() => null),
  create: (payload) => http.post('/zones', payload).then((r) => r.data),
  update: (id, payload) => http.put(`/zones/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/zones/${id}`),
}
