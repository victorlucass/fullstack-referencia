import { bilApi } from '@/lib/bil-api'

import { DashboardFilters } from './dashboard-filters'

export interface GetOeeOverviewResponse {
  oee: number
  availability: number
  performance: number
  quality: number
  production: number
  goals: {
    oee: number
    availability: number
    performance: number
    quality: number
    production: number
  }
  updatedAt: string
}

export async function getOeeOverview({ line, period }: DashboardFilters) {
  const response = await bilApi.get<GetOeeOverviewResponse>(
    '/metrics/oee-overview',
    { params: { line, period } },
  )

  return response.data
}
