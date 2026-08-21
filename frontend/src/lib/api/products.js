import { http } from '../http'

export const productsApi = {
  list: (zoneId) => http.get('/products', { params: zoneId ? { zoneId } : {} }).then((r) => r.data),
  get: (id) => http.get(`/products/${id}`).then((r) => r.data),
  create: (payload) => http.post('/products', payload).then((r) => r.data),
  update: (id, payload) => http.put(`/products/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/products/${id}`),
}
