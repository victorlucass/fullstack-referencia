import { bilApi } from '@/lib/bil-api'

export interface GetMonthRevenueResponse {
  receipt: number
  diffFromLastMonth: number
}

export async function getMonthRevenue() {
  const response = await bilApi.get<GetMonthRevenueResponse>(
    '/metrics/month-receipt',
  )

  return response.data
}
