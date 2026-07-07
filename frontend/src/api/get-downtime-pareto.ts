import { bilApi } from '@/lib/bil-api'

import { DashboardFilters } from './dashboard-filters'

export type GetDowntimeParetoResponse = {
  cause: string
  minutes: number
}[]

export async function getDowntimePareto({ line, period }: DashboardFilters) {
  const response = await bilApi.get<GetDowntimeParetoResponse>(
    '/metrics/downtime-pareto',
    { params: { line, period } },
  )

  return response.data
}
