import { http } from '../http'

export const dashboardApi = {
  overview: () => http.get('/dashboard/overview').then((r) => r.data),
}