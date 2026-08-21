import { http } from '../http'

export const devicesApi = {
  list: (zoneId) => http.get('/devices', { params: zoneId ? { zoneId } : {} }).then((r) => r.data),
  get: (id) => http.get(`/devices/${id}`).then((r) => r.data),
  create: (payload) => http.post('/devices', payload).then((r) => r.data),
  update: (id, payload) => http.put(`/devices/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/devices/${id}`),
}