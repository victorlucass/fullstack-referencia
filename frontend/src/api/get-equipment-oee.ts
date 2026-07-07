import { bilApi } from '@/lib/bil-api'

import { DashboardFilters } from './dashboard-filters'

export type GetEquipmentOeeResponse = {
  machine: string
  oee: number
}[]

export async function getEquipmentOee({ line, period }: DashboardFilters) {
  const response = await bilApi.get<GetEquipmentOeeResponse>(
    '/metrics/equipment-oee',
    { params: { line, period } },
  )

  return response.data
}
