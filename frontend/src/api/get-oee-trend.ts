import { bilApi } from '@/lib/bil-api'

import { DashboardFilters } from './dashboard-filters'

export type GetOeeTrendResponse = {
  time: string
  oee: number
}[]

export async function getOeeTrend({ line, period }: DashboardFilters) {
  const response = await bilApi.get<GetOeeTrendResponse>('/metrics/oee-trend', {
    params: { line, period },
  })

  return response.data
}
