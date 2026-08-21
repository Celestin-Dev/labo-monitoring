import { http } from '../http'

export const alertsApi = {
  search: (filters = {}) => http.get('/alerts', { params: filters }).then((r) => r.data),
  get: (id) => http.get(`/alerts/${id}`).then((r) => r.data),
  recent: (limit = 10) => http.get('/alerts/recent', { params: { limit } }).then((r) => r.data),
  unresolved: () => http.get('/alerts/unresolved').then((r) => r.data),
  acknowledge: (id) => http.patch(`/alerts/${id}/acknowledge`).then((r) => r.data),
  resolve: (id) => http.patch(`/alerts/${id}/resolve`).then((r) => r.data),
}